import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail, rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { verifyWebhookAuth } from "@/lib/voice-agent";
import { addDoNotCall, saveVoiceResult } from "@/lib/lead-store";
import { sendAlert } from "@/lib/alerts";

export const runtime = "nodejs";

/**
 * Call-result webhook from the Dograh voice agent's Webhook node.
 *
 * Authenticated by a Bearer token (a Dograh "Bearer Token" credential equal to
 * DOGRAH_WEBHOOK_SECRET) — without the secret set, every request is rejected,
 * so an unconfigured deployment cannot be fed forged call results.
 *
 * Dograh renders its payload template as strings ("" when a variable is
 * missing), so every field is read as text. The expected template is in
 * voice/callback-agent.md; extra fields are shown in the email as-is.
 */

// Primitives only; Dograh may add fields (e.g. a top-level call_disposition).
const payloadSchema = z.record(z.string().max(80), z.union([z.string(), z.number(), z.boolean(), z.null()]));

/** Fields rendered in a fixed order with readable labels; everything else follows. */
const KNOWN_FIELDS: [key: string, label: string][] = [
  ["full_name", "Name"],
  ["phone_number", "Mobile"],
  ["loan_category", "Loan"],
  ["amount", "Amount on form (₹)"],
  ["city", "City"],
  ["disposition", "Outcome"],
  ["call_status", "How the call ended"],
  ["duration_seconds", "Duration (s)"],
  ["interested", "Still interested"],
  ["confirmed_amount", "Amount confirmed on call"],
  ["monthly_income", "Monthly income"],
  ["existing_emis", "Existing EMIs"],
  ["employment_details", "Employment"],
  ["preferred_callback_time", "Preferred time for advisor"],
  ["wants_human", "Asked for a person"],
  ["language", "Language used"],
  ["summary", "Summary"],
  ["call_id", "Dograh run ID"],
];
const HIDDEN = new Set(["recording_url", "transcript_url", "call_disposition"]);

// Dograh retries deliveries, so the same result can arrive twice. Best-effort,
// per-instance de-duplication keeps the inbox to one email per call.
const seen: string[] = [];
function alreadySeen(callId: string): boolean {
  if (seen.includes(callId)) return true;
  seen.push(callId);
  if (seen.length > 500) seen.shift();
  return false;
}

const text = (v: unknown) => (v == null ? "" : String(v).trim().slice(0, 4000));
const isHttpsUrl = (v: string) => /^https:\/\/[^\s"'<>]+$/.test(v);

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // Coarse backstop; the Bearer secret below is the real gate.
  if (!rateLimit(`voice-webhook:${ip}`, 60)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!verifyWebhookAuth(req.headers.get("authorization"))) {
    console.warn("[voice-webhook] rejected: bad or missing credentials");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Unexpected payload." }, { status: 422 });
  }
  const p = Object.fromEntries(Object.entries(parsed.data).map(([k, v]) => [k, text(v)]));

  const callId = p.call_id || "";
  if (callId && alreadySeen(callId)) return NextResponse.json({ ok: true, duplicate: true });

  const disposition = p.disposition || p.call_disposition || p.call_status || "unknown";
  const doNotCall = /do[_\s-]?not[_\s-]?call/i.test(disposition);
  const name = p.full_name || "Unknown";

  const rows = [
    ...KNOWN_FIELDS.filter(([k]) => p[k]).map(([k, label]) => [label, p[k]] as const),
    ...Object.entries(p)
      .filter(([k, v]) => v && !HIDDEN.has(k) && !KNOWN_FIELDS.some(([f]) => f === k))
      .slice(0, 30),
  ]
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  const links = (["recording_url", "transcript_url"] as const)
    .filter((k) => isHttpsUrl(p[k] || ""))
    .map((k) => `<p><b>${k === "recording_url" ? "Recording" : "Transcript"}:</b> <a href="${esc(p[k])}">${esc(p[k])}</a></p>`)
    .join("");

  const html = `
    ${
      doNotCall
        ? `<p style="background:#fde8e8;color:#9b1c1c;padding:10px;font-weight:bold">DO NOT CALL — this person asked not to be contacted again. Do not call or message them.</p>`
        : ""
    }
    <h2>Voice callback result — ${esc(disposition)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">${rows}</table>
    ${links}
    <p style="color:#888;font-size:12px">Automated call placed by the LoanServ AI voice agent to a consented lead. Outcome and extracted details are AI-generated — check the recording before relying on them.</p>
  `;

  const subject = sanitizeHeader(`${doNotCall ? "DO NOT CALL — " : ""}Voice callback (${disposition}): ${name}`);

  // Opt-outs and wrong numbers go on the do-not-call list, which requestCallback
  // checks before every future call. Store + alert run alongside the email.
  const optOut = doNotCall || /wrong[_\s-]?number/i.test(disposition);
  const alert =
    doNotCall || /^(qualified|callback_requested)$/i.test(disposition)
      ? [
          `${doNotCall ? "⛔ DO NOT CALL" : "📞 Voice call"}: ${name} (${disposition})`,
          p.phone_number,
          p.preferred_callback_time && `Wants a call: ${p.preferred_callback_time}`,
          p.summary,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  await Promise.all([
    optOut && p.phone_number ? addDoNotCall(p.phone_number, disposition, "voice-agent") : false,
    callId ? saveVoiceResult({ callId, mobile: p.phone_number || "", disposition, payload: p }) : false,
    alert ? sendAlert(alert) : false,
  ]);

  try {
    const { sent } = await sendLeadEmail({ subject, html });
    // Never log the transcript or the number — only a non-PII trace.
    if (!sent) console.info("VOICE_CALL_RESULT", JSON.stringify({ callId, disposition }));
  } catch (err) {
    console.error("[voice-webhook] email send failed:", err instanceof Error ? err.message : "unknown");
    console.info("VOICE_CALL_RESULT", JSON.stringify({ callId, disposition }));
  }

  // Always 200 once authenticated so Dograh does not retry a delivered result.
  return NextResponse.json({ ok: true });
}
