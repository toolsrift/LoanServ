import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ArrowRight, Landmark, RefreshCw, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { PageHero } from "@/components/sections/PageHero";
import { formatPercent } from "@/lib/format";
import { OffersTable } from "@/components/offers/OffersTable";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { FinancialProductJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getLenderOffers, getOffersMeta, offerLenderSlugs } from "@/lib/offers";
import { getLender } from "@/data/lenders";

export function generateStaticParams() {
  return offerLenderSlugs().map((lender) => ({ lender }));
}

export async function generateMetadata({ params }: { params: Promise<{ lender: string }> }): Promise<Metadata> {
  const { lender } = await params;
  const data = getLender(lender);
  const { month } = getOffersMeta();
  if (!data) return {};
  return buildMetadata({
    title: `${data.name} Loan Interest Rates & Offers — ${month}`.slice(0, 65),
    description: `Indicative ${data.name} interest rates, processing fees, tenure and offers for ${month}. Compare ${data.name} loans and apply through LoanServ.`.slice(0, 160),
    path: `/offers/${lender}`,
  });
}

export default async function LenderOffersPage({ params }: { params: Promise<{ lender: string }> }) {
  const { lender } = await params;
  const data = getLender(lender);
  const offers = getLenderOffers(lender);
  const { month } = getOffersMeta();
  if (!data || offers.length === 0) notFound();

  return (
    <>
      <FinancialProductJsonLd
        name={`${data.name} Loans`}
        description={`Indicative ${data.name} loan offers for ${month} via LoanServ.`}
        url={`/offers/${lender}`}
        provider={data.name}
        rateFrom={Math.min(...offers.map((o) => o.roiFrom))}
      />
      <Breadcrumbs
        items={[
          { name: "Offers", href: "/offers" },
          { name: data.name, href: `/offers/${lender}` },
        ]}
      />

      <PageHero
        eyebrow={`${data.type} · ${month}`}
        eyebrowIcon={Landmark}
        title={`${data.name} — loan offers`}
        description={data.about}
        primary={
          <ApplyButton size="lg">
            Apply via LoanServ <ArrowRight className="h-4 w-4" />
          </ApplyButton>
        }
        trust={[
          { icon: RefreshCw, label: `Updated ${month}` },
          { icon: ShieldCheck, label: "Indicative figures" },
        ]}
        aside={
          <div className="rounded-3xl border border-paper/12 bg-paper/[0.05] p-6 shadow-lift backdrop-blur">
            <div className="flex items-center gap-3">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white"
                style={{ background: data.tint }}
                aria-hidden
              >
                {data.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <div>
                <p className="font-display text-lg text-paper">{data.name}</p>
                <Badge tone="mint">{data.type}</Badge>
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-paper/10 pt-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-paper/50">Rates from</p>
                <p className="num text-3xl font-semibold text-mint">
                  {formatPercent(Math.min(...offers.map((o) => o.roiFrom)))}
                </p>
                <p className="text-xs text-paper/50">per annum · indicative</p>
              </div>
              <p className="num text-right text-sm text-paper/70">
                {offers.length} product{offers.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        }
      />

      <section className="pb-10">
        <Container>
          <Eyebrow>{month} rates</Eyebrow>
          <h2 className="mb-6 mt-3 text-display-sm">Indicative {data.name} rates &amp; fees</h2>
          <OffersTable offers={offers} month={month} />
        </Container>
      </section>

      <Container>
      </Container>

      <section className="pb-12">
        <Container>
          <h2 className="mb-5 font-display text-xl text-ink">{data.name} products</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <Link
                key={o.productSlug}
                href={`/offers/${lender}/${o.productSlug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div>
                  <p className="font-medium text-ink group-hover:text-evergreen">{o.product}</p>
                  <p className="num text-xs text-muted-foreground">from {o.roiFrom}% p.a.</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            LoanServ is an authorised DSA and is not affiliated with, or an official channel of, {data.name}. All
            figures are indicative and sourced from public information; confirm current terms directly with the lender.
          </p>
        </Card>
      </Container>

      <CtaBlock title={`Apply for a ${data.name} loan`} />
    </>
  );
}
