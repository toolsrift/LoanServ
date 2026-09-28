import "server-only";
import { answer, extractLeadPrefill } from "./chat-agent";
import { redactPii } from "./chat-text";
import { CONTACT_CONSENT_VERSION } from "./apply-schema";
import type { ChatMessage } from "./chat-schema";
import { addDoNotCall, supabaseRest } from "./lead-store";
import { deliverLead, leadAlertText } from "./lead-delivery";
import { channelLabel, type Attribution } from "./attribution";
import { leadSourceHtml, leadSourceTag } from "./lead-source";
import { createRateLimiter, esc, sanitizeHeader } from "./email";
import { allowRequest } from "./rate-limit";
import { sendButtons, sendText, toWhatsAppText, type InboundMessage } from "./whatsapp";
import { site } from "./site";

/**
 * The WhatsApp assistant: same brain as the website chat (lib/chat-agent),
 * with conversation state in Supabase. It only replies to people who message
 * first, asks for explicit consent (with the same wording as the forms) before
 * turning a chat into a lead, and honours STOP.
 */

const HISTORY = 20;
const LEAD_COOLDOWN_MS = 24 * 3_600_000;

const CONSENT_YES = "consent_yes";
const CONSENT_NO = "consent_no";

const STOP = /^\s*(stop|unsubscribe|opt ?out|don'?t (call|message) me)\s*[.!]*\s*$/i;
const WANTS_CALL =
  /^\s*call\s*[.!]*\s*$|\b(call ?back|call me|(talk|speak) to (an? )?(advisor|agent|person|human|someone))\b/i;

// WhatsApp's policy requires a clear path from an automated chat to a human.
const DISCLOSURE =
  "Hi! You're chatting with LoanServ's *AI assistant*. I can answer questions about loans, EMIs, eligibility and documents — in English, Hindi or Telugu. LoanServ is a DSA facilitator, not a lender; rates are indicative. Please don't share Aadhaar, PAN or bank details here.\n\n" +
  `To talk to a person, reply *CALL* and an advisor will phone you, or call +91 ${site.phone.slice(-10)} (${site.hours}). Reply STOP any time.`;

const CONSENT_TEXT =
  "Would you like a LoanServ advisor to call you?\n\nBy tapping *Yes, call me* you agree to be contacted by LoanServ about your loan requirement — by phone, WhatsApp or email, including an automated AI voice callback — and accept our Privacy Policy: " +
  `${site.url}/legal/privacy-policy. LoanServ is a DSA facilitator, not a lender.`;

type Session = {
  wa_id: string;
  name: string | null;
  messages: ChatMessage[];
  ad_referral: InboundMessage["adReferral"] | null;
  lead_at: string | null;
  opted_out: boolean;
  seen_ids: string[];
};

const perUser = createRateLimiter({ globalLimit: 600 });
const daily = createRateLimiter({ globalLimit: Number.MAX_SAFE_INTEGER });

async function loadSession(waId: string): Promise<Session | null> {
  const res = await supabaseRest(`whatsapp_sessions?wa_id=eq.${waId}&select=*&limit=1`);
  if (!res?.ok) return null;
  const rows = (await res.json().catch(() => null)) as Session[] | null;
  return (
    rows?.[0] || { wa_id: waId, name: null, messages: [], ad_referral: null, lead_at: null, opted_out: false, seen_ids: [] }
  );
}

async function saveSession(s: Session): Promise<void> {
  await supabaseRest("whatsapp_sessions?on_conflict=wa_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify({ ...s, messages: s.messages.slice(-HISTORY), seen_ids: s.seen_ids.slice(-50), updated_at: new Date().toISOString() }),
  });
}

/** Only Indian mobiles become leads: "91" + 10 digits starting 6–9. */
const indianMobile = (waId: string) => (/^91[6-9]\d{9}$/.test(waId) ? waId.slice(2) : null);

function attributionFor(s: Session): Attribution {
  return s.ad_referral
    ? { source: "facebook", medium: "whatsapp-ad", campaign: s.ad_referral.headline, metaAds: true, landingPage: "whatsapp" }
    : { source: "whatsapp", medium: "chat", landingPage: "whatsapp" };
}

async function createLead(s: Session, mobile: string): Promise<void> {
  const p = await extractLeadPrefill(s.messages);
  const attribution = attributionFor(s);
  const channel = channelLabel(attribution);
  const timestamp = new Date().toISOString();
  const name = s.name || "WhatsApp user";

  const transcript = s.messages
    .map((m) => `<p style="margin:0 0 8px"><b>${m.role === "user" ? "Customer" : "Assistant"}:</b> ${esc(redactPii(m.content)).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const row = (k: string, v: unknown) => (v ? `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>` : "");
  const html = `
    <h2>New WhatsApp lead — ${esc(site.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${row("Name (WhatsApp profile)", name)}
      ${row("Mobile / WhatsApp", `+91 ${mobile}`)}
      ${row("Category", p.category)}
      ${row("Loan type", p.loanType)}
      ${row("Amount", p.amount && `₹${p.amount}`)}
      ${row("City", p.city)}
      ${row("Employment", p.employment)}
      ${row("Monthly salary", p.monthlySalary && `₹${p.monthlySalary}`)}
      ${row("Consent", "Yes — tapped “Yes, call me” on WhatsApp after the consent text, incl. an automated voice callback")}
      ${row("Consent version", CONTACT_CONSENT_VERSION)}
      ${row("Consent timestamp", timestamp)}
    </table>
    ${leadSourceHtml(attribution)}
    ${transcript ? `<h3>WhatsApp conversation</h3><div style="font-size:14px">${transcript}</div>` : ""}
    <p style="color:#888;font-size:12px">Details above were read from the chat by AI — confirm them on the call.</p>
  `;

  const canCall = p.category && p.amount && p.city && p.employment;
  await deliverLead({
    record: {
      form: "whatsapp",
      fullName: name,
      mobile,
      email: "",
      category: p.category,
      loanType: p.loanType,
      amount: p.amount,
      city: p.city,
      employment: p.employment,
      channel,
      attribution,
      details: { monthlySalary: p.monthlySalary, transcript: s.messages.map((m) => ({ role: m.role, content: redactPii(m.content) })) },
      consent: { version: CONTACT_CONSENT_VERSION, timestamp, ip: "whatsapp" },
    },
    email: { subject: sanitizeHeader(`New WhatsApp lead: ${p.category || "Loan"} — ${name}${leadSourceTag(attribution)}`), html },
    alertText: leadAlertText({ form: "WhatsApp", fullName: name, mobile, category: p.category, amount: p.amount, city: p.city, channel }),
    // The voice agent needs the basics; without them an advisor calls instead.
    voice: canCall
      ? {
          fullName: name,
          mobile,
          email: "",
          category: p.category!,
          loanType: p.loanType || "Fresh",
          amount: p.amount!,
          city: p.city!,
          employment: p.employment!,
          monthlySalary: p.monthlySalary ? String(p.monthlySalary) : "",
          consentVersion: CONTACT_CONSENT_VERSION,
          consentTimestamp: timestamp,
        }
      : undefined,
  });
}

const offerCallback = (to: string) =>
  sendButtons(to, CONSENT_TEXT, [
    { id: CONSENT_YES, title: "Yes, call me" },
    { id: CONSENT_NO, title: "Not now" },
  ]);

/** Handles one inbound WhatsApp message end to end. Never throws. */
export async function handleInbound(msg: InboundMessage): Promise<void> {
  try {
    const s = await loadSession(msg.waId);
    if (!s) return; // store unreachable — Meta will retry the webhook
    if (s.seen_ids.includes(msg.id)) return; // duplicate delivery
    s.seen_ids.push(msg.id);
    if (msg.name) s.name = msg.name;
    if (msg.adReferral && !s.ad_referral) s.ad_referral = msg.adReferral;
    const isNew = s.messages.length === 0 && !s.lead_at;
    const mobile = indianMobile(msg.waId);

    // Opt-out always wins, whatever the state.
    if (msg.kind === "text" && STOP.test(msg.text || "")) {
      s.opted_out = true;
      if (mobile) await addDoNotCall(mobile, "whatsapp stop", "whatsapp-bot");
      await saveSession(s);
      await sendText(msg.waId, "Done — LoanServ won't call or message you about this. If you need us later, just write to this number.");
      return;
    }
    // Writing again after STOP is the person re-engaging; replying is fine, calling is not (DNC stays).
    if (s.opted_out && msg.kind === "text") s.opted_out = false;

    if (msg.kind === "button") {
      if (msg.buttonId === CONSENT_YES) {
        if (!mobile) {
          await sendText(msg.waId, "Sorry — our advisors can only call Indian mobile numbers. You can still ask me anything here.");
        } else if (s.lead_at && Date.now() - Date.parse(s.lead_at) < LEAD_COOLDOWN_MS) {
          await sendText(msg.waId, "You're all set — an advisor already has your request and will call you soon.");
        } else {
          s.lead_at = new Date().toISOString();
          await saveSession(s);
          await createLead(s, mobile);
          await sendText(
            msg.waId,
            `Thank you${s.name ? `, ${s.name.split(" ")[0]}` : ""}! A LoanServ advisor will call you on +91 ${mobile} shortly (Mon–Sat, 10 AM – 7 PM). Anything else I can help with meanwhile?`,
          );
        }
      } else if (msg.buttonId === CONSENT_NO) {
        await sendText(msg.waId, "No problem — ask me anything else, or tap *Yes, call me* later if you change your mind.");
      }
      await saveSession(s);
      return;
    }

    if (msg.kind !== "text" || !msg.text) {
      await sendText(msg.waId, "I can only read text messages. Please type your question.");
      await saveSession(s);
      return;
    }

    if (isNew) await sendText(msg.waId, DISCLOSURE);
    s.messages.push({ role: "user", content: msg.text });

    // Asking for a call doesn't need the model.
    if (WANTS_CALL.test(msg.text) && !s.lead_at) {
      await saveSession(s);
      await offerCallback(msg.waId);
      return;
    }

    const allowed =
      (await allowRequest(perUser, `wa:${msg.waId}`, 20)) &&
      (await allowRequest(daily, "chat:all", Number(process.env.CHAT_DAILY_LIMIT) || 3000, 86_400_000));
    const result = allowed ? await answer(s.messages.slice(-HISTORY)) : null;

    if (!result?.ok) {
      await saveSession(s);
      await sendText(msg.waId, "Sorry, I can't answer right now. Would you like an advisor to call you instead?");
      if (!s.lead_at) await offerCallback(msg.waId);
      return;
    }

    s.messages.push({ role: "assistant", content: result.reply.slice(0, 4000) });
    await saveSession(s);
    await sendText(msg.waId, toWhatsAppText(result.reply, result.sources));
    if (result.offerLeadForm && !s.lead_at) await offerCallback(msg.waId);
  } catch (err) {
    console.error("[whatsapp] handler error:", err instanceof Error ? err.message : "unknown");
  }
}
