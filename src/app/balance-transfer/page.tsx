import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, TrendingDown } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { balanceTransfers } from "@/data/balance-transfer";

export const metadata: Metadata = buildMetadata({
  title: "Loan Balance Transfer & Top-Up — Save on Interest",
  description:
    "Transfer your personal, home, car or LAP loan to a lower rate, convert credit card dues, or take a top-up. LoanServ compares offers and shows your real net saving.",
  path: "/balance-transfer",
});

export default function BalanceTransferHub() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Balance Transfer", href: "/balance-transfer" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Balance Transfer &amp; Top-Up</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Pay less interest on the loan you already have</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            If your current loan carries a higher rate than the market, a balance transfer can cut your EMI and total
            interest. We run the honest maths — including processing fees — before you switch.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {balanceTransfers.map((b) => (
              <Link
                key={b.slug}
                href={`/balance-transfer/${b.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint/15 text-[#0c6b4c]">
                    <TrendingDown className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
                </div>
                <h2 className="font-display text-lg text-ink">{b.name}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{b.tagline}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBlock title="Not sure if a transfer is worth it?" subtitle="Send us your current loan details — we'll calculate the net saving and only recommend switching if it genuinely helps." />
    </>
  );
}
