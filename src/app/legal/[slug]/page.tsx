import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listDocs, getDoc } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { LegalPageTemplate } from "@/templates/LegalPageTemplate";

export function generateStaticParams() {
  return listDocs("legal").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc("legal", slug);
  if (!doc) return {};
  return buildMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description || `${doc.frontmatter.title} — LoanServ`,
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc("legal", slug);
  if (!doc) notFound();
  return <LegalPageTemplate doc={doc} />;
}
