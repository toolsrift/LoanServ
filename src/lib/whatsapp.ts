import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { hasSarvamKey } from "./sarvam";
import { isLeadStoreConfigured } from "./lead-store";
import { site } from "./site";

/**
 * WhatsApp Business Cloud API (Meta) — webhook parsing and sending, via plain
 * fetch. The bot only ever replies to people who message first (the 24-hour
 * customer-service window), so it sends free-form messages, no templates.
 * See WHATSAPP-BOT.md.
 */

const TIMEOUT_MS = 8_000;

function env(name: string): string {
  return (process.env[name] || "").trim();
}

/** The bot needs its Meta credentials, Sarvam (answers) and Supabase (conversation + leads). */
export function isWhatsAppBotEnabled(): boolean {
  return (
    env("WHATSAPP_BOT_ENABLED") === "true" &&
    Boolean(env("WHATSAPP_ACCESS_TOKEN") && env("WHATSAPP_PHONE_NUMBER_ID") && env("WHATSAPP_APP_SECRET")) &&
    hasSarvamKey() &&
    isLeadStoreConfigured()
  );
}

/** Meta's one-time webhook verification handshake. Returns the challenge to echo, or null. */
export function verifyWebhookChallenge(params: URLSearchParams): string | null {
  const token = env("WHATSAPP_VERIFY_TOKEN");
  if (!token) return null;
  return params.get("hub.mode") === "subscribe" && params.get("hub.verify_token") === token
    ? params.get("hub.challenge")
    : null;
}

/** Checks Meta's X-Hub-Signature-256 (HMAC-SHA256 of the raw body with the app secret). */
export function verifyWhatsAppSignature(rawBody: string, header: string | null): boolean {
  const secret = env("WHATSAPP_APP_SECRET");
  if (!secret || !header?.startsWith("sha256=")) return false;
  const provided = Buffer.from(header.slice(7), "hex");
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export type InboundMessage = {
  id: string;
  /** Sender's number in international format without "+", e.g. "919876543210". */
  waId: string;
  /** WhatsApp profile name, if shared. */
  name: string;
  kind: "text" | "button" | "other";
  text?: string;
  buttonId?: string;
  /** Present when the chat started from a click-to-WhatsApp ad. */
  adReferral?: { headline?: string; sourceUrl?: string; sourceId?: string };
};

type WebhookValue = {
  contacts?: { wa_id?: string; profile?: { name?: string } }[];
  messages?: {
    id?: string;
    from?: string;
    type?: string;
    text?: { body?: string };
    interactive?: { type?: string; button_reply?: { id?: string; title?: string } };
    button?: { payload?: string; text?: string };
    referral?: { headline?: string; source_url?: string; source_id?: string };
  }[];
};

/** Pulls the user messages out of a webhook payload; delivery statuses etc. are ignored. */
export function parseInbound(payload: unknown): InboundMessage[] {
  const out: InboundMessage[] = [];
  const entries = (payload as { entry?: { changes?: { value?: WebhookValue }[] }[] })?.entry || [];
  for (const entry of entries) {
    for (const change of entry.changes || []) {
      const v = change.value || {};
      const names = new Map((v.contacts || []).map((c) => [c.wa_id || "", c.profile?.name || ""]));
      for (const m of v.messages || []) {
        if (!m.id || !m.from || !/^\d{8,15}$/.test(m.from)) continue;
        const base = {
          id: m.id,
          waId: m.from,
          name: (names.get(m.from) || "").slice(0, 80),
          adReferral: m.referral
            ? { headline: m.referral.headline?.slice(0, 200), sourceUrl: m.referral.source_url?.slice(0, 300), sourceId: m.referral.source_id?.slice(0, 100) }
            : undefined,
        };
        if (m.type === "text" && m.text?.body) {
          out.push({ ...base, kind: "text", text: m.text.body.slice(0, 1000) });
        } else if (m.type === "interactive" && m.interactive?.button_reply?.id) {
          out.push({ ...base, kind: "button", buttonId: m.interactive.button_reply.id });
        } else if (m.type === "button" && m.button?.payload) {
          out.push({ ...base, kind: "button", buttonId: m.button.payload });
        } else {
          out.push({ ...base, kind: "other" });
        }
      }
    }
  }
  return out;
}

async function send(body: Record<string, unknown>): Promise<boolean> {
  const version = env("WHATSAPP_GRAPH_VERSION") || "v23.0";
  try {
    const res = await fetch(`https://graph.facebook.com/${version}/${env("WHATSAPP_PHONE_NUMBER_ID")}/messages`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env("WHATSAPP_ACCESS_TOKEN")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", ...body }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) console.warn("[whatsapp] send failed:", `http-${res.status}`);
    return res.ok;
  } catch {
    console.warn("[whatsapp] send failed: network-error");
    return false;
  }
}

export function sendText(to: string, text: string): Promise<boolean> {
  return send({ to, type: "text", text: { body: text.slice(0, 4096), preview_url: false } });
}

/** Up to 3 reply buttons (WhatsApp's limit); titles max 20 characters. */
export function sendButtons(to: string, text: string, buttons: { id: string; title: string }[]): Promise<boolean> {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: text.slice(0, 1024) },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({ type: "reply", reply: { id: b.id, title: b.title.slice(0, 20) } })),
      },
    },
  });
}

/**
 * The website assistant's reply → WhatsApp text: **bold** → *bold*, site links
 * → "label: https://loanserv.in/path", plus one "Read more" link.
 */
export function toWhatsAppText(reply: string, sources: { title: string; url: string }[] = []): string {
  const base = site.url.replace(/\/$/, "");
  let text = reply
    .replace(/\*\*([^*\n]+)\*\*/g, "*$1*")
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (_m, label: string, path: string) => `${label}: ${base}${path}`);
  if (sources[0]) text += `\n\nRead more: ${base}${sources[0].url}`;
  return text;
}
