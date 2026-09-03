import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Dograh voice-agent bridge — "speed to lead" callbacks.
 *
 * The voice agent itself is a separate self-hosted Dograh service (Docker); this
 * module is only the seam between a consented lead and that service. Like every
 * other integration in this codebase it degrades gracefully: when the env vars
 * are absent the site behaves exactly as before and the lead is still captured.
 *
 * See VOICE-AGENT.md for deployment + the India compliance checklist.
 */

/** How long we wait for Dograh to accept the call request before giving up. */
const REQUEST_TIMEOUT_MS = 4_000;

/**
 * RBI fair-practice calling window for loan-related calls: 08:00–19:00 IST.
 * Calls outside it are not dialled — the lead is still captured and emailed.
 */
const CALL_WINDOW_START_HOUR = 8;
const CALL_WINDOW_END_HOUR = 19;

/** Header Dograh signs the webhook body with. Must match the Dograh config. */
export const WEBHOOK_SIGNATURE_HEADER = "x-dograh-signature";

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
  callId?: string;
};

function env(name: string): string {
  return (process.env[name] || "").trim();
}

/** True only when every piece needed to place a call is configured. */
export function isVoiceAgentEnabled(): boolean {
  return (
    env("VOICE_AGENT_ENABLED") === "true" &&
    Boolean(env("DOGRAH_API_URL")) &&
    Boolean(env("DOGRAH_API_KEY")) &&
    Boolean(env("DOGRAH_WORKFLOW_ID"))
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
 * Payload sent to Dograh. The `variables` keys must match the variable names
 * used by the deployed Dograh workflow — keep this map and the workflow in sync
 * (VOICE-AGENT.md lists the expected names).
 */
function buildCallPayload(lead: VoiceCallbackLead) {
  return {
    workflow_id: env("DOGRAH_WORKFLOW_ID"),
    phone_number: `+91${lead.mobile}`,
    // Optional: pin the outbound caller ID to a DLT-registered number.
    ...(env("DOGRAH_FROM_NUMBER") ? { from_number: env("DOGRAH_FROM_NUMBER") } : {}),
    variables: {
      full_name: lead.fullName,
      loan_category: lead.category,
      loan_type: lead.loanType,
      amount: String(lead.amount),
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

  const url = `${env("DOGRAH_API_URL").replace(/\/$/, "")}/api/v1/calls`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env("DOGRAH_API_KEY")}`,
      },
      body: JSON.stringify(buildCallPayload(lead)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) return { queued: false, reason: `http-${res.status}` };

    // Tolerate a body-less 202 — acceptance is what matters, not the shape.
    const data = (await res.json().catch(() => ({}))) as { id?: string; call_id?: string };
    return { queued: true, callId: data.call_id || data.id };
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network-error";
    return { queued: false, reason };
  }
}

/**
 * Verifies the HMAC-SHA256 signature Dograh sends with each webhook, computed
 * over the raw request body. Returns false when no secret is configured so an
 * unsecured endpoint can never accept forged call results.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = env("DOGRAH_WEBHOOK_SECRET");
  if (!secret || !signatureHeader) return false;

  // Accept both "sha256=<hex>" and a bare hex digest.
  const provided = signatureHeader.startsWith("sha256=") ? signatureHeader.slice(7) : signatureHeader;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
