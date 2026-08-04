import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Badge } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Loan Product Guides — Personal, Home, Business & LAP",
  description:
    "In-depth, India-focused guides to every major loan type — eligibility, interest rates, documents, charges and smart borrowing tips from LoanServ's lending team.",
  path: "/knowledge-center/product-info",
});

export default function ProductInfoIndexPage() {
  const docs = listDocs("knowledge-center/product-info");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Knowledge Center", href: "/knowledge-center" },
          { name: "Product Info", href: "/knowledge-center/product-info" },
        ]}
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Product Info</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Loan product guides</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Complete, plain-English guides to every loan we help you apply for. Understand eligibility, rates, documents
            and the fine print before you borrow.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {docs.map((d) => (
              <Link
                key={d.slug}
                href={`/knowledge-center/product-info/${d.slug}`}
                className="group flex flex-col rounded-2xl border border-sand bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Badge tone="evergreen">Guide</Badge>
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
                    Read guide <ArrowRight className="h-3.5 w-3.5" />
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
