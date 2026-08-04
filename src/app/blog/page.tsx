import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { BlogList, type BlogListItem } from "@/components/sections/BlogList";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "LoanServ Blog — Loans, Credit Score & Tax Guides",
  description:
    "Practical, original guides on personal, home and business loans, CIBIL scores, balance transfers, tax and RBI updates — written by LoanServ's lending team.",
  path: "/blog",
});

const CATEGORIES = ["Personal Loans", "Home Loans", "Business Loans", "Credit Score", "Tax", "RBI/News"];

export default function BlogPage() {
  const posts: BlogListItem[] = listDocs("blog").map((d) => ({
    slug: d.slug,
    title: d.frontmatter.title,
    description: d.frontmatter.description || "",
    category: d.frontmatter.category || "Personal Loans",
    date: d.frontmatter.date || "",
    readingTime: d.readingTime,
  }));

  return (
    <>
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>The LoanServ blog</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Borrow smarter, spend wiser</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Original, jargon-free guides to help you make better decisions about loans, credit and money in India.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <BlogList posts={posts} categories={CATEGORIES} />
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
