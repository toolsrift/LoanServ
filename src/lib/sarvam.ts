import "server-only";

/**
 * Minimal Sarvam AI chat-completions client (OpenAI-compatible endpoint).
 *
 * Like the other integrations here it NEVER throws: every failure comes back as
 * a non-PII reason string that is safe to log. See CHAT-AGENT.md.
 */

const DEFAULT_URL = "https://api.sarvam.ai/v1/chat/completions";
// The conversational variant is tuned for low-latency turn-taking — the same
// family the Dograh voice agent uses (VOICE-AGENT.md §3).
const DEFAULT_MODEL = "sarvam-105b-conversations";
const REQUEST_TIMEOUT_MS = 20_000;

export type SarvamMessage = { role: "system" | "user" | "assistant"; content: string };

export type SarvamResult = { ok: true; text: string } | { ok: false; reason: string };

function env(name: string): string {
  return (process.env[name] || "").trim();
}

export function hasSarvamKey(): boolean {
  return Boolean(env("SARVAM_API_KEY"));
}

export async function sarvamChat({
  messages,
  maxTokens = 700,
  temperature = 0.3,
}: {
  messages: SarvamMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<SarvamResult> {
  const key = env("SARVAM_API_KEY");
  if (!key) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch(env("SARVAM_CHAT_URL") || DEFAULT_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "api-subscription-key": key,
      },
      body: JSON.stringify({
        model: env("SARVAM_CHAT_MODEL") || DEFAULT_MODEL,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) return { ok: false, reason: `http-${res.status}` };

    const data = (await res.json().catch(() => null)) as {
      choices?: { message?: { content?: string | null } }[];
    } | null;
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) return { ok: false, reason: "empty-reply" };
    return { ok: true, text };
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? "timeout" : "network-error";
    return { ok: false, reason };
  }
}
