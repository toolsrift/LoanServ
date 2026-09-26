import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Dograh voice-agent bridge — "speed to lead" callbacks.
 *
 * The voice agent itself is a separate Dograh service (self-hosted Docker or
 * Dograh cloud); this module is only the seam between a consented lead and
 * that service. Like every other integration in this codebase it degrades
 * gracefully: when the env vars are absent the site behaves exactly as before
 * and the lead is still captured.
 *
 * Matches Dograh's documented API Trigger + Webhook node contracts. See
 * VOICE-AGENT.md for deployment + the India compliance checklist, and
 * voice/callback-agent.md for the workflow (prompts, extraction, webhook).
 */

/** How long we wait for Dograh to accept the call request before giving up. */
const REQUEST_TIMEOUT_MS = 4_000;

/**
 * RBI fair-practice calling window for loan-related calls: 08:00–19:00 IST.
 * Calls outside it are not dialled — the lead is still captured and emailed.
 */
const CALL_WINDOW_START_HOUR = 8;
const CALL_WINDOW_END_HOUR = 19;

export type VoiceCallbackLead = {
  fullName: string;
  /** 10-digit Indian mobile, as validated by applySchema. */
  mobile: string;
  email: string;
  category: string;
  loanType: string;
  amount: number;
  city: string;
  employment: string;
  monthlySalary?: string;
  employer?: string;
  purpose?: string;
  /** Consent audit trail, forwarded so the call record carries its own proof. */
  consentVersion: string;
  consentTimestamp: string;
};

export type VoiceCallbackResult = {
  queued: boolean;
  /** Non-PII reason, safe to log, when the call was not queued. */
  reason?: string;
  /** Dograh workflow_run_id of the queued call. */
  callId?: string;
};

function env(name: string): string {
  return (process.env[name] || "").trim();
}

/** Optional positive integer env var (Dograh config ids); undefined if unset or invalid. */
function envInt(name: string): number | undefined {
  const n = Number(env(name));
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/** True only when every piece needed to place a call is configured. */
export function isVoiceAgentEnabled(): boolean {
  return (
    env("VOICE_AGENT_ENABLED") === "true" &&
    Boolean(env("DOGRAH_API_URL")) &&
    Boolean(env("DOGRAH_API_KEY")) &&
    Boolean(env("DOGRAH_TRIGGER_UUID"))
  );
}

/** Current hour (0–23) in IST, via ICU rather than manual offset arithmetic. */
function istHour(now: Date): number {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hour12: false,
  }).format(now);
  return Number(hour);
}

export function isWithinCallingWindow(now: Date = new Date()): boolean {
  const hour = istHour(now);
  return hour >= CALL_WINDOW_START_HOUR && hour < CALL_WINDOW_END_HOUR;
}

/**
 * Loan amount the way a person says it — "5 lakh rupees", "1.5 crore rupees" —
 * so the voice doesn't read out "five hundred thousand".
 */
export function amountInWords(amount: number): string {
  const fmt = (n: number) => String(Math.round(n * 100) / 100);
  if (amount >= 1_00_00_000) return `${fmt(amount / 1_00_00_000)} crore rupees`;
  if (amount >= 1_00_000) return `${fmt(amount / 1_00_000)} lakh rupees`;
  if (amount >= 1_000) return `${fmt(amount / 1_000)} thousand rupees`;
  return `${amount} rupees`;
}

/**
 * Body for Dograh's API Trigger (`POST /api/v1/public/agent/{uuid}`). The
 * `initial_context` keys are what the workflow prompt references as
 * `{{full_name}}` etc. — keep them in sync with voice/callback-agent.md.
 */
export function buildCallPayload(lead: VoiceCallbackLead) {
  const telephonyConfigId = envInt("DOGRAH_TELEPHONY_CONFIG_ID");
  const fromNumberId = envInt("DOGRAH_FROM_PHONE_NUMBER_ID");
  return {
    phone_number: `+91${lead.mobile}`,
    // Optional: route through a specific telephony config / DLT-registered caller ID.
    ...(telephonyConfigId ? { telephony_configuration_id: telephonyConfigId } : {}),
    ...(fromNumberId ? { from_phone_number_id: fromNumberId } : {}),
    initial_context: {
      full_name: lead.fullName,
      first_name: lead.fullName.trim().split(/\s+/)[0] || lead.fullName,
      loan_category: lead.category,
      loan_type: lead.loanType,
      amount: String(lead.amount),
      amount_words: amountInWords(lead.amount),
      city: lead.city,
      employment: lead.employment,
      monthly_salary: lead.monthlySalary || "",
      employer: lead.employer || "",
      purpose: lead.purpose || "",
      consent_version: lead.consentVersion,
      consent_timestamp: lead.consentTimestamp,
    },
  };
}

/**
 * Asks Dograh to call a consented lead back. NEVER throws and never blocks lead
 * capture — the caller treats a failure here as a no-op and the lead still goes
 * out by email.
 */
export async function requestCallback(lead: VoiceCallbackLead): Promise<VoiceCallbackResult> {
  if (!isVoiceAgentEnabled()) return { queued: false, reason: "not-configured" };
  if (!isWithinCallingWindow()) return { queued: false, reason: "outside-calling-window" };

  const base = env("DOGRAH_API_URL").replace(/\/$/, "");
  const url = `${base}/api/v1/public/agent/${encodeURIComponent(env("DOGRAH_TRIGGER_UUID"))}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env("DOGRAH_API_KEY"),
      },
      body: JSON.stringify(buildCallPayload(lead)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) return { queued: false, reason: `http-${res.status}` };

    const data = (await res.json().catch(() => ({}))) as { workflow_run_id?: number | string };
    return { queued: true, callId: data.workflow_run_id != null ? String(data.workflow_run_id) : undefined };
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network-error";
    return { queued: false, reason };
  }
}

/**
 * Authenticates Dograh's call-result webhook. Dograh doesn't sign webhook
 * bodies; its Webhook node sends a stored credential instead, configured as
 * a Bearer token equal to DOGRAH_WEBHOOK_SECRET. Returns false when no secret
 * is configured, so an unsecured endpoint can never accept forged results.
 */
export function verifyWebhookAuth(authorizationHeader: string | null): boolean {
  const secret = env("DOGRAH_WEBHOOK_SECRET");
  if (!secret || !authorizationHeader) return false;
  const provided = authorizationHeader.replace(/^Bearer\s+/i, "").trim();
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(provided, "utf8").digest();
  const b = createHash("sha256").update(secret, "utf8").digest();
  return timingSafeEqual(a, b);
}
