import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { balanceTransfers, getBt } from "@/data/balance-transfer";
import { buildMetadata } from "@/lib/seo";
import { BalanceTransferPageTemplate } from "@/templates/BalanceTransferPageTemplate";

export function generateStaticParams() {
  return balanceTransfers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bt = getBt(slug);
  if (!bt) return {};
  return buildMetadata({ title: bt.metaTitle, description: bt.metaDescription, path: `/balance-transfer/${bt.slug}` });
}

export default async function BtPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bt = getBt(slug);
  if (!bt) notFound();
  return <BalanceTransferPageTemplate bt={bt} />;
}
