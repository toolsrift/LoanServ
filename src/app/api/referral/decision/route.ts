import { NextResponse } from "next/server";
import { CONTACT_CONSENT_VERSION } from "@/lib/apply-schema";
import { referralDecisionSchema } from "@/lib/partner-schema";
import { settleReferral } from "@/lib/partners";
import { addDoNotCall } from "@/lib/lead-store";
import { rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { allowRequest } from "@/lib/rate-limit";
import { deliverLead, leadAlertText } from "@/lib/lead-delivery";
import { channelLabel } from "@/lib/attribution";
import { leadSourceHtml, leadSourceTag } from "@/lib/lead-source";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * The customer's answer to a partner referral. "confirm" (with the same
 * consent checkbox as /apply) turns it into a lead; "decline" closes it and
 * puts the number on the do-not-call list. Each link works once.
 */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!(await allowRequest(rateLimit, `referral-decision:${ip}`))) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = referralDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please tick the consent box to continue." }, { status: 422 });
  }
  const d = parsed.data;

  if (d.action === "decline") {
    const r = await settleReferral(d.token, "declined");
    if (!r) return NextResponse.json({ error: "This link has expired or was already used." }, { status: 410 });
    await addDoNotCall(r.mobile, "declined partner referral", "partner-portal");
    return NextResponse.json({ ok: true });
  }

  const timestamp = new Date().toISOString();
  const r = await settleReferral(d.token, "confirmed", {
    email: d.email,
    consent_version: CONTACT_CONSENT_VERSION,
    consent_ip: ip,
  });
  if (!r) return NextResponse.json({ error: "This link has expired or was already used." }, { status: 410 });

  const attribution = { ref: r.partner_code, source: "partner", medium: "portal", page: "/confirm" };
  const channel = channelLabel(attribution);
  const amount = Number(r.amount);

  const html = `
    <h2>New partner referral (customer confirmed) — ${esc(site.name)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(r.full_name)}</td></tr>
      <tr><td><b>Mobile</b></td><td>+91 ${esc(r.mobile)}</td></tr>
      ${d.email ? `<tr><td><b>Email</b></td><td>${esc(d.email)}</td></tr>` : ""}
      <tr><td><b>Category</b></td><td>${esc(r.category)}</td></tr>
      <tr><td><b>Loan type</b></td><td>${esc(r.loan_type)}</td></tr>
      <tr><td><b>Amount</b></td><td>₹${esc(amount)}</td></tr>
      <tr><td><b>City</b></td><td>${esc(r.city)}</td></tr>
      <tr><td><b>Employment</b></td><td>${esc(r.employment)}</td></tr>
      ${r.monthly_salary ? `<tr><td><b>Monthly salary</b></td><td>₹${esc(r.monthly_salary)}</td></tr>` : ""}
      ${r.notes ? `<tr><td><b>Partner notes</b></td><td>${esc(r.notes)}</td></tr>` : ""}
      <tr><td><b>Referred by</b></td><td>${esc(r.partner_name || r.partner_code)} (${esc(r.partner_code)})</td></tr>
      <tr><td><b>Consent</b></td><td>Yes — the customer confirmed on the referral link, incl. an automated voice callback</td></tr>
      <tr><td><b>Consent version</b></td><td>${esc(CONTACT_CONSENT_VERSION)}</td></tr>
      <tr><td><b>Consent timestamp</b></td><td>${esc(timestamp)}</td></tr>
      <tr><td><b>Consent IP</b></td><td>${esc(ip)}</td></tr>
    </table>
    ${leadSourceHtml(attribution)}
  `;
  const subject = sanitizeHeader(`New partner lead: ${r.category} — ${r.full_name} (${r.city})${leadSourceTag(attribution)}`);

  await deliverLead({
    record: {
      form: "partner",
      fullName: r.full_name,
      mobile: r.mobile,
      email: d.email,
      category: r.category,
      loanType: r.loan_type,
      amount,
      city: r.city,
      employment: r.employment,
      channel,
      attribution,
      details: { referralId: r.id, partner: r.partner_code, monthlySalary: r.monthly_salary, notes: r.notes },
      consent: { version: CONTACT_CONSENT_VERSION, timestamp, ip },
    },
    email: { subject, html, replyTo: d.email || undefined },
    alertText: leadAlertText({ form: "partner", fullName: r.full_name, mobile: r.mobile, category: r.category, amount, city: r.city, channel }),
    voice: {
      fullName: r.full_name,
      mobile: r.mobile,
      email: d.email,
      category: r.category,
      loanType: r.loan_type,
      amount,
      city: r.city,
      employment: r.employment,
      monthlySalary: r.monthly_salary || "",
      consentVersion: CONTACT_CONSENT_VERSION,
      consentTimestamp: timestamp,
    },
  });

  return NextResponse.json({ ok: true });
}
