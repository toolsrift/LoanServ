import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listDocs, getDoc } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { KnowledgeArticleTemplate } from "@/templates/KnowledgeArticleTemplate";

const SUBDIR = "knowledge-center/product-info";

export function generateStaticParams() {
  return listDocs(SUBDIR).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(SUBDIR, slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || "",
    path: `/knowledge-center/product-info/${slug}`,
  });
}

export default async function ProductInfoArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(SUBDIR, slug);
  if (!doc) notFound();

  return <KnowledgeArticleTemplate doc={doc} section="product-info" sectionLabel="Product Info" />;
}
