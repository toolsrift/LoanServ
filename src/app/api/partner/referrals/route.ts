import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/email";
import { allowRequest } from "@/lib/rate-limit";
import { isDoNotCall } from "@/lib/lead-store";
import { createReferral, isPartnerPortalEnabled, verifyPartner, REFERRAL_TTL_DAYS } from "@/lib/partners";
import { partnerReferralSchema } from "@/lib/partner-schema";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * A signed-in partner refers a customer. Creates a PENDING referral and returns
 * the confirmation link for the partner to send from their own phone —
 * LoanServ contacts nobody until the customer confirms.
 */
export async function POST(req: Request) {
  if (!isPartnerPortalEnabled()) {
    return NextResponse.json({ error: "The partner portal isn't set up yet." }, { status: 503 });
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!(await allowRequest(rateLimit, `partner-referral:${ip}`, 20))) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const partner = await verifyPartner(
    (req.headers.get("x-partner-code") || "").trim().toLowerCase(),
    (req.headers.get("x-partner-key") || "").trim(),
  );
  if (!partner) return NextResponse.json({ error: "Partner code or key is incorrect." }, { status: 401 });

  const body: unknown = await req.json().catch(() => null);
  const parsed = partnerReferralSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  }
  const d = parsed.data;

  // Someone who asked not to be contacted can't be re-entered through a partner.
  if ((await isDoNotCall(d.mobile)) === true) {
    return NextResponse.json(
      { error: "This customer has asked LoanServ not to contact them, so we can't accept this referral." },
      { status: 409 },
    );
  }

  const created = await createReferral(partner, d);
  if (!created) return NextResponse.json({ error: "Couldn't save the referral. Please try again." }, { status: 502 });

  const confirmUrl = `${site.url}/confirm/${created.token}`;
  const firstName = d.fullName.trim().split(/\s+/)[0];
  const message =
    `Hi ${firstName}, I've referred you to LoanServ for your ${d.category.toLowerCase()} loan enquiry. ` +
    `Please open this link and confirm if you'd like their advisor to contact you (valid ${REFERRAL_TTL_DAYS} days): ` +
    `${confirmUrl} — ${partner.name}`;

  return NextResponse.json({
    ok: true,
    confirmUrl,
    whatsappUrl: `https://wa.me/91${d.mobile}?text=${encodeURIComponent(message)}`,
    message,
  });
}
