import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";

/**
 * Partner referrals and the WhatsApp assistant, against a fake fetch that
 * routes Supabase, Meta Graph and Sarvam requests.
 */
type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };
const calls: Call[] = [];
let respond: (c: Call) => { status?: number; json?: unknown } = () => ({ json: [] });

globalThis.fetch = (async (input: string | URL | Request, init: RequestInit = {}) => {
  const headers: Record<string, string> = {};
  new Headers(init.headers).forEach((v, k) => (headers[k] = v));
  const c: Call = {
    url: String(input),
    method: init.method || "GET",
    headers,
    body: typeof init.body === "string" ? JSON.parse(init.body) : undefined,
  };
  calls.push(c);
  const r = respond(c);
  return new Response(JSON.stringify(r.json ?? {}), { status: r.status ?? 200 });
}) as typeof fetch;

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

beforeEach(() => {
  calls.length = 0;
  respond = () => ({ json: [] });
  Object.assign(process.env, {
    SUPABASE_URL: "https://db.example.co",
    SUPABASE_SERVICE_ROLE_KEY: "srk",
    WHATSAPP_BOT_ENABLED: "true",
    WHATSAPP_ACCESS_TOKEN: "wa-token",
    WHATSAPP_PHONE_NUMBER_ID: "12345",
    WHATSAPP_APP_SECRET: "app-secret",
    WHATSAPP_VERIFY_TOKEN: "verify-me",
    SARVAM_API_KEY: "sk",
  });
});

const partners = await import("../src/lib/partners");
const wa = await import("../src/lib/whatsapp");
const bot = await import("../src/lib/whatsapp-bot");

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

test("verifyPartner checks the key hash and rejects bad input without querying", async () => {
  respond = () => ({ json: [{ code: "sri-sai", name: "Sri Sai Builders", key_hash: sha("a-long-secret-key-123") }] });
  assert.deepEqual(await partners.verifyPartner("sri-sai", "a-long-secret-key-123"), { code: "sri-sai", name: "Sri Sai Builders" });
  assert.ok(calls[0].url.includes("/rest/v1/partners?code=eq.sri-sai&active=is.true"));
  assert.equal(await partners.verifyPartner("sri-sai", "wrong-key-but-long-enough"), null);

  calls.length = 0;
  assert.equal(await partners.verifyPartner("Bad Code!", "a-long-secret-key-123"), null);
  assert.equal(await partners.verifyPartner("sri-sai", "short"), null);
  assert.equal(calls.length, 0, "invalid input never reaches the database");
});

test("createReferral stores only the token hash", async () => {
  const r = await partners.createReferral({ code: "sri-sai", name: "Sri Sai" }, {
    fullName: "Ravi Kumar", mobile: "9876543210", category: "Home", loanType: "Fresh", amount: 2500000, city: "Hyderabad", employment: "Salaried",
  });
  assert.ok(r && r.token.length >= 20);
  const body = calls[0].body as Record<string, unknown>;
  assert.equal(body.token_hash, sha(r!.token));
  assert.ok(!JSON.stringify(body).includes(r!.token), "raw token never stored");
});

test("referral lookup expires pending links; settle is a one-shot filtered update", async () => {
  const old = new Date(Date.now() - 8 * 864e5).toISOString();
  respond = () => ({ json: [{ status: "pending", created_at: old, mobile: "9876543210" }] });
  assert.equal((await partners.getReferralByToken("x".repeat(32)))!.status, "expired");
  assert.equal(await partners.getReferralByToken("bad token"), null);

  calls.length = 0;
  respond = () => ({ json: [{ id: 7, status: "confirmed", created_at: new Date().toISOString() }] });
  const r = await partners.settleReferral("y".repeat(32), "confirmed", { email: "a@b.in" });
  assert.equal(r!.id, 7);
  assert.equal(calls[0].method, "PATCH");
  assert.match(calls[0].url, /status=eq\.pending&created_at=gte\./);
  respond = () => ({ json: [] });
  assert.equal(await partners.settleReferral("y".repeat(32), "confirmed"), null, "already used or expired");
});

test("partner list masks customer mobiles", async () => {
  respond = () => ({ json: [{ full_name: "Ravi", mobile: "9876543210", category: "Home", amount: 100000, city: "Hyderabad", status: "pending", created_at: new Date().toISOString() }] });
  const rows = await partners.listReferrals({ code: "sri-sai", name: "Sri Sai" });
  assert.equal(rows![0].mobile, "98XXXXX210");
  assert.equal(partners.maskMobile("+91 98765 43210"), "98XXXXX210");
});

// ---------------------------------------------------------------------------
// WhatsApp client
// ---------------------------------------------------------------------------

test("webhook verification and signatures", () => {
  const q = (o: Record<string, string>) => new URLSearchParams(o);
  assert.equal(wa.verifyWebhookChallenge(q({ "hub.mode": "subscribe", "hub.verify_token": "verify-me", "hub.challenge": "42" })), "42");
  assert.equal(wa.verifyWebhookChallenge(q({ "hub.mode": "subscribe", "hub.verify_token": "nope", "hub.challenge": "42" })), null);

  const body = '{"entry":[]}';
  const sig = "sha256=" + createHmac("sha256", "app-secret").update(body).digest("hex");
  assert.equal(wa.verifyWhatsAppSignature(body, sig), true);
  assert.equal(wa.verifyWhatsAppSignature(body + " ", sig), false);
  assert.equal(wa.verifyWhatsAppSignature(body, null), false);
  delete process.env.WHATSAPP_APP_SECRET;
  assert.equal(wa.verifyWhatsAppSignature(body, sig), false, "no secret → reject");
});

test("parseInbound reads text, buttons and ad referrals; ignores statuses", () => {
  const payload = {
    entry: [{ changes: [{ value: {
      contacts: [{ wa_id: "919876543210", profile: { name: "Ravi" } }],
      messages: [
        { id: "m1", from: "919876543210", type: "text", text: { body: "home loan docs?" }, referral: { headline: "Home loan BT offer", source_url: "https://fb.me/x" } },
        { id: "m2", from: "919876543210", type: "interactive", interactive: { type: "button_reply", button_reply: { id: "consent_yes", title: "Yes, call me" } } },
        { id: "m3", from: "919876543210", type: "image" },
      ],
      statuses: [{ id: "s1", status: "delivered" }],
    } }] }],
  };
  const msgs = wa.parseInbound(payload);
  assert.equal(msgs.length, 3);
  assert.deepEqual([msgs[0].kind, msgs[0].name, msgs[0].text], ["text", "Ravi", "home loan docs?"]);
  assert.equal(msgs[0].adReferral?.headline, "Home loan BT offer");
  assert.deepEqual([msgs[1].kind, msgs[1].buttonId], ["button", "consent_yes"]);
  assert.equal(msgs[2].kind, "other");
  assert.deepEqual(wa.parseInbound({ nonsense: true }), []);
});

test("toWhatsAppText converts formatting and links", () => {
  assert.equal(
    wa.toWhatsAppText("**Documents**: see [home loan](/loans/home-loan).", [{ title: "Home Loan", url: "/loans/home-loan" }]),
    "*Documents*: see home loan: https://loanserv.in/loans/home-loan.\n\nRead more: https://loanserv.in/loans/home-loan",
  );
});

// ---------------------------------------------------------------------------
// WhatsApp assistant flows
// ---------------------------------------------------------------------------

type Session = Record<string, unknown>;
let session: Session | null;
const sent: Record<string, unknown>[] = [];
const upserts: Session[] = [];

function botBackend(c: Call): { status?: number; json?: unknown } {
  if (c.url.includes("/whatsapp_sessions")) {
    if (c.method === "GET") return { json: session ? [session] : [] };
    upserts.push(c.body as Session);
    session = c.body as Session;
    return {};
  }
  if (c.url.startsWith("https://graph.facebook.com/")) {
    sent.push(c.body as Record<string, unknown>);
    return { json: { messages: [{ id: "out" }] } };
  }
  if (c.url.includes("api.sarvam.ai")) {
    return { json: { choices: [{ message: { content: "You need **KYC** and income proof. See [home loan](/loans/home-loan)." } }] } };
  }
  return { json: [] }; // leads, do_not_call, etc.
}

const msg = (over: Partial<Parameters<typeof bot.handleInbound>[0]>) => ({
  id: `m${Math.random()}`, waId: "919876543210", name: "Ravi Kumar", kind: "text" as const, text: "hi", ...over,
});

beforeEach(() => {
  session = null;
  sent.length = 0;
  upserts.length = 0;
  respond = botBackend;
});

test("first message gets the AI disclosure, then an answer", async () => {
  await bot.handleInbound(msg({ text: "What documents for a home loan?" }));
  const texts = sent.map((s) => (s.text as { body: string } | undefined)?.body || "");
  assert.match(texts[0], /AI assistant/);
  assert.match(texts[0], /To talk to a person, reply \*CALL\*/, "human escalation path");
  assert.match(texts[1], /\*KYC\*/);
  assert.match(texts[1], /https:\/\/loanserv\.in\/loans\/home-loan/);
  assert.equal((session!.messages as unknown[]).length, 2);
});

test("duplicate deliveries are ignored", async () => {
  const m = msg({ id: "same-id", text: "hello" });
  await bot.handleInbound(m);
  const n = sent.length;
  await bot.handleInbound(m);
  assert.equal(sent.length, n);
});

test("replying CALL shows consent buttons too", async () => {
  await bot.handleInbound(msg({ text: "CALL" }));
  assert.ok(sent.some((s) => s.type === "interactive"));
});

test("asking for a call shows consent buttons without calling the model", async () => {
  await bot.handleInbound(msg({ text: "please call me back" }));
  const buttons = sent.find((s) => s.type === "interactive") as { interactive: { body: { text: string } } };
  assert.ok(buttons, "consent buttons sent");
  assert.match(buttons.interactive.body.text, /automated AI voice callback/);
  assert.ok(!calls.some((c) => c.url.includes("api.sarvam.ai")));
});

test("'Yes, call me' creates one lead; a repeat within 24h doesn't", async () => {
  await bot.handleInbound(msg({ text: "I need a 5 lakh personal loan in Hyderabad" }));
  calls.length = 0;
  await bot.handleInbound(msg({ kind: "button", buttonId: "consent_yes", text: undefined }));
  const leadInserts = calls.filter((c) => c.url.endsWith("/rest/v1/leads") && c.method === "POST");
  assert.equal(leadInserts.length, 1);
  const lead = leadInserts[0].body as Record<string, unknown>;
  assert.equal(lead.form, "whatsapp");
  assert.equal(lead.mobile, "9876543210");
  assert.equal(lead.consent_version, "2.0");
  assert.ok(session!.lead_at);
  assert.match(JSON.stringify(sent.at(-1)), /advisor will call you on \+91 9876543210/);

  calls.length = 0;
  await bot.handleInbound(msg({ kind: "button", buttonId: "consent_yes", text: undefined }));
  assert.equal(calls.filter((c) => c.url.endsWith("/rest/v1/leads")).length, 0);
});

test("STOP opts out and adds the number to do-not-call", async () => {
  await bot.handleInbound(msg({ text: "STOP" }));
  const dnc = calls.find((c) => c.url.endsWith("/rest/v1/do_not_call") && c.method === "POST");
  assert.equal((dnc!.body as { mobile: string }).mobile, "9876543210");
  assert.equal(session!.opted_out, true);
  assert.match(JSON.stringify(sent.at(-1)), /won't call or message you/);
});

test("non-Indian numbers can chat but can't become leads", async () => {
  await bot.handleInbound(msg({ waId: "14155550100", kind: "button", buttonId: "consent_yes", text: undefined }));
  assert.equal(calls.filter((c) => c.url.endsWith("/rest/v1/leads")).length, 0);
  assert.match(JSON.stringify(sent.at(-1)), /only call Indian mobile numbers/);
});
