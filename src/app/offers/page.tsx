import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Landmark, RefreshCw, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Card } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { OffersTable } from "@/components/offers/OffersTable";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { getAllOffers, getOffersMeta, offerLenderSlugs } from "@/lib/offers";
import { getLender } from "@/data/lenders";

export function generateMetadata(): Metadata {
  const { month } = getOffersMeta();
  return buildMetadata({
    title: `Latest Loan Offers — ${month}`,
    description: `Compare indicative ${month} interest rates, processing fees and offers on personal, home, business and property loans across 30+ banks & NBFCs. Updated monthly.`,
    path: "/offers",
  });
}

export default function OffersHub() {
  const offers = getAllOffers();
  const { month } = getOffersMeta();
  const lenders = offerLenderSlugs()
    .map(getLender)
    .filter(Boolean);

  return (
    <>
      <Breadcrumbs items={[{ name: "Offers", href: "/offers" }]} />
      <PageHero
        eyebrow="This month's offers"
        eyebrowIcon={RefreshCw}
        title={`Latest loan offers — ${month}`}
        description="A single, filterable view of indicative interest rates, fees and special offers across our partner banks and NBFCs. Refreshed monthly and reviewed by our team — always confirm the final figure with the lender."
        trust={[
          { icon: Landmark, label: "30+ banks & NBFCs" },
          { icon: RefreshCw, label: `Updated ${month}` },
          { icon: ShieldCheck, label: "Indicative · sourced" },
        ]}
      />

      <section className="pb-10">
        <Container>
          <OffersTable offers={offers} month={month} />
        </Container>
      </section>

      <Container>
      </Container>

      <section className="pb-12">
        <Container>
          <h2 className="mb-5 font-display text-xl text-ink">Browse offers by lender</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lenders.map((l) => (
              <Link
                key={l!.slug}
                href={`/offers/${l!.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                    style={{ background: l!.tint }}
                    aria-hidden
                  >
                    {l!.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                  <span className="text-sm font-medium text-ink group-hover:text-evergreen">{l!.name}</span>
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
            <strong className="text-ink">How we keep this current:</strong> offers are stored as structured data and
            refreshed on the 1st of each month via an automated job that flags proposed changes for human review. We
            publish figures as <em>indicative</em> and never present unverified rates as guaranteed. See our{" "}
            <Link href="/legal/disclaimer" className="text-evergreen underline">
              Disclaimer
            </Link>
            .
          </p>
        </Card>
      </Container>

      <CtaBlock title="Want the exact rate for your profile?" subtitle="Indicative tables only go so far. Apply and we'll get you real, personalised quotes from multiple lenders." />
    </>
  );
}
