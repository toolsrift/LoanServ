import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/email";
import { allowRequest } from "@/lib/rate-limit";
import { isPartnerPortalEnabled, listReferrals, verifyPartner } from "@/lib/partners";

export const runtime = "nodejs";

/** Partner sign-in check + their referrals (customer mobiles masked). POST so the key never sits in a URL. */
export async function POST(req: Request) {
  if (!isPartnerPortalEnabled()) {
    return NextResponse.json({ error: "The partner portal isn't set up yet." }, { status: 503 });
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // Tight limit: this is also the endpoint a key-guesser would hit.
  if (!(await allowRequest(rateLimit, `partner-login:${ip}`, 10))) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  const partner = await verifyPartner(
    (req.headers.get("x-partner-code") || "").trim().toLowerCase(),
    (req.headers.get("x-partner-key") || "").trim(),
  );
  if (!partner) return NextResponse.json({ error: "Partner code or key is incorrect." }, { status: 401 });

  return NextResponse.json({ partner, referrals: (await listReferrals(partner)) || [] });
}
