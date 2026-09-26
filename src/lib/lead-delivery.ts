import "server-only";
import { sendLeadEmail } from "./email";
import { saveLead, type LeadRecord } from "./lead-store";
import { sendAlert } from "./alerts";
import { requestCallback, type VoiceCallbackLead } from "./voice-agent";

/**
 * The common end of every lead form (apply, chat callback, CIBIL): store the
 * lead + consent, email it, alert the team, then — when consented and
 * configured — ask the voice agent to call. Each step is independent and
 * never throws, so no single failure can lose a lead.
 */
export async function deliverLead({
  record,
  email,
  alertText,
  voice,
}: {
  record: LeadRecord;
  email: { subject: string; html: string; replyTo?: string };
  alertText: string;
  /** Only for forms whose consent covers the automated voice callback. */
  voice?: VoiceCallbackLead;
}): Promise<void> {
  const tag = `[${record.form}]`;

  const [stored, emailed] = await Promise.all([
    saveLead(record),
    sendLeadEmail(email).then(
      (r) => r.sent,
      (err) => {
        console.error(`${tag} email send failed:`, err instanceof Error ? err.message : "unknown");
        return false;
      },
    ),
    sendAlert(alertText),
  ]);

  if (!stored.saved && stored.reason !== "not-configured") {
    console.warn(`${tag} lead store failed:`, stored.reason);
  }
  // No durable copy anywhere — keep the consent audit trail in the logs so a
  // consented lead is never silently lost. Non-PII apart from the IP.
  if (!stored.saved && !emailed) {
    console.info("CONSENT_RECORD", JSON.stringify({ form: record.form, ...record.consent }));
  }

  // Speed-to-lead: runs last and can never fail the submission.
  if (voice) {
    const call = await requestCallback(voice);
    // Non-PII trace only: the reason, never the lead.
    if (!call.queued && call.reason !== "not-configured") {
      console.info(`${tag} voice callback not queued:`, call.reason);
    }
  }
}

/** Short Telegram alert for a new lead. */
export function leadAlertText(l: {
  form: string;
  fullName: string;
  mobile: string;
  category?: string;
  amount?: number;
  city?: string;
  channel: string;
}): string {
  const loan = [l.category, l.amount ? `₹${l.amount.toLocaleString("en-IN")}` : "", l.city].filter(Boolean).join(" · ");
  return [
    `🔔 New ${l.form} lead`,
    `${l.fullName} — +91 ${l.mobile}`,
    loan,
    `Source: ${l.channel}`,
    "Call back within 10 minutes.",
  ]
    .filter(Boolean)
    .join("\n");
}
