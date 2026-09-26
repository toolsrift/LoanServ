import { NextResponse } from "next/server";
import { CONTACT_CONSENT_VERSION } from "@/lib/apply-schema";
import { chatLeadSchema } from "@/lib/chat-schema";
import { redactPii } from "@/lib/chat-text";
import { sendLeadEmail, rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { requestCallback } from "@/lib/voice-agent";
import { site } from "@/lib/site";
import { leadSourceHtml, leadSourceTag } from "@/lib/lead-source";

export const runtime = "nodejs";

/**
 * Callback request from the chat assistant. Same lead path as /api/apply:
 * validated, consent recorded, emailed to LEAD_TO_EMAIL, then (if configured)
 * handed to the voice agent. The chat transcript rides along so the advisor
 * has context — with any pasted identifiers redacted.
 */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  if (!rateLimit(`chat-lead:${ip}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = chatLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  }
  const d = parsed.data;

  // Honeypot — silently accept but drop.
  if (d.company_website) {
    return NextResponse.json({ ok: true });
  }

  const consentRecord = {
    timestamp: new Date().toISOString(),
    ip,
    consentVersion: CONTACT_CONSENT_VERSION,
  };

  const transcript = d.transcript
    .map(
      (m) =>
        `<p style="margin:0 0 8px"><b>${m.role === "user" ? "Visitor" : "Assistant"}:</b> ${esc(
          redactPii(m.content),
        ).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const html = `
    <h2>New chat lead — ${esc(site.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(d.fullName)}</td></tr>
      <tr><td><b>Mobile</b></td><td>+91 ${esc(d.mobile)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(d.email)}</td></tr>
      <tr><td><b>Category</b></td><td>${esc(d.category)}</td></tr>
      <tr><td><b>Loan type</b></td><td>${esc(d.loanType)}</td></tr>
      <tr><td><b>Amount</b></td><td>₹${esc(d.amount)}</td></tr>
      <tr><td><b>City</b></td><td>${esc(d.city)}</td></tr>
      <tr><td><b>Employment</b></td><td>${esc(d.employment)}</td></tr>
      ${d.monthlySalary ? `<tr><td><b>Monthly salary</b></td><td>₹${esc(d.monthlySalary)}</td></tr>` : ""}
      <tr><td><b>Consent</b></td><td>Yes — user agreed to be contacted, incl. an automated voice callback</td></tr>
      <tr><td><b>Consent version</b></td><td>${esc(consentRecord.consentVersion)}</td></tr>
      <tr><td><b>Consent timestamp</b></td><td>${esc(consentRecord.timestamp)}</td></tr>
      <tr><td><b>Consent IP</b></td><td>${esc(consentRecord.ip)}</td></tr>
    </table>
    ${leadSourceHtml(d.attribution)}
    ${transcript ? `<h3>Chat transcript</h3><div style="font-size:14px">${transcript}</div>` : ""}
    <p style="color:#888;font-size:12px">Submitted via the loanserv.in chat assistant. Assistant replies are AI-generated.</p>
  `;

  const subject = sanitizeHeader(`New chat lead: ${d.category} — ${d.fullName} (${d.city})${leadSourceTag(d.attribution)}`);

  // A console log is NOT durable — see the same note in the apply route.
  const logConsent = () =>
    console.info("CONSENT_RECORD", JSON.stringify({ form: "chat", ...consentRecord }));

  try {
    const { sent } = await sendLeadEmail({ subject, html, replyTo: d.email });
    if (!sent) logConsent();
  } catch (err) {
    console.error("[chat-lead] email send failed:", err instanceof Error ? err.message : "unknown");
    logConsent();
  }

  // Same consent text as /apply (version 2.0 covers the AI voice callback), so
  // the same speed-to-lead call applies. Runs last; never throws.
  const voice = await requestCallback({
    fullName: d.fullName,
    mobile: d.mobile,
    email: d.email,
    category: d.category,
    loanType: d.loanType,
    amount: d.amount,
    city: d.city,
    employment: d.employment,
    monthlySalary: d.monthlySalary,
    consentVersion: consentRecord.consentVersion,
    consentTimestamp: consentRecord.timestamp,
  });
  if (!voice.queued && voice.reason !== "not-configured") {
    console.info("[chat-lead] voice callback not queued:", voice.reason);
  }

  return NextResponse.json({ ok: true });
}
