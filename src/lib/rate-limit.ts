import "server-only";
import type { RateLimiter } from "./email";

/**
 * Rate limiting shared across every serverless instance, on Upstash Redis via
 * its REST API (plain fetch). Fixed windows: one counter per key per window.
 * Off unless UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set; when
 * off, or if Upstash is unreachable, it falls back to the per-instance
 * in-memory limiter so requests are still limited.
 */

const TIMEOUT_MS = 1_500;

function env(name: string): string {
  return (process.env[name] || "").trim();
}

export function isSharedRateLimitConfigured(): boolean {
  return Boolean(env("UPSTASH_REDIS_REST_URL") && env("UPSTASH_REDIS_REST_TOKEN"));
}

export async function allowRequest(
  fallback: RateLimiter,
  key: string,
  limit = 5,
  windowMs = 60_000,
): Promise<boolean> {
  if (!isSharedRateLimitConfigured()) return fallback(key, limit, windowMs);

  const bucket = `rl:${key}:${Math.floor(Date.now() / windowMs)}`;
  try {
    const res = await fetch(`${env("UPSTASH_REDIS_REST_URL").replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env("UPSTASH_REDIS_REST_TOKEN")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", bucket],
        ["PEXPIRE", bucket, String(windowMs * 2)],
      ]),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return fallback(key, limit, windowMs);
    const data = (await res.json()) as { result?: unknown }[];
    const count = Number(data?.[0]?.result);
    return Number.isFinite(count) ? count <= limit : fallback(key, limit, windowMs);
  } catch {
    return fallback(key, limit, windowMs);
  }
}
