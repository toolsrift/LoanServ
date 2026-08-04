import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Container, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Mdx } from "@/components/content/Mdx";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import type { Doc } from "@/lib/content";

export function KnowledgeArticleTemplate({
  doc,
  section,
  sectionLabel,
}: {
  doc: Doc;
  section: "product-info" | "tutorials";
  sectionLabel: string;
}) {
  const fm = doc.frontmatter;
  const basePath = `/knowledge-center/${section}`;
  return (
    <>
      <ArticleJsonLd
        title={fm.title}
        description={fm.description || ""}
        slug={`${basePath}/${doc.slug}`}
        datePublished={fm.date || "2026-01-01"}
        dateModified={fm.updated || fm.date || "2026-01-01"}
        author={fm.author || site.name}
      />
      <Breadcrumbs
        items={[
          { name: "Knowledge Center", href: "/knowledge-center" },
          { name: sectionLabel, href: basePath },
          { name: fm.title, href: `${basePath}/${doc.slug}` },
        ]}
      />

      <article className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <Badge tone="mint">{sectionLabel}</Badge>
          <h1 className="mt-4 text-display-md text-ink">{fm.title}</h1>
          {fm.description && <p className="mt-4 text-lg text-slate">{fm.description}</p>}
          <div className="num mt-5 flex flex-wrap items-center gap-4 border-y border-sand py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {doc.readingTime} min read
            </span>
            <span className="ml-auto not-italic">By LoanServ Editorial</span>
          </div>

          <div className="mt-8">
            <Mdx source={doc.content} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={basePath}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {sectionLabel}
            </Link>
            <Link
              href="/knowledge-center"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen hover:underline"
            >
              Knowledge Center home
            </Link>
          </div>
        </Container>
      </article>

      <CtaBlock />
    </>
  );
}
