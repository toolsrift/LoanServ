import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { calculators } from "@/data/calculators";
import type { CalculatorMeta } from "@/data/types";

export const metadata: Metadata = buildMetadata({
  title: "Free Financial Calculators — EMI, SIP, Tax & More",
  description:
    "20+ free, accurate calculators: EMI, loan eligibility, balance transfer savings, prepayment, SIP, FD, PPF, income tax, HRA, GST and more. Instant results with charts.",
  path: "/calculators",
});

const groupOrder: CalculatorMeta["group"][] = ["Loan EMI", "Eligibility", "Investment", "Tax & Other"];

export default function CalculatorsHubPage() {
  const byGroup = groupOrder.map((group) => ({
    group,
    items: calculators.filter((c) => c.group === group),
  }));

  return (
    <>
      <Breadcrumbs items={[{ name: "Calculators", href: "/calculators" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Free tools</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Financial calculators</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Run the numbers before you borrow or invest. Every calculator is free, accurate and works instantly — with
            clear charts and Indian rupee formatting.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          {byGroup.map(({ group, items }) => (
            <div key={group} className="mb-12 last:mb-0">
              <h2 className="mb-5 font-display text-xl text-ink">{group}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/calculators/${c.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <div>
                      <h3 className="font-display text-base text-ink group-hover:text-evergreen">{c.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}
