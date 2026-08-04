import "server-only";
import nodemailer from "nodemailer";
import { site } from "./site";

/**
 * Sends a lead email via SMTP. Reads all secrets from env. If SMTP is not
 * configured, it degrades gracefully: the submission still succeeds (free
 * lead-capture path) and we log a non-PII warning instead of throwing.
 */
export async function sendLeadEmail({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: boolean }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const to = process.env.LEAD_TO_EMAIL || site.email;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // No SMTP configured yet — don't break the site. Never log the lead's PII.
    console.warn("[lead] SMTP not configured; lead accepted but not emailed. Configure SMTP_* env vars.");
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"${site.name} Website" <${SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });
  return { sent: true };
}

/**
 * Very small in-memory rate limiter (per-instance) to blunt spam bursts.
 *
 * BEST-EFFORT ONLY. This is not distributed: on serverless each instance keeps
 * its own Map, so a determined attacker can bypass it by fanning out across
 * cold starts, and the key is ultimately derived from the client-controllable
 * x-forwarded-for header (see the route handlers). Production should back this
 * with a shared store (Upstash/Vercel KV) keyed on a platform-trusted client IP.
 * Here we at least (a) evict expired entries so the Map can't grow unbounded and
 * (b) enforce a global request cap as a coarse spam backstop.
 */
const hits = new Map<string, { count: number; ts: number }>();

// Global backstop: total accepted requests across ALL keys within a window.
const GLOBAL_LIMIT = 300;
let globalCount = 0;
let globalTs = Date.now();
let lastSweep = Date.now();

/** Drop entries whose window has elapsed so the Map stays bounded. */
function evictExpired(now: number, windowMs: number): void {
  // Sweep at most once per window to keep the common path cheap.
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [k, v] of hits) {
    if (now - v.ts > windowMs) hits.delete(k);
  }
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  evictExpired(now, windowMs);

  // Global cap across all keys — coarse protection against key-cycling spam.
  if (now - globalTs > windowMs) {
    globalCount = 0;
    globalTs = now;
  }
  if (globalCount >= GLOBAL_LIMIT) return false;

  const entry = hits.get(key);
  if (!entry || now - entry.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    globalCount += 1;
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  globalCount += 1;
  return true;
}

/** Minimal HTML escaping for values interpolated into the email body. */
export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitise any user-supplied string before it is placed into an email header
 * (e.g. Subject): strip CR/LF to defeat header injection and collapse runs of
 * whitespace. Nodemailer already encodes headers, but this is defence-in-depth.
 */
export function sanitizeHeader(v: unknown): string {
  return String(v ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
