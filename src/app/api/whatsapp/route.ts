import { after, NextResponse } from "next/server";
import { isWhatsAppBotEnabled, parseInbound, verifyWebhookChallenge, verifyWhatsAppSignature } from "@/lib/whatsapp";
import { handleInbound } from "@/lib/whatsapp-bot";

export const runtime = "nodejs";
// Replies are generated after the response (see after()), with time for a Sarvam round-trip.
export const maxDuration = 60;

/** Meta's webhook verification: echo hub.challenge when the verify token matches. */
export async function GET(req: Request) {
  const challenge = verifyWebhookChallenge(new URL(req.url).searchParams);
  return challenge
    ? new NextResponse(challenge, { status: 200, headers: { "content-type": "text/plain" } })
    : NextResponse.json({ error: "Forbidden." }, { status: 403 });
}

/**
 * Incoming WhatsApp messages. Authenticated by Meta's X-Hub-Signature-256.
 * Acknowledged immediately — Meta retries slow webhooks — and handled after
 * the response is sent.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWhatsAppSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isWhatsAppBotEnabled()) return NextResponse.json({ ok: true, ignored: true });

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const messages = parseInbound(payload);
  if (messages.length) {
    after(async () => {
      // Sequential so one person's quick messages are handled in order.
      for (const m of messages) await handleInbound(m);
    });
  }
  return NextResponse.json({ ok: true });
}
