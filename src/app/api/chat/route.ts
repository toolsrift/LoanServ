import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/email";
import { answer, isChatAgentEnabled } from "@/lib/chat-agent";
import { chatRequestSchema, type ChatResponse } from "@/lib/chat-schema";

export const runtime = "nodejs";
// A Sarvam round-trip can take several seconds; leave headroom over its 20s timeout.
export const maxDuration = 30;

// Separate from the lead-form limiter so chat volume can never block /apply.
const chatRateLimit = createRateLimiter({ globalLimit: 600 });

const UNAVAILABLE =
  "The assistant is unavailable right now. You can still request a callback, or use the Apply form.";

export async function POST(req: Request) {
  if (!isChatAgentEnabled()) {
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!chatRateLimit(`chat:${ip}`, 20)) {
    return NextResponse.json({ error: "You're sending messages too fast. Please wait a moment." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please shorten your message and try again." }, { status: 422 });
  }

  const result = await answer(parsed.data.messages);
  if (!result.ok) {
    // Non-PII trace only: the reason, never the conversation.
    console.warn("[chat] no reply:", result.reason);
    return NextResponse.json({ error: UNAVAILABLE }, { status: 502 });
  }

  const res: ChatResponse = { reply: result.reply, sources: result.sources, offerLeadForm: result.offerLeadForm };
  return NextResponse.json(res);
}
