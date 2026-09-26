import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

/**
 * Integrations (Supabase, Telegram, Upstash, Sarvam, Dograh) are exercised
 * against a fake fetch, so tests never touch the network or real accounts.
 */
type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };
const calls: Call[] = [];
let respond: (c: Call) => { status?: number; json?: unknown } | Error = () => ({ json: {} });

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
  if (r instanceof Error) throw r;
  return new Response(JSON.stringify(r.json ?? {}), { status: r.status ?? 200 });
}) as typeof fetch;

const ENV_KEYS = [
  "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID",
  "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "SARVAM_API_KEY", "SARVAM_CHAT_URL", "SARVAM_CHAT_MODEL",
  "VOICE_AGENT_ENABLED", "DOGRAH_API_URL", "DOGRAH_API_KEY", "DOGRAH_TRIGGER_UUID",
  "DOGRAH_TELEPHONY_CONFIG_ID", "DOGRAH_FROM_PHONE_NUMBER_ID", "DOGRAH_WEBHOOK_SECRET",
];
beforeEach(() => {
  calls.length = 0;
  respond = () => ({ json: {} });
  for (const k of ENV_KEYS) delete process.env[k];
});

const store = await import("../src/lib/lead-store");
const alerts = await import("../src/lib/alerts");
const rl = await import("../src/lib/rate-limit");
const { createRateLimiter } = await import("../src/lib/email");
const sarvam = await import("../src/lib/sarvam");
const voice = await import("../src/lib/voice-agent");

const lead = {
  fullName: "Ravi  Kumar", mobile: "9876543210", email: "r@x.in", category: "Personal", loanType: "Fresh",
  amount: 500000, city: "Hyderabad", employment: "Salaried", monthlySalary: "60000",
  consentVersion: "2.0", consentTimestamp: "2026-09-26T05:29:00Z",
};
const useSupabase = () => Object.assign(process.env, { SUPABASE_URL: "https://db.example.co/", SUPABASE_SERVICE_ROLE_KEY: "srk" });

test("lead store: off without config, writes with the service key when on", async () => {
  assert.deepEqual(
    await store.saveLead({ form: "apply", fullName: "A", mobile: "9876543210", email: "a@b.in", channel: "Direct", consent: { version: "2.0", timestamp: "t", ip: "1.1.1.1" } }),
    { saved: false, reason: "not-configured" },
  );
  assert.equal(calls.length, 0);
  assert.equal(await store.isDoNotCall("9876543210"), null);

  useSupabase();
  const r = await store.saveLead({ form: "chat", fullName: "A", mobile: "+91 98765 43210", email: "a@b.in", channel: "Google Ads", consent: { version: "2.0", timestamp: "t", ip: "1.1.1.1" } });
  assert.deepEqual(r, { saved: true });
  assert.equal(calls[0].url, "https://db.example.co/rest/v1/leads");
  assert.equal(calls[0].headers.apikey, "srk");
  assert.equal(calls[0].headers.authorization, "Bearer srk");
  assert.equal((calls[0].body as { mobile: string }).mobile, "9876543210");

  respond = () => ({ status: 500 });
  assert.deepEqual(await store.saveLead({ form: "apply", fullName: "A", mobile: "9876543210", email: "a@b.in", channel: "x", consent: { version: "2", timestamp: "t", ip: "i" } }), { saved: false, reason: "http-500" });
  respond = () => new Error("down");
  assert.deepEqual(await store.saveLead({ form: "apply", fullName: "A", mobile: "9876543210", email: "a@b.in", channel: "x", consent: { version: "2", timestamp: "t", ip: "i" } }), { saved: false, reason: "network-error" });
});

test("do-not-call list", async () => {
  useSupabase();
  respond = () => ({ json: [{ mobile: "9876543210" }] });
  assert.equal(await store.isDoNotCall("+919876543210"), true);
  assert.ok(calls[0].url.endsWith("/rest/v1/do_not_call?mobile=eq.9876543210&select=mobile&limit=1"));
  respond = () => ({ json: [] });
  assert.equal(await store.isDoNotCall("9876543210"), false);
  respond = () => ({ status: 401 });
  assert.equal(await store.isDoNotCall("9876543210"), null);
  respond = () => ({});
  assert.equal(await store.addDoNotCall("+91 98765-43210", "do_not_call", "voice-agent"), true);
  assert.match(calls.at(-1)!.headers.prefer, /resolution=ignore-duplicates/);
  assert.equal(await store.addDoNotCall("12345", "x", "y"), false, "invalid number rejected");
});

test("telegram alerts", async () => {
  assert.equal(await alerts.sendAlert("hi"), false);
  assert.equal(calls.length, 0);
  Object.assign(process.env, { TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "-100" });
  assert.equal(await alerts.sendAlert("New lead"), true);
  assert.equal(calls[0].url, "https://api.telegram.org/bot123:abc/sendMessage");
  assert.deepEqual(calls[0].body, { chat_id: "-100", text: "New lead", disable_web_page_preview: true });
  respond = () => new Error("down");
  assert.equal(await alerts.sendAlert("x"), false);
});

test("shared rate limit uses Upstash and falls back to memory", async () => {
  const mem = createRateLimiter();
  assert.equal(await rl.allowRequest(mem, "k", 1), true);
  assert.equal(await rl.allowRequest(mem, "k", 1), false, "in-memory when unconfigured");
  assert.equal(calls.length, 0);

  Object.assign(process.env, { UPSTASH_REDIS_REST_URL: "https://up.example.io", UPSTASH_REDIS_REST_TOKEN: "tok" });
  let n = 0;
  respond = () => ({ json: [{ result: ++n }, { result: 1 }] });
  const fresh = createRateLimiter();
  assert.equal(await rl.allowRequest(fresh, "ip", 2), true);
  assert.equal(await rl.allowRequest(fresh, "ip", 2), true);
  assert.equal(await rl.allowRequest(fresh, "ip", 2), false);
  assert.equal(calls[0].url, "https://up.example.io/pipeline");
  assert.equal(calls[0].headers.authorization, "Bearer tok");
  assert.match((calls[0].body as string[][])[0][1], /^rl:ip:\d+$/);
  respond = () => new Error("down");
  assert.equal(await rl.allowRequest(fresh, "other", 1), true, "falls back when Upstash is down");
});

test("sarvam client", async () => {
  assert.deepEqual(await sarvam.sarvamChat({ messages: [{ role: "user", content: "hi" }] }), { ok: false, reason: "not-configured" });
  process.env.SARVAM_API_KEY = "sk";
  respond = () => ({ json: { choices: [{ message: { content: "Namaste" } }] } });
  assert.deepEqual(await sarvam.sarvamChat({ messages: [{ role: "user", content: "hi" }], maxTokens: 50, temperature: 0 }), { ok: true, text: "Namaste" });
  assert.equal(calls[0].url, "https://api.sarvam.ai/v1/chat/completions");
  assert.equal(calls[0].headers["api-subscription-key"], "sk");
  assert.equal((calls[0].body as { model: string }).model, "sarvam-105b-conversations");
  respond = () => ({ status: 401 });
  assert.deepEqual(await sarvam.sarvamChat({ messages: [{ role: "user", content: "hi" }] }), { ok: false, reason: "http-401" });
  respond = () => ({ json: { choices: [{ message: { content: null } }] } });
  assert.deepEqual(await sarvam.sarvamChat({ messages: [{ role: "user", content: "hi" }] }), { ok: false, reason: "empty-reply" });
});

test("voice callback: gates, do-not-call check and Dograh request", async (t) => {
  // 11:00 IST — inside the calling window.
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-26T05:30:00Z") });
  assert.deepEqual(await voice.requestCallback(lead), { queued: false, reason: "not-configured" });

  Object.assign(process.env, { VOICE_AGENT_ENABLED: "true", DOGRAH_API_URL: "https://dograh.example/", DOGRAH_API_KEY: "dg", DOGRAH_TRIGGER_UUID: "trig-1" });
  assert.deepEqual(await voice.requestCallback(lead), { queued: false, reason: "dnc-list-not-configured" });

  useSupabase();
  respond = (c) => (c.url.includes("/do_not_call") ? { json: [{ mobile: "9876543210" }] } : { json: {} });
  assert.deepEqual(await voice.requestCallback(lead), { queued: false, reason: "do-not-call" });
  respond = (c) => (c.url.includes("/do_not_call") ? { status: 500 } : { json: {} });
  assert.deepEqual(await voice.requestCallback(lead), { queued: false, reason: "dnc-check-failed" });

  calls.length = 0;
  respond = (c) => (c.url.includes("/do_not_call") ? { json: [] } : { json: { status: "initiated", workflow_run_id: 12345 } });
  assert.deepEqual(await voice.requestCallback(lead), { queued: true, callId: "12345" });
  const call = calls.find((c) => c.url.includes("/public/agent/"))!;
  assert.equal(call.url, "https://dograh.example/api/v1/public/agent/trig-1");
  assert.equal(call.headers["x-api-key"], "dg");
  const body = call.body as { phone_number: string; initial_context: Record<string, string> };
  assert.equal(body.phone_number, "+919876543210");
  assert.equal(body.initial_context.first_name, "Ravi");
  assert.equal(body.initial_context.amount_words, "5 lakh rupees");
  assert.ok(!("email" in body.initial_context));

  t.mock.timers.setTime(new Date("2026-09-26T14:00:00Z").getTime()); // 19:30 IST
  assert.deepEqual(await voice.requestCallback(lead), { queued: false, reason: "outside-calling-window" });
});

test("voice helpers", () => {
  assert.equal(voice.amountInWords(500000), "5 lakh rupees");
  assert.equal(voice.amountInWords(12000000), "1.2 crore rupees");
  assert.equal(voice.amountInWords(75000), "75 thousand rupees");
  assert.equal(voice.verifyWebhookAuth("Bearer x"), false, "rejects when no secret is set");
  process.env.DOGRAH_WEBHOOK_SECRET = "s3cret";
  assert.equal(voice.verifyWebhookAuth("Bearer s3cret"), true);
  assert.equal(voice.verifyWebhookAuth("Bearer nope"), false);
  assert.equal(voice.verifyWebhookAuth(null), false);
});
