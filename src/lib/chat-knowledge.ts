import "server-only";
import { listDocs } from "./content";
import { loans } from "@/data/loans";
import { calculators } from "@/data/calculators";
import { glossary } from "@/data/glossary";
import { siteFaqs } from "@/data/faq";
import { formatINR } from "./format";
import {
  buildIndex,
  chunkMarkdown,
  searchIndex,
  type KnowledgeChunk,
  type KnowledgeIndex,
  type SearchHit,
} from "./chat-text";

/**
 * The chat assistant's knowledge base: the site's own articles and product
 * data, chunked and BM25-indexed in memory on first use. Built from the same
 * sources the pages render from, so the assistant can't drift from the site.
 *
 * Deliberately excluded: lender comparison rows and monthly offers — those are
 * unverified/time-sensitive, and the assistant must not quote them as current.
 */

const MDX_SOURCES: { subdir: string; base: string }[] = [
  { subdir: "blog", base: "/blog" },
  { subdir: "knowledge-center/product-info", base: "/knowledge-center/product-info" },
  { subdir: "knowledge-center/tutorials", base: "/knowledge-center/tutorials" },
];

/** Top-level pages the assistant may link to besides the indexed ones. */
const STATIC_PAGES: { title: string; url: string }[] = [
  { title: "Apply for a loan", url: "/apply" },
  { title: "Free CIBIL score check", url: "/free-cibil-score" },
  { title: "Current loan offers", url: "/offers" },
  { title: "All loans", url: "/loans" },
  { title: "Balance transfer", url: "/balance-transfer" },
  { title: "Calculators", url: "/calculators" },
  { title: "Knowledge center", url: "/knowledge-center" },
  { title: "Glossary", url: "/knowledge-center/glossary" },
  { title: "Locations we serve", url: "/locations" },
  { title: "FAQ", url: "/faq" },
  { title: "Contact", url: "/contact" },
  { title: "About LoanServ", url: "/about" },
];

function loanChunks(): KnowledgeChunk[] {
  return loans.flatMap((l) => {
    const url = `/loans/${l.slug}`;
    const years = (m: number) => (m % 12 === 0 ? `${m / 12} years` : `${m} months`);
    return [
      {
        title: `${l.name} — overview`,
        url,
        text: [
          l.tagline,
          l.intro[0],
          `Indicative ranges only (the lender decides the actual terms): interest ${l.rateRange.from}%–${l.rateRange.to}% p.a., ` +
            `amount ${formatINR(l.amountRange.from)} to ${formatINR(l.amountRange.to)}, ` +
            `tenure ${years(l.tenureRange.fromMonths)} to ${years(l.tenureRange.toMonths)}.`,
        ].join("\n\n"),
      },
      { title: `${l.name} — eligibility`, url, text: l.eligibility.map((e) => `- ${e}`).join("\n") },
      { title: `${l.name} — documents required`, url, text: l.documents.map((d) => `- ${d}`).join("\n") },
      {
        title: `${l.name} — how to apply`,
        url,
        text: l.process.map((p, i) => `${i + 1}. ${p.title}: ${p.desc}`).join("\n"),
      },
      { title: `${l.name} — benefits`, url, text: l.benefits.map((b) => `- ${b.title}: ${b.desc}`).join("\n") },
      ...l.faqs.map((f) => ({ title: `${l.name} — ${f.q}`, url, text: f.a })),
    ];
  });
}

function buildChunks(): KnowledgeChunk[] {
  const mdx = MDX_SOURCES.flatMap(({ subdir, base }) =>
    listDocs(subdir).flatMap((d) => chunkMarkdown(d.content, d.frontmatter.title, `${base}/${d.slug}`)),
  );
  const faqs = siteFaqs.map((f) => ({ title: `LoanServ FAQ — ${f.q}`, url: "/faq", text: f.a }));
  const terms = glossary.map((t) => ({
    title: `Glossary — ${t.term}`,
    url: "/knowledge-center/glossary",
    text: t.definition,
  }));
  const calcs = calculators.map((c) => ({
    title: `${c.name} (calculator)`,
    url: `/calculators/${c.slug}`,
    text: [c.tagline, ...c.intro.slice(0, 1)].join("\n\n"),
  }));
  return [...faqs, ...loanChunks(), ...mdx, ...terms, ...calcs];
}

let cached: { index: KnowledgeIndex; paths: Set<string> } | null = null;

function load() {
  if (!cached) {
    const chunks = buildChunks();
    const paths = new Set<string>([...chunks.map((c) => c.url), ...STATIC_PAGES.map((p) => p.url)]);
    cached = { index: buildIndex(chunks), paths };
  }
  return cached;
}

export function searchKnowledge(query: string, k = 4): SearchHit[] {
  return searchIndex(load().index, query, k);
}

/** Every site path the assistant is allowed to link to. */
export function knownSitePaths(): Set<string> {
  return load().paths;
}

/** Compact page directory for the system prompt, so the model can point users around. */
export function pageDirectory(): string {
  const lines = [
    ...loans.map((l) => `- ${l.name}: /loans/${l.slug}`),
    ...calculators.map((c) => `- ${c.name}: /calculators/${c.slug}`),
    ...STATIC_PAGES.map((p) => `- ${p.title}: ${p.url}`),
  ];
  return lines.join("\n");
}
