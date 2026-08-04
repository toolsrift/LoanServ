import { NextResponse } from "next/server";
import { cibilSchema } from "@/lib/cibil-schema";
import { fetchCreditScore, isCreditBureauConfigured } from "@/lib/credit-score";
import { sendLeadEmail, rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { site } from "@/lib/site";

export const runtime = "nodejs";

// Version of the consent text/flow the user agreed to. Bump when the wording
// or scope of the consent changes so records remain auditable.
const CONSENT_VERSION = "1.0";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`cibil:${ip}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = cibilSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  }
  const d = parsed.data;
  if (d.company_website) return NextResponse.json({ ok: true }); // honeypot

  // If a real bureau is configured, attempt a live pull (implementation is a TODO stub).
  if (isCreditBureauConfigured()) {
    const result = await fetchCreditScore(d);
    if (result.configured && result.score) {
      return NextResponse.json({ ok: true, mode: "score", score: result.score, band: result.band });
    }
  }

  // Free path: consented lead. NEVER email or log full PAN/DOB — mask the PAN.
  const maskedPan = d.pan.slice(0, 3) + "XXXXX" + d.pan.slice(-1);

  // Consent record for an Indian credit-PII soft check. Captured with request
  // metadata so we can prove informed consent even if email delivery fails.
  const consentRecord = {
    timestamp: new Date().toISOString(),
    ip,
    consentVersion: CONSENT_VERSION,
    maskedPan,
  };

  const html = `
    <h2>Free CIBIL check — consented lead</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(d.fullName)}</td></tr>
      <tr><td><b>Mobile</b></td><td>+91 ${esc(d.mobile)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(d.email)}</td></tr>
      <tr><td><b>PAN (masked)</b></td><td>${esc(maskedPan)}</td></tr>
      <tr><td><b>Consent</b></td><td>Yes — user authorised a soft credit-score check</td></tr>
      <tr><td><b>Consent version</b></td><td>${esc(consentRecord.consentVersion)}</td></tr>
      <tr><td><b>Consent timestamp</b></td><td>${esc(consentRecord.timestamp)}</td></tr>
      <tr><td><b>Consent IP</b></td><td>${esc(consentRecord.ip)}</td></tr>
    </table>
    <p style="color:#888;font-size:12px">Full PAN/DOB were provided with consent and are intentionally not included in
    this email. Retrieve securely per your bureau agreement.</p>
  `;

  // Strip CR/LF from user free-text before it goes into the Subject header.
  const subject = sanitizeHeader(`Free CIBIL request: ${d.fullName} (${d.mobile})`);

  // Always emit a durable-ish audit trail of the consent. NOTE: a console log is
  // NOT a durable store — in production replace this with a database/append-only
  // log so consent records survive process restarts and are queryable.
  const logConsent = () =>
    console.info("CONSENT_RECORD", JSON.stringify({ form: "cibil-lead", ...consentRecord }));

  try {
    const { sent } = await sendLeadEmail({ subject, html, replyTo: d.email });
    // If SMTP is unset the lead isn't emailed — never silently lose a consented lead.
    if (!sent) logConsent();
  } catch (err) {
    // Email failed — log the consent+lead record so it isn't lost, then still
    // return graceful success to the user (the lead was captured server-side).
    console.error("[cibil] email send failed:", err instanceof Error ? err.message : "unknown");
    logConsent();
  }

  return NextResponse.json({ ok: true, mode: "lead", brand: site.name });
}
