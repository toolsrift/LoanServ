import Link from "next/link";
import type { Metadata } from "next";
import { CalendarClock, PartyPopper, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Card } from "@/components/ui/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import {
  festiveOffers,
  festiveSeasonEndsOn,
  festiveSeasonHasEnded,
  festiveSource,
} from "@/data/festive-offers";

const PATH = "/offers/festive-loan-offers-2026";

// Re-render daily so the seasonal guard below takes effect without waiting for a deploy.
export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const meta = buildMetadata({
    title: "Festive Loan Offers 2026: Processing Fee Waivers Compared",
    description:
      "Diwali 2026 loan offers from PNB, Kotak, Yes Bank, SBI and HDFC Bank compared: processing fee waivers, rate concessions and validity, with sources.",
    path: PATH,
  });
  // Expired offers should not keep earning impressions.
  return festiveSeasonHasEnded() ? { ...meta, robots: { index: false, follow: true } } : meta;
}

const faqs = [
  {
    q: "Is a processing fee waiver worth choosing a lender for?",
    a: "Only if the interest rate is also competitive. On a ₹10 lakh personal loan, a 1% fee is ₹10,000 plus GST. A rate just 0.5% higher can cost more than that over a few years. Compare the total cost of the loan, not only the fee.",
  },
  {
    q: "Do festive offers apply to everyone?",
    a: "No. Banks usually limit offers to certain products, customer segments or credit profiles. The rate you are offered still depends on your credit score, income and the lender's policy.",
  },
  {
    q: "Can I use a festive offer for a balance transfer?",
    a: "Some home-loan and top-up offers can cover balance transfers. Ask the lender before you apply. LoanServ can compare balance-transfer options across several lenders for you.",
  },
  {
    q: "Is LoanServ a lender?",
    a: "No. LoanServ is a loan facilitator (DSA). We help you compare and apply. The bank or NBFC makes the lending decision and sets the final terms.",
  },
];

export default function FestiveOffersPage() {
  const seasonOver = festiveSeasonHasEnded();
  const seasonEnd = new Date(`${festiveSeasonEndsOn}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Offers", href: "/offers" },
          { name: "Festive loan offers 2026", href: PATH },
        ]}
      />
      <PageHero
        eyebrow="Festive season 2026"
        eyebrowIcon={PartyPopper}
        title="Festive loan offers 2026, compared"
        description="Processing fee waivers and rate concessions banks have announced for the 2026 festive season, all in one table. Every offer is time-bound and comes with conditions, so confirm with the lender before you apply."
        trust={[
          { icon: CalendarClock, label: `Checked ${festiveSource.lastChecked}` },
          { icon: ShieldCheck, label: "Sourced from news reports" },
        ]}
      />

      {seasonOver && (
        <section className="pt-6">
          <Container>
            <div className="rounded-2xl border border-saffron/30 bg-saffron/10 p-4 text-sm text-[#8a5a04]">
              <strong>This offer period has ended.</strong> These campaigns ran until {seasonEnd} and are kept here
              for reference only. For current offers, check each lender&apos;s official page or see our{" "}
              <Link href="/offers" className="underline underline-offset-2">
                lender offers
              </Link>
              .
            </div>
          </Container>
        </section>
      )}

      <section className="pb-10">
        <Container>
          <div className="overflow-x-auto rounded-xl border border-sand bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Lender", "Products", "Offer", "Valid"].map((h) => (
                    <th key={h} className="border-b border-sand bg-muted/60 px-4 py-2.5 text-left font-semibold text-ink">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {festiveOffers.map((o) => (
                  <tr key={o.lender}>
                    <td className="border-b border-sand/60 px-4 py-3 align-top font-medium text-ink">
                      {o.lenderSlug ? (
                        <Link href={`/offers/${o.lenderSlug}`} className="text-evergreen underline underline-offset-2">
                          {o.lender}
                        </Link>
                      ) : (
                        o.lender
                      )}
                      {o.campaign && <span className="mt-1 block text-xs font-normal text-muted-foreground">{o.campaign}</span>}
                    </td>
                    <td className="border-b border-sand/60 px-4 py-3 align-top">{o.products}</td>
                    <td className="border-b border-sand/60 px-4 py-3 align-top">{o.offer}</td>
                    <td className="border-b border-sand/60 px-4 py-3 align-top whitespace-nowrap">{o.validity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Source:{" "}
            <a href={festiveSource.url} target="_blank" rel="noopener noreferrer" className="text-evergreen underline underline-offset-2">
              {festiveSource.name}
            </a>
            . Advertised &ldquo;starting&rdquo; rates go to the best credit profiles. Offers can change or end early.
            Always check the terms on the lender&apos;s official website.
          </p>
        </Container>
      </section>

      <section className="pb-10">
        <Container>
          <Card className="p-6">
            <h2 className="font-display text-xl text-ink">Already paying a high rate? A festive offer could cut it</h2>
            <p className="mt-2 text-sm text-slate">
              If your current personal or home loan rate is well above what lenders are advertising this season, a
              balance transfer or debt consolidation could lower your EMI. Check the numbers first with our{" "}
              <Link href="/calculators/balance-transfer-savings" className="text-evergreen underline underline-offset-2">
                balance transfer savings calculator
              </Link>{" "}
              or the{" "}
              <Link href="/calculators/debt-consolidation" className="text-evergreen underline underline-offset-2">
                debt consolidation calculator
              </Link>
              .
            </p>
          </Card>
        </Container>
      </section>

      <FaqSection faqs={faqs} />

      <Container>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            LoanServ is a loan facilitator (DSA), not a lender. We are not affiliated with, or an official channel of, the
            banks listed. Offer details come from public news reports and may have changed.
          </p>
        </Card>
      </Container>

      <CtaBlock title="Compare festive loan offers with one application" />
    </>
  );
}
