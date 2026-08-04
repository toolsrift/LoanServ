import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loans, getLoan } from "@/data/loans";
import { buildMetadata } from "@/lib/seo";
import { LoanPageTemplate } from "@/templates/LoanPageTemplate";

export function generateStaticParams() {
  return loans.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loan = getLoan(slug);
  if (!loan) return {};
  return buildMetadata({
    title: loan.metaTitle,
    description: loan.metaDescription,
    path: `/loans/${loan.slug}`,
  });
}

export default async function LoanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loan = getLoan(slug);
  if (!loan) notFound();
  return <LoanPageTemplate loan={loan} />;
}
