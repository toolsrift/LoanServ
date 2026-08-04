import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Badge } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Loan Guides & Tutorials — Step-by-Step How-Tos",
  description:
    "Practical, step-by-step tutorials on applying for a loan, checking eligibility, reading your credit report and doing a balance transfer — written for Indian borrowers.",
  path: "/knowledge-center/tutorials",
});

export default function TutorialsIndexPage() {
  const docs = listDocs("knowledge-center/tutorials");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Knowledge Center", href: "/knowledge-center" },
          { name: "Guides & Tutorials", href: "/knowledge-center/tutorials" },
        ]}
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Guides &amp; Tutorials</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Step-by-step tutorials</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Clear, practical walkthroughs that take you from question to done. Each guide breaks a task into simple steps
            so nothing about borrowing feels intimidating.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {docs.map((d) => (
              <Link
                key={d.slug}
                href={`/knowledge-center/tutorials/${d.slug}`}
                className="group flex flex-col rounded-2xl border border-sand bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Badge tone="mint">Tutorial</Badge>
                <h2 className="mt-3 font-display text-lg leading-snug text-ink group-hover:text-evergreen">
                  {d.frontmatter.title}
                </h2>
                {d.frontmatter.description && (
                  <p className="mt-2 text-sm text-slate">{d.frontmatter.description}</p>
                )}
                <div className="num mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {d.readingTime} min read
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-medium text-evergreen">
                    Read tutorial <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
