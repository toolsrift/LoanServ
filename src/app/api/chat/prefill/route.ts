import { NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/email";
import { allowRequest } from "@/lib/rate-limit";
import { extractLeadPrefill, isChatAgentEnabled } from "@/lib/chat-agent";
import { chatTranscriptSchema } from "@/lib/chat-schema";

export const runtime = "nodejs";
export const maxDuration = 30;

const prefillRateLimit = createRateLimiter({ globalLimit: 200 });

/**
 * Suggests values for the chat callback form from the conversation so far.
 * Always answers 200 with a (possibly empty) object — pre-fill is a nicety,
 * so every failure just means the visitor fills the form in themselves.
 */
export async function POST(req: Request) {
  if (!isChatAgentEnabled()) return NextResponse.json({});

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (!(await allowRequest(prefillRateLimit, `prefill:${ip}`, 5))) return NextResponse.json({});

  const body: unknown = await req.json().catch(() => null);
  const parsed = chatTranscriptSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({});

  return NextResponse.json(await extractLeadPrefill(parsed.data.messages));
}
