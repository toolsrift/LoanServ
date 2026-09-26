/**
 * Pure text utilities for the chat assistant: retrieval (BM25 over site
 * content), MDX chunking, PII redaction and reply clean-up. No imports and no
 * I/O, so every rule here is unit-testable in isolation.
 */

// ---------------------------------------------------------------------------
// Tokenising + BM25 retrieval
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
  (
    "a an and are as at be but by can do does for from get got have how i if in into is it its " +
    "me my of on or our so than that the their them then there these they this to up us was " +
    "we what when where which who why will with you your yours about any also am been being " +
    "could did just more most much need should some such very would want tell please"
  ).split(" "),
);

/** Lower-cases, splits on anything that isn't a letter/digit (any script), drops stopwords. */
export function tokenize(text: string): string[] {
  const words = text.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const out: string[] = [];
  for (const w of words) {
    if (STOPWORDS.has(w)) continue;
    if (w.length < 2 && !/\d/.test(w)) continue;
    out.push(stem(w));
  }
  return out;
}

/** Deliberately tiny English plural stemmer — enough to match "loans" with "loan". */
function stem(w: string): string {
  if (!/^[a-z]+$/.test(w) || w.length <= 4) return w;
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us")) return w.slice(0, -1);
  return w;
}

export interface KnowledgeChunk {
  /** Page or section title shown to the model and as a source link. */
  title: string;
  /** Site-relative URL, e.g. "/loans/home-loan". */
  url: string;
  text: string;
}

interface IndexedChunk extends KnowledgeChunk {
  tf: Map<string, number>;
  len: number;
}

export interface KnowledgeIndex {
  chunks: IndexedChunk[];
  df: Map<string, number>;
  avgLen: number;
}

export function buildIndex(chunks: KnowledgeChunk[]): KnowledgeIndex {
  const df = new Map<string, number>();
  let total = 0;
  const indexed = chunks.map((c) => {
    // Title tokens count twice: a heading match is a strong relevance signal.
    const tokens = [...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.text)];
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
    total += tokens.length;
    return { ...c, tf, len: tokens.length };
  });
  return { chunks: indexed, df, avgLen: indexed.length ? total / indexed.length : 0 };
}

export interface SearchHit extends KnowledgeChunk {
  score: number;
}

/** Okapi BM25. Returns up to `k` hits with a positive score, best first. */
export function searchIndex(index: KnowledgeIndex, query: string, k = 4): SearchHit[] {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length || !index.chunks.length) return [];

  const N = index.chunks.length;
  const k1 = 1.2;
  const b = 0.75;

  const hits: SearchHit[] = [];
  for (const c of index.chunks) {
    let score = 0;
    for (const t of terms) {
      const f = c.tf.get(t);
      if (!f) continue;
      const n = index.df.get(t) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * c.len) / (index.avgLen || 1)));
    }
    if (score > 0) hits.push({ title: c.title, url: c.url, text: c.text, score });
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, k);
}

// ---------------------------------------------------------------------------
// MDX → plain-text chunks
// ---------------------------------------------------------------------------

/** Strips markdown/MDX syntax the model doesn't need, keeping the words. */
export function mdToPlain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ") // HTML / JSX tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, "") // table separator rows
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Splits a markdown document into one chunk per `##`/`###` section, and splits
 * long sections on paragraph boundaries so no chunk exceeds `maxChars`.
 */
export function chunkMarkdown(
  md: string,
  docTitle: string,
  url: string,
  maxChars = 1400,
): KnowledgeChunk[] {
  const sections: { heading: string; body: string[] }[] = [{ heading: "", body: [] }];
  for (const line of md.split("\n")) {
    const h = line.match(/^#{2,3}\s+(.+)$/);
    if (h) sections.push({ heading: h[1].trim(), body: [] });
    else sections[sections.length - 1].body.push(line);
  }

  const chunks: KnowledgeChunk[] = [];
  for (const s of sections) {
    const text = mdToPlain(s.body.join("\n"));
    if (!text) continue;
    const title = s.heading ? `${docTitle} — ${mdToPlain(s.heading)}` : docTitle;

    let buf = "";
    for (const para of text.split(/\n{2,}/)) {
      if (buf && buf.length + para.length + 2 > maxChars) {
        chunks.push({ title, url, text: buf });
        buf = "";
      }
      buf = buf ? `${buf}\n\n${para}` : para;
    }
    if (buf) chunks.push({ title, url, text: buf.slice(0, maxChars * 2) });
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// PII redaction — applied before any user text leaves for the LLM provider
// ---------------------------------------------------------------------------

/**
 * Removes identifiers a borrower might paste into chat: email, PAN, Aadhaar /
 * card numbers, Indian mobiles and long account-like digit runs. Loan amounts
 * ("5,00,000", "500000", "5 lakh") survive — they're short or comma-grouped.
 */
export function redactPii(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
    .replace(/\b[A-Z]{5}\d{4}[A-Z]\b/gi, "[PAN removed]")
    // Mobiles before Aadhaar/card: "+919876543210" is also 12 digits.
    .replace(/(?<!\d)(?:\+?91[ -]?|0)?[6-9]\d{4}[ -]?\d{5}(?!\d)/g, "[phone removed]")
    .replace(/(?<!\d)\d{4}(?:[ -]?\d{4}){2,3}(?!\d)/g, "[number removed]") // Aadhaar / card
    .replace(/(?<!\d)\d{9,18}(?!\d)/g, "[number removed]"); // bank account etc.
}

// ---------------------------------------------------------------------------
// Model reply clean-up
// ---------------------------------------------------------------------------

/** Marker the system prompt tells the model to emit when the user wants to apply. */
export const APPLY_MARKER = /\[\[\s*APPLY\s*\]\]/gi;

/** Drops reasoning blocks some models inline as <think>…</think>. */
export function stripThinking(text: string): string {
  let out = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  // Unclosed block: either the reply starts inside one (drop up to the close) or
  // it was cut off mid-thought (drop from the open tag onwards).
  const close = out.search(/<\/think>/i);
  if (close !== -1) out = out.slice(close + "</think>".length);
  const open = out.search(/<think>/i);
  if (open !== -1) out = out.slice(0, open);
  return out.trim();
}

/**
 * Normalises a link target to a site-relative path, or null if it points
 * off-site. `siteOrigin` lets absolute links to our own domain survive.
 */
export function toSitePath(href: string, siteOrigin: string): string | null {
  let h = href.trim();
  const origin = siteOrigin.replace(/\/$/, "");
  if (origin && h.toLowerCase().startsWith(origin.toLowerCase())) h = h.slice(origin.length) || "/";
  if (!h.startsWith("/") || h.startsWith("//")) return null;
  if (!/^\/[A-Za-z0-9\-_/]*(#[A-Za-z0-9\-_]*)?$/.test(h)) return null;
  return h.length > 1 ? h.replace(/\/(?=#|$)/, "") : h;
}

export interface CleanReply {
  text: string;
  offerLeadForm: boolean;
}

/**
 * Turns raw model output into what the widget renders: reasoning stripped, the
 * apply marker converted to a flag, and every link either rewritten to a known
 * site path or flattened to plain text (the model must not send users off-site
 * or to pages that don't exist).
 */
export function cleanReply(raw: string, knownPaths: Set<string>, siteOrigin: string): CleanReply {
  let text = stripThinking(raw);
  const offerLeadForm = APPLY_MARKER.test(text);
  APPLY_MARKER.lastIndex = 0;
  text = text.replace(APPLY_MARKER, "");

  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const path = toSitePath(href, siteOrigin);
    return path && knownPaths.has(path.split("#")[0]) ? `[${label}](${path})` : label;
  });

  text = text.replace(/\n{3,}/g, "\n\n").trim();
  return { text, offerLeadForm };
}

/** Pulls the first JSON object out of a model reply (tolerates prose/fences around it). */
export function extractJsonObject(raw: string): Record<string, unknown> | null {
  const text = stripThinking(raw);
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const v: unknown = JSON.parse(text.slice(start, end + 1));
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
