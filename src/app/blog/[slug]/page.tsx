import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listDocs, getDoc } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { BlogPostTemplate } from "@/templates/BlogPostTemplate";

export function generateStaticParams() {
  return listDocs("blog").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc("blog", slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || "",
    path: `/blog/${slug}`,
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("blog", slug);
  if (!doc) notFound();

  const related = listDocs("blog")
    .filter((d) => d.slug !== slug && d.frontmatter.category === doc.frontmatter.category)
    .slice(0, 3);
  const filler = listDocs("blog").filter((d) => d.slug !== slug).slice(0, 3);
  return <BlogPostTemplate doc={doc} related={related.length ? related : filler} />;
}
