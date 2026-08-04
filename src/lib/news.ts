import "server-only";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  summary: string;
  date?: string;
}

/** Strip HTML/CDATA and clamp to a short original-style summary. */
function clean(text: string, max = 220): string {
  const stripped = text
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > max ? stripped.slice(0, max).trim() + "…" : stripped;
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  return m ? m[1] : "";
}

/** Only http(s) links are safe to turn into hrefs — reject javascript:, data:, etc. */
function isHttpUrl(value: string): boolean {
  try {
    const proto = new URL(value).protocol;
    return proto === "http:" || proto === "https:";
  } catch {
    return false;
  }
}

/**
 * Fetches finance/RBI headlines from a configurable RSS feed at build/ISR time.
 * Returns only headline + source + a short summary that links out (no full bodies).
 * Fails gracefully (empty list) if the feed is unreachable.
 */
export async function fetchNews(limit = 12): Promise<NewsItem[]> {
  const feedUrl =
    process.env.NEWS_RSS_URL ||
    process.env.NEXT_PUBLIC_NEWS_RSS ||
    "https://www.thehindubusinessline.com/money-and-banking/feeder/default.rss";
  const source = (() => {
    try {
      return new URL(feedUrl).hostname.replace(/^www\./, "");
    } catch {
      return "source";
    }
  })();

  // Only fetch http(s) feeds — guards against file:/other schemes via env misconfig.
  if (!isHttpUrl(feedUrl)) return [];

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "LoanServ/1.0 (+https://loanserv.in)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split(/<item[\s>]/i).slice(1);
    return items.slice(0, limit).map((block) => {
      const title = clean(tag(block, "title"), 140);
      const link = clean(tag(block, "link") || tag(block, "guid"));
      const description = clean(tag(block, "description"));
      const date = clean(tag(block, "pubDate"), 40);
      return { title, link, source, summary: description, date };
    }).filter((i) => i.title && i.link && isHttpUrl(i.link));
  } catch {
    return [];
  }
}
