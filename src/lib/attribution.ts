import { z } from "zod";

/**
 * Lead-source attribution: where a visitor came from (campaign tags, partner
 * referral code, referring site) and where they submitted a form. Captured in
 * the browser on landing, sent with every lead form, and printed in the lead
 * email so each lead says which channel produced it — no third-party cookies
 * needed. See LEADS.md.
 *
 * Shared by client and server: keep this file free of browser-only or
 * server-only imports. Browser helpers guard on `typeof window`.
 */

const text = z.string().trim().max(200).optional().catch(undefined);

/**
 * Every field is optional and any bad value is dropped rather than rejected —
 * attribution is a nicety and must never cause a lead to fail validation.
 */
export const attributionSchema = z
  .object({
    source: text,
    medium: text,
    campaign: text,
    term: text,
    content: text,
    /** Partner / referrer code from `?ref=` (e.g. a builder or CA firm). */
    ref: text,
    /** When the partner code was first seen — partner credit runs from here (ISO). */
    refAt: text,
    /** Arrived via a Google Ads click (gclid present). The id itself is never stored. */
    googleAds: z.boolean().optional().catch(undefined),
    /** Arrived via a Meta ad click (fbclid present). The id itself is never stored. */
    metaAds: z.boolean().optional().catch(undefined),
    /** Referring site host, e.g. "www.google.com"; "(direct)" when none. */
    referrer: text,
    /** First page of the attributed visit. */
    landingPage: text,
    /** Page the form was submitted from. */
    page: text,
    /** When this touch was recorded (ISO). */
    at: text,
  })
  .optional()
  .catch(undefined);

export type Attribution = NonNullable<z.infer<typeof attributionSchema>>;

const SEARCH_ENGINES = /(^|\.)(google|bing|yahoo|duckduckgo|yandex|ecosia)\./i;
const SOCIAL = /(^|\.)(facebook|instagram|linkedin|t\.co|twitter|x\.com|youtube|whatsapp|wa\.me)/i;

/** One human-readable channel label, e.g. "Google Ads", "Partner: sri-sai-builders". */
export function channelLabel(a: Attribution | undefined): string {
  if (!a) return "Unknown";
  if (a.ref) return `Partner: ${a.ref}`;
  const src = (a.source || "").toLowerCase();
  const med = (a.medium || "").toLowerCase();
  if (a.googleAds || (src === "google" && /cpc|ppc|paid/.test(med))) return "Google Ads";
  if (a.metaAds || (/facebook|instagram|meta|fb|ig/.test(src) && /cpc|paid|ads?/.test(med))) return "Meta Ads";
  if (src) return med ? `${a.source} / ${a.medium}` : a.source!;
  const host = a.referrer || "";
  if (!host || host === "(direct)") return "Direct";
  if (SEARCH_ENGINES.test(host)) return `Organic search (${host.replace(/^www\./, "")})`;
  if (SOCIAL.test(host)) return `Social (${host.replace(/^www\./, "")})`;
  return `Referral (${host.replace(/^www\./, "")})`;
}

// ---------------------------------------------------------------------------
// Browser side
// ---------------------------------------------------------------------------

const STORAGE_KEY = "loanserv-attribution";
/** A touch older than this no longer claims the lead. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    const fresh = (iso?: string) => Boolean(iso) && Date.now() - Date.parse(iso!) <= MAX_AGE_MS;
    if (a.ref && !fresh(a.refAt)) {
      a.ref = undefined;
      a.refAt = undefined;
    }
    if (!fresh(a.at)) return a.ref ? { ref: a.ref, refAt: a.refAt, at: a.refAt } : null;
    return a;
  } catch {
    return null;
  }
}

function write(a: Attribution): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* storage blocked — the lead just arrives without a source */
  }
}

const clip = (v: string | null) => (v ? v.trim().slice(0, 200) : undefined);

/**
 * Records where this visit came from. Call once per full page load. A visit
 * with campaign tags or an outside referrer replaces the stored touch; direct
 * and internal visits keep it (so "came from an ad, came back directly two days
 * later, applied" still credits the ad). A partner `ref` carries over to later
 * touches for 30 days from when it was first seen, so partners keep credit for
 * the people they send even if those people come back another way.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  const prev = read();

  let referrer: string | undefined;
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.host !== window.location.host) referrer = r.host;
  } catch {
    /* malformed referrer */
  }

  const tagged = ["utm_source", "utm_medium", "utm_campaign", "ref", "gclid", "fbclid"].some((k) => q.has(k));
  if (!tagged && !referrer && prev) return;

  const newRef = clip(q.get("ref"));
  const keepRef = !newRef && prev?.ref;
  const now = new Date().toISOString();
  write({
    source: clip(q.get("utm_source")),
    medium: clip(q.get("utm_medium")),
    campaign: clip(q.get("utm_campaign")),
    term: clip(q.get("utm_term")),
    content: clip(q.get("utm_content")),
    ref: newRef || (keepRef ? prev!.ref : undefined),
    refAt: newRef ? now : keepRef ? prev!.refAt : undefined,
    googleAds: q.has("gclid") || undefined,
    metaAds: q.has("fbclid") || undefined,
    referrer: referrer || (tagged ? undefined : "(direct)"),
    landingPage: window.location.pathname.slice(0, 200),
    at: now,
  });
}

/** The stored touch plus the page the visitor is on now — attach to lead submissions. */
export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  const a = read() || {};
  return { ...a, page: window.location.pathname.slice(0, 200) };
}
