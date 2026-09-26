import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { isLeadStoreConfigured, normalizeMobile, supabaseRest } from "./lead-store";

/**
 * Partner (connector) referrals with customer-confirmed consent.
 *
 * A partner signs in with the code + key LoanServ issued them
 * (scripts/create-partner.mjs) and submits a customer's details. Nothing is
 * sent to the customer and nobody calls them: the referral waits as
 * "pending" until the customer opens the confirmation link — which the
 * partner shares from their own phone — and ticks the same consent box as the
 * apply form. Only then does it become a lead. Links expire after 7 days.
 *
 * Needs the lead store (Supabase); schema in supabase/schema.sql.
 */

export const REFERRAL_TTL_DAYS = 7;

export type Partner = { code: string; name: string };

export type Referral = {
  id: number;
  partner_code: string;
  partner_name: string | null;
  full_name: string;
  mobile: string;
  category: string;
  loan_type: string;
  amount: number;
  city: string;
  employment: string;
  monthly_salary: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "declined" | "expired";
  created_at: string;
  confirmed_at: string | null;
};

export function isPartnerPortalEnabled(): boolean {
  return isLeadStoreConfigured();
}

export const sha256 = (v: string) => createHash("sha256").update(v, "utf8").digest("hex");

/** Constant-time comparison of two hex digests. */
function sameHash(a: string, b: string): boolean {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** Partner codes are the same slugs lib/attribution stores for `?ref=`. */
export const PARTNER_CODE = /^[a-z0-9][a-z0-9-]{1,59}$/;

/** Checks a partner's code + key. Returns the partner when valid and active. */
export async function verifyPartner(code: string, key: string): Promise<Partner | null> {
  if (!PARTNER_CODE.test(code) || key.length < 16 || key.length > 200) return null;
  const res = await supabaseRest(`partners?code=eq.${code}&active=is.true&select=code,name,key_hash&limit=1`);
  if (!res?.ok) return null;
  const rows = (await res.json().catch(() => null)) as { code: string; name: string; key_hash: string }[] | null;
  const p = rows?.[0];
  return p && sameHash(sha256(key), p.key_hash) ? { code: p.code, name: p.name } : null;
}

export type NewReferral = {
  fullName: string;
  mobile: string;
  category: string;
  loanType: string;
  amount: number;
  city: string;
  employment: string;
  monthlySalary?: string;
  notes?: string;
};

/** Stores a pending referral and returns the one-time confirmation token (only its hash is stored). */
export async function createReferral(partner: Partner, r: NewReferral): Promise<{ token: string } | null> {
  const token = randomBytes(24).toString("base64url");
  const res = await supabaseRest("referrals", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify({
      token_hash: sha256(token),
      partner_code: partner.code,
      partner_name: partner.name,
      full_name: r.fullName,
      mobile: normalizeMobile(r.mobile),
      category: r.category,
      loan_type: r.loanType,
      amount: r.amount,
      city: r.city,
      employment: r.employment,
      monthly_salary: r.monthlySalary || null,
      notes: r.notes || null,
    }),
  });
  return res?.ok ? { token } : null;
}

const TOKEN = /^[A-Za-z0-9_-]{20,64}$/;

function isExpired(r: Pick<Referral, "created_at">, now = Date.now()): boolean {
  return now - Date.parse(r.created_at) > REFERRAL_TTL_DAYS * 86_400_000;
}

/** Looks up a referral by its confirmation token; expired pending ones read as "expired". */
export async function getReferralByToken(token: string): Promise<Referral | null> {
  if (!TOKEN.test(token)) return null;
  const res = await supabaseRest(`referrals?token_hash=eq.${sha256(token)}&select=*&limit=1`);
  if (!res?.ok) return null;
  const rows = (await res.json().catch(() => null)) as Referral[] | null;
  const r = rows?.[0];
  if (!r) return null;
  return r.status === "pending" && isExpired(r) ? { ...r, status: "expired" } : r;
}

/**
 * Moves a pending referral to confirmed/declined. The status filter makes this
 * a compare-and-set: a link can be used once, even if clicked twice.
 */
export async function settleReferral(
  token: string,
  status: "confirmed" | "declined",
  extra: { email?: string; consent_version?: string; consent_ip?: string } = {},
): Promise<Referral | null> {
  if (!TOKEN.test(token)) return null;
  // Expiry is part of the filter so an expired link can never be confirmed.
  const cutoff = new Date(Date.now() - REFERRAL_TTL_DAYS * 86_400_000).toISOString();
  const res = await supabaseRest(`referrals?token_hash=eq.${sha256(token)}&status=eq.pending&created_at=gte.${cutoff}`, {
    method: "PATCH",
    prefer: "return=representation",
    body: JSON.stringify({
      status,
      confirmed_at: new Date().toISOString(),
      email: extra.email || null,
      consent_version: extra.consent_version || null,
      consent_ip: extra.consent_ip || null,
    }),
  });
  if (!res?.ok) return null;
  const rows = (await res.json().catch(() => null)) as Referral[] | null;
  return rows?.[0] ?? null;
}

/** A partner's own referrals, newest first, with the customer's mobile masked. */
export async function listReferrals(partner: Partner, limit = 50) {
  const res = await supabaseRest(
    `referrals?partner_code=eq.${partner.code}&select=full_name,mobile,category,amount,city,status,created_at&order=created_at.desc&limit=${limit}`,
  );
  if (!res?.ok) return null;
  const rows = (await res.json().catch(() => null)) as Referral[] | null;
  return (rows || []).map((r) => ({
    name: r.full_name,
    mobile: maskMobile(r.mobile),
    category: r.category,
    amount: r.amount,
    city: r.city,
    status: r.status === "pending" && isExpired(r) ? "expired" : r.status,
    createdAt: r.created_at,
  }));
}

/** 9876543210 → 98XXXXX210 */
export function maskMobile(m: string): string {
  const d = normalizeMobile(m);
  return d.length === 10 ? `${d.slice(0, 2)}XXXXX${d.slice(-3)}` : "XXXXXXXXXX";
}
