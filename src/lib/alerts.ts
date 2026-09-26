import "server-only";

/**
 * Instant new-lead alerts to the team's phone via a Telegram bot, so an
 * advisor can call back within minutes. Off unless TELEGRAM_BOT_TOKEN and
 * TELEGRAM_CHAT_ID are set. Never throws; an alert failure never affects a lead.
 */

const TIMEOUT_MS = 3_000;

function env(name: string): string {
  return (process.env[name] || "").trim();
}

export function isAlertsConfigured(): boolean {
  return Boolean(env("TELEGRAM_BOT_TOKEN") && env("TELEGRAM_CHAT_ID"));
}

/** Sends a plain-text alert. Returns whether Telegram accepted it. */
export async function sendAlert(text: string): Promise<boolean> {
  if (!isAlertsConfigured()) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      // Plain text (no parse_mode) so names can never break message formatting.
      body: JSON.stringify({ chat_id: env("TELEGRAM_CHAT_ID"), text: text.slice(0, 4000), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
