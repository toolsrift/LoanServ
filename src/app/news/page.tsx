import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Newspaper } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { fetchNews } from "@/lib/news";

export const revalidate = 3600; // refresh hourly (ISR)

export const metadata: Metadata = buildMetadata({
  title: "Finance & RBI News — Banking & Loan Headlines",
  description:
    "Curated finance, banking and RBI headlines relevant to borrowers in India. We summarise and link to the original source — always read the full story there.",
  path: "/news",
});

export default async function NewsPage() {
  const items = await fetchNews();

  return (
    <>
      <Breadcrumbs items={[{ name: "News", href: "/news" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Finance news</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Banking &amp; RBI headlines for borrowers</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            A quick, curated feed of finance and RBI news. We show the headline, source and a short summary — click
            through to read the full article at the original publisher. This aggregated feed is separate from our{" "}
            <Link href="/blog" className="text-evergreen underline">
              original blog
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          {items.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-12 text-center">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
              <p className="text-slate">The news feed is temporarily unavailable. Please check back shortly.</p>
              <p className="text-xs text-muted-foreground">
                Tip: set <code className="num">NEWS_RSS_URL</code> to your preferred finance RSS feed.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-evergreen">{item.source}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-evergreen" />
                  </div>
                  <h2 className="font-display text-lg leading-snug text-ink group-hover:text-evergreen">{item.title}</h2>
                  {item.summary && <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{item.summary}</p>}
                  {item.date && <p className="num mt-3 text-xs text-muted-foreground">{item.date}</p>}
                </a>
              ))}
            </div>
          )}
          <p className="mt-6 text-xs text-muted-foreground">
            Headlines and summaries are aggregated from third-party RSS feeds and remain the property of their
            publishers. LoanServ links out and does not reproduce full articles.
          </p>
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
