import Link from "next/link";
import { Clock, CalendarDays, ArrowLeft } from "lucide-react";
import { Container, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Mdx } from "@/components/content/Mdx";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";
import type { Doc } from "@/lib/content";

export function BlogPostTemplate({ doc, related }: { doc: Doc; related: Doc[] }) {
  const fm = doc.frontmatter;
  return (
    <>
      <ArticleJsonLd
        title={fm.title}
        description={fm.description || ""}
        slug={`/blog/${doc.slug}`}
        datePublished={fm.date || "2026-01-01"}
        dateModified={fm.updated || fm.date || "2026-01-01"}
        author={fm.author || site.name}
      />
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: fm.title, href: `/blog/${doc.slug}` }]} />

      <article className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          {fm.category && <Badge tone="mint">{fm.category}</Badge>}
          <h1 className="mt-4 text-display-md text-ink">{fm.title}</h1>
          {fm.description && <p className="mt-4 text-lg text-slate">{fm.description}</p>}
          <div className="num mt-5 flex flex-wrap items-center gap-4 border-y border-sand py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(fm.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {doc.readingTime} min read
            </span>
            <span className="ml-auto not-italic">By {fm.author || "LoanServ Editorial"}</span>
          </div>

          <div className="mt-8">
            <Mdx source={doc.content} />
          </div>

          <div className="mt-10">
          </div>

          {/* Author box (E-E-A-T) */}
          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-sand bg-white p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-evergreen/10 font-display text-lg font-semibold text-evergreen">
              LS
            </span>
            <div>
              <p className="font-semibold text-ink">{fm.author || "LoanServ Editorial"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Written by LoanServ&apos;s lending team — DSA advisors who help borrowers across AP, Telangana, Bangalore
                and Chennai compare loans daily. Information is educational and indicative; confirm terms with the
                lender.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="border-t border-sand py-12">
          <Container className="max-w-4xl">
            <h2 className="mb-6 font-display text-xl text-ink">Related reading</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  {r.frontmatter.category && <Badge tone="sand">{r.frontmatter.category}</Badge>}
                  <h3 className="mt-2 font-display text-base leading-snug text-ink group-hover:text-evergreen">
                    {r.frontmatter.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBlock />
    </>
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return date;
  }
}
