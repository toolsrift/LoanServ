import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { glossary } from "@/data/glossary";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Loan & Credit Glossary — Lending Terms A to Z",
  description:
    "A plain-English A–Z glossary of Indian loan and credit terms — from Amortisation, APR and CIBIL Score to Tenure and Working Capital — explained clearly by LoanServ.",
  path: "/knowledge-center/glossary",
});

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  // Group terms by first letter, preserving alphabetical order.
  const byLetter = new Map<string, typeof glossary>();
  for (const term of [...glossary].sort((a, b) => a.term.localeCompare(b.term))) {
    const list = byLetter.get(term.letter) ?? [];
    list.push(term);
    byLetter.set(term.letter, list);
  }
  const letters = ALPHABET.filter((l) => byLetter.has(l));

  // Lookup for resolving related-term slugs to their display term.
  const bySlug = new Map(glossary.map((t) => [t.slug, t]));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Knowledge Center", href: "/knowledge-center" },
          { name: "Glossary", href: "/knowledge-center/glossary" },
        ]}
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Glossary</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Loan &amp; credit terms, A to Z</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Lending is full of jargon. This glossary explains the terms you will meet on a sanction letter, in an EMI
            schedule or on your credit report — in plain English, with no fine print. Jump to a letter or browse the full
            list below.
          </p>

          {/* A–Z jump nav */}
          <nav aria-label="Jump to letter" className="mt-8 flex flex-wrap gap-1.5">
            {ALPHABET.map((l) => {
              const active = byLetter.has(l);
              return active ? (
                <a
                  key={l}
                  href={`#letter-${l}`}
                  className="inline-grid h-9 w-9 place-items-center rounded-lg border border-sand bg-card text-sm font-semibold text-evergreen transition-colors hover:border-evergreen hover:bg-evergreen/10"
                >
                  {l}
                </a>
              ) : (
                <span
                  key={l}
                  aria-disabled
                  className="inline-grid h-9 w-9 place-items-center rounded-lg border border-sand/60 text-sm font-semibold text-muted-foreground/40"
                >
                  {l}
                </span>
              );
            })}
          </nav>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="space-y-12">
            {letters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen/10 font-display text-xl font-semibold text-evergreen">
                    {letter}
                  </span>
                  <span className="h-px flex-1 bg-sand" aria-hidden />
                </div>

                <div className="grid gap-4">
                  {byLetter.get(letter)!.map((term) => (
                    <Card key={term.slug} id={term.slug} className="scroll-mt-24 p-6">
                      <h2 className="font-display text-lg text-ink">{term.term}</h2>
                      <p className="mt-2 text-slate">{term.definition}</p>

                      {term.related && term.related.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand/70 pt-4">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Related
                          </span>
                          {term.related
                            .filter((slug, i, arr) => bySlug.has(slug) && slug !== term.slug && arr.indexOf(slug) === i)
                            .map((slug) => {
                              const rel = bySlug.get(slug)!;
                              return (
                                <a
                                  key={slug}
                                  href={`#${slug}`}
                                  className="inline-flex items-center rounded-full border border-sand bg-paper px-3 py-1 text-xs text-slate transition-colors hover:border-evergreen hover:text-evergreen"
                                >
                                  {rel.term}
                                </a>
                              );
                            })}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
            Definitions are educational and indicative for borrowers in India. Confirm exact terms and charges with your
            lender before signing. Need a term explained that isn&apos;t here? {" "}
            <Link href="/contact" className="font-medium text-evergreen hover:underline">
              Ask a {site.name} advisor
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
