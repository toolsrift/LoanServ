import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, RefreshCw, ShieldCheck, Landmark } from "lucide-react";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { FinancialProductJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getAllOffers, getLenderProductOffer, getOffersMeta } from "@/lib/offers";

export function generateStaticParams() {
  return getAllOffers().map((o) => ({ lender: o.lenderSlug, product: o.productSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lender: string; product: string }>;
}): Promise<Metadata> {
  const { lender, product } = await params;
  const offer = getLenderProductOffer(lender, product);
  if (!offer) return {};
  return buildMetadata({
    title: `${offer.lender} ${offer.product} Rates & Offers — ${offer.month}`.slice(0, 65),
    description: `${offer.lender} ${offer.product}: indicative interest from ${offer.roiFrom}% p.a., ${offer.processingFee} processing fee, ${offer.tenure}. Updated ${offer.month}. Apply via LoanServ.`.slice(0, 160),
    path: `/offers/${lender}/${product}`,
  });
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ lender: string; product: string }>;
}) {
  const { lender, product } = await params;
  const offer = getLenderProductOffer(lender, product);
  const { month } = getOffersMeta();
  if (!offer) notFound();

  const rows: { label: string; value: string }[] = [
    { label: "Interest rate (p.a.)", value: `${offer.roiFrom}% – ${offer.roiTo}%` },
    { label: "Processing fee", value: offer.processingFee },
    { label: "Tenure", value: offer.tenure },
    { label: "Pre-closure charges", value: offer.preclosureCharges },
    { label: "Foreclosure charges", value: offer.foreclosureCharges },
    { label: "Insurance", value: offer.insuranceNotes },
  ];

  return (
    <>
      <FinancialProductJsonLd
        name={`${offer.lender} ${offer.product}`}
        description={`Indicative ${offer.lender} ${offer.product} offer for ${offer.month}.`}
        url={`/offers/${lender}/${product}`}
        provider={offer.lender}
        rateFrom={offer.roiFrom}
      />
      <Breadcrumbs
        items={[
          { name: "Offers", href: "/offers" },
          { name: offer.lender, href: `/offers/${lender}` },
          { name: offer.product, href: `/offers/${lender}/${product}` },
        ]}
      />

      <PageHero
        eyebrow={`${offer.lender} · Indicative`}
        eyebrowIcon={Landmark}
        title={`${offer.lender} ${offer.product} — rates & offers`}
        description={`Indicative interest from ${offer.roiFrom}% p.a. with ${offer.processingFee} processing fee and ${offer.tenure} tenure. Compare and apply through LoanServ.`}
        primary={
          <ApplyButton size="lg">
            Apply for this loan <ArrowRight className="h-4 w-4" />
          </ApplyButton>
        }
        trust={[
          { icon: RefreshCw, label: `Updated ${offer.lastUpdated || month}` },
          { icon: ShieldCheck, label: offer.verified ? "Confirm with lender" : "Unverified — confirm with lender" },
        ]}
      />

      <section className="pb-10">
        <Container className="max-w-3xl">
          {!offer.verified && (
            <div className="mb-6 rounded-2xl border border-saffron/30 bg-saffron/10 p-4 text-sm text-[#8a5a04]">
              <Badge tone="saffron" className="mb-2">
                Unverified
              </Badge>
              <p>
                This figure has not yet been manually confirmed against {offer.lender}&apos;s own page — treat it as
                an estimate only and confirm the current rate directly with the lender or our team before applying.
              </p>
            </div>
          )}
          {offer.specialOffer && (
            <div className="mb-6 rounded-2xl border border-saffron/30 bg-saffron/10 p-4 text-sm text-[#8a5a04]">
              <strong>Special offer:</strong> {offer.specialOffer}
            </div>
          )}
          <Card className="overflow-hidden p-0">
            <dl className="divide-y divide-sand">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 px-6 py-4">
                  <dt className="text-sm text-muted-foreground">{r.label}</dt>
                  <dd className="num max-w-[60%] text-right text-sm font-medium text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ApplyButton size="lg">Apply for this loan</ApplyButton>
            <a
              href={offer.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-sand px-5 text-sm font-medium text-slate hover:border-evergreen hover:text-evergreen"
            >
              View lender&apos;s official page
            </a>
          </div>


          <p className="text-xs text-muted-foreground">
            LoanServ is an authorised DSA, not affiliated with {offer.lender}. Figures are indicative, sourced from
            public information for {offer.month}, and subject to change by the lender. This is not an offer of credit —
            see our{" "}
            <Link href="/legal/disclaimer" className="text-evergreen underline">
              Disclaimer
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBlock title={`Apply for a ${offer.lender} ${offer.product}`} />
    </>
  );
}
