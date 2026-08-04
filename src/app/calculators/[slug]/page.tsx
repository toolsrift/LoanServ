import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculators, getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPageTemplate } from "@/templates/CalculatorPageTemplate";

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) return {};
  return buildMetadata({ title: meta.metaTitle, description: meta.metaDescription, path: `/calculators/${meta.slug}` });
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) notFound();
  return <CalculatorPageTemplate meta={meta} />;
}
