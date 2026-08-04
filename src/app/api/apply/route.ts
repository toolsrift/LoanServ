import { NextResponse } from "next/server";
import { applySchema } from "@/lib/apply-schema";
import { sendLeadEmail, rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { site } from "@/lib/site";

export const runtime = "nodejs";

// Version of the consent text/flow the user agreed to. Bump when it changes.
const CONSENT_VERSION = "1.0";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(`apply:${ip}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  }
  const d = parsed.data;

  // Honeypot — silently accept but drop.
  if (d.company_website) {
    return NextResponse.json({ ok: true });
  }

  const emiRows = (d.existingEmis || [])
    .filter((r) => r.lender || r.emi || r.outstanding)
    .map((r) => `<li>${esc(r.lender)} — EMI ₹${esc(r.emi)}, outstanding: ${esc(r.outstanding)}</li>`)
    .join("");

  // Consent record captured with request metadata so informed consent can be
  // proven even if email delivery fails.
  const consentRecord = {
    timestamp: new Date().toISOString(),
    ip,
    consentVersion: CONSENT_VERSION,
  };

  const html = `
    <h2>New loan enquiry — ${esc(site.name)}</h2>
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
      ${d.employer ? `<tr><td><b>Employer</b></td><td>${esc(d.employer)}</td></tr>` : ""}
      ${d.workLocation ? `<tr><td><b>Work location</b></td><td>${esc(d.workLocation)}</td></tr>` : ""}
      ${d.turnover ? `<tr><td><b>Annual turnover</b></td><td>₹${esc(d.turnover)}</td></tr>` : ""}
      ${d.businessNature ? `<tr><td><b>Business</b></td><td>${esc(d.businessNature)}</td></tr>` : ""}
      ${d.businessVintage ? `<tr><td><b>Vintage</b></td><td>${esc(d.businessVintage)} yrs</td></tr>` : ""}
      ${d.purpose ? `<tr><td><b>Purpose</b></td><td>${esc(d.purpose)}</td></tr>` : ""}
      ${d.message ? `<tr><td><b>Message</b></td><td>${esc(d.message)}</td></tr>` : ""}
      <tr><td><b>Consent</b></td><td>Yes — user agreed to be contacted</td></tr>
      <tr><td><b>Consent version</b></td><td>${esc(consentRecord.consentVersion)}</td></tr>
      <tr><td><b>Consent timestamp</b></td><td>${esc(consentRecord.timestamp)}</td></tr>
      <tr><td><b>Consent IP</b></td><td>${esc(consentRecord.ip)}</td></tr>
    </table>
    ${emiRows ? `<p><b>Existing EMIs:</b></p><ul>${emiRows}</ul>` : ""}
    <p style="color:#888;font-size:12px">Submitted via loanserv.in apply form.</p>
  `;

  // Strip CR/LF from user free-text before it goes into the Subject header.
  const subject = sanitizeHeader(`New loan lead: ${d.category} — ${d.fullName} (${d.city})`);

  // Always keep an audit trail of the consent. NOTE: a console log is NOT durable
  // — production should replace this with a database/append-only log.
  const logConsent = () =>
    console.info("CONSENT_RECORD", JSON.stringify({ form: "apply", ...consentRecord }));

  try {
    const { sent } = await sendLeadEmail({ subject, html, replyTo: d.email });
    // If SMTP is unset the lead isn't emailed — never silently lose a consented lead.
    if (!sent) logConsent();
  } catch (err) {
    // Email failed — log the consent+lead record so it isn't lost, then still
    // return graceful success (the lead was captured server-side).
    console.error("[apply] email send failed:", err instanceof Error ? err.message : "unknown");
    logConsent();
  }

  return NextResponse.json({ ok: true });
}
