import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail, rateLimit, esc, sanitizeHeader } from "@/lib/email";
import { verifyWebhookSignature, WEBHOOK_SIGNATURE_HEADER } from "@/lib/voice-agent";

export const runtime = "nodejs";

/**
 * Call-result webhook from the self-hosted Dograh voice agent.
 *
 * Authenticated by HMAC over the raw body — without DOGRAH_WEBHOOK_SECRET set,
 * every request is rejected, so an unconfigured deployment cannot be fed forged
 * call results. See VOICE-AGENT.md.
 */

// Loose object: Dograh may add fields; unknown keys are carried through harmlessly.
const callResultSchema = z.looseObject({
  call_id: z.string().max(120),
  status: z.string().max(40),
  phone_number: z.string().max(20).optional(),
  duration_seconds: z.coerce.number().min(0).max(86_400).optional(),
  /** Set by the workflow's qualification branch. */
  qualified: z.boolean().optional(),
  disposition: z.string().max(120).optional(),
  summary: z.string().max(4_000).optional(),
  transcript: z.string().max(60_000).optional(),
  recording_url: z.string().url().max(1_000).optional(),
  variables: z.record(z.string(), z.string().max(500)).optional(),
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // Coarse backstop; the HMAC below is the real gate.
  if (!rateLimit(`voice-webhook:${ip}`, 60)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  // Read the RAW body — the signature is computed over these exact bytes.
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get(WEBHOOK_SIGNATURE_HEADER))) {
    console.warn("[voice-webhook] rejected: bad or missing signature");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = callResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Unexpected payload." }, { status: 422 });
  }
  const c = parsed.data;

  const vars = c.variables || {};
  const name = vars.full_name || "Unknown";
  const outcome = c.qualified === true ? "QUALIFIED" : c.qualified === false ? "Not qualified" : c.status;

  const varRows = Object.entries(vars)
    .filter(([k]) => k !== "full_name")
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`)
    .join("");

  const html = `
    <h2>Voice callback result — ${esc(outcome)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
      <tr><td><b>Mobile</b></td><td>${esc(c.phone_number || "—")}</td></tr>
      <tr><td><b>Call status</b></td><td>${esc(c.status)}</td></tr>
      <tr><td><b>Disposition</b></td><td>${esc(c.disposition || "—")}</td></tr>
      <tr><td><b>Duration</b></td><td>${esc(c.duration_seconds ?? "—")}s</td></tr>
      <tr><td><b>Call ID</b></td><td>${esc(c.call_id)}</td></tr>
      ${varRows}
    </table>
    ${c.summary ? `<h3>Summary</h3><p>${esc(c.summary)}</p>` : ""}
    ${c.recording_url ? `<p><b>Recording:</b> ${esc(c.recording_url)}</p>` : ""}
    ${c.transcript ? `<h3>Transcript</h3><pre style="white-space:pre-wrap;font-size:12px">${esc(c.transcript)}</pre>` : ""}
    <p style="color:#888;font-size:12px">Automated call placed by the LoanServ voice agent to a consented lead.</p>
  `;

  const subject = sanitizeHeader(`Voice callback (${outcome}): ${name}`);

  try {
    const { sent } = await sendLeadEmail({ subject, html });
    // Never log the transcript or the number — only a non-PII trace.
    if (!sent) console.info("VOICE_CALL_RESULT", JSON.stringify({ callId: c.call_id, status: c.status }));
  } catch (err) {
    console.error("[voice-webhook] email send failed:", err instanceof Error ? err.message : "unknown");
    console.info("VOICE_CALL_RESULT", JSON.stringify({ callId: c.call_id, status: c.status }));
  }

  // Always 200 once authenticated so Dograh does not retry a delivered result.
  return NextResponse.json({ ok: true });
}
