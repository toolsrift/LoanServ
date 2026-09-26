import "server-only";

/**
 * Durable lead + consent store and do-not-call list, on Supabase (Postgres)
 * via its REST API — plain fetch, no client library. Schema:
 * supabase/schema.sql. Off unless SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * are set; like every integration here it never throws — a store failure
 * never loses a lead, which still goes out by email.
 */

const TIMEOUT_MS = 3_000;

function env(name: string): string {
  return (process.env[name] || "").trim();
}

export function isLeadStoreConfigured(): boolean {
  return Boolean(env("SUPABASE_URL") && env("SUPABASE_SERVICE_ROLE_KEY"));
}

/** Last 10 digits — the form every table stores mobiles in. */
export function normalizeMobile(v: string): string {
  return v.replace(/\D/g, "").slice(-10);
}

async function rest(
  path: string,
  { prefer, ...init }: Omit<RequestInit, "headers" | "signal"> & { prefer?: string } = {},
): Promise<Response | null> {
  if (!isLeadStoreConfigured()) return null;
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  try {
    return await fetch(`${env("SUPABASE_URL").replace(/\/$/, "")}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        ...(prefer ? { prefer } : {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

export type LeadRecord = {
  form: "apply" | "chat" | "cibil";
  fullName: string;
  mobile: string;
  email: string;
  category?: string;
  loanType?: string;
  amount?: number;
  city?: string;
  employment?: string;
  /** Channel label from lib/attribution, e.g. "Google Ads". */
  channel: string;
  attribution?: unknown;
  /** Form-specific extras (salary, EMIs, redacted chat transcript, masked PAN…). Never full PAN/DOB. */
  details?: Record<string, unknown>;
  consent: { version: string; timestamp: string; ip: string };
};

/** Saves a lead with its consent record. Returns whether it was stored. */
export async function saveLead(lead: LeadRecord): Promise<{ saved: boolean; reason?: string }> {
  if (!isLeadStoreConfigured()) return { saved: false, reason: "not-configured" };
  const res = await rest("leads", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify({
      form: lead.form,
      full_name: lead.fullName,
      mobile: normalizeMobile(lead.mobile),
      email: lead.email,
      category: lead.category ?? null,
      loan_type: lead.loanType ?? null,
      amount: lead.amount ?? null,
      city: lead.city ?? null,
      employment: lead.employment ?? null,
      channel: lead.channel,
      attribution: lead.attribution ?? null,
      details: lead.details ?? null,
      consent_version: lead.consent.version,
      consent_at: lead.consent.timestamp,
      consent_ip: lead.consent.ip,
    }),
  });
  if (!res) return { saved: false, reason: "network-error" };
  return res.ok ? { saved: true } : { saved: false, reason: `http-${res.status}` };
}

/** true/false when known; null when the list can't be checked (unconfigured or error). */
export async function isDoNotCall(mobile: string): Promise<boolean | null> {
  const res = await rest(`do_not_call?mobile=eq.${normalizeMobile(mobile)}&select=mobile&limit=1`);
  if (!res || !res.ok) return null;
  const rows = (await res.json().catch(() => null)) as unknown[] | null;
  return Array.isArray(rows) ? rows.length > 0 : null;
}

/** Adds a number to the do-not-call list (idempotent). */
export async function addDoNotCall(mobile: string, reason: string, source: string): Promise<boolean> {
  const m = normalizeMobile(mobile);
  if (m.length !== 10) return false;
  const res = await rest("do_not_call", {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=minimal",
    body: JSON.stringify({ mobile: m, reason, source }),
  });
  return Boolean(res?.ok);
}

/** Keeps the voice agent's result alongside the leads. */
export async function saveVoiceResult(r: {
  callId: string;
  mobile: string;
  disposition: string;
  payload: Record<string, string>;
}): Promise<boolean> {
  const res = await rest("voice_calls", {
    method: "POST",
    prefer: "resolution=ignore-duplicates,return=minimal",
    body: JSON.stringify({
      call_id: r.callId,
      mobile: normalizeMobile(r.mobile) || null,
      disposition: r.disposition,
      payload: r.payload,
    }),
  });
  return Boolean(res?.ok);
}
