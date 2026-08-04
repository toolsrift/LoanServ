import { Check, TrendingDown, ShieldCheck, Landmark, ArrowRight } from "lucide-react";
import { Container, Eyebrow, Card } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock, RelatedLinks } from "@/components/sections/CtaBlock";
import { BalanceTransferCalculator } from "@/components/calculators/tools";
import { getBt } from "@/data/balance-transfer";
import type { BtContent } from "@/data/types";

export function BalanceTransferPageTemplate({ bt }: { bt: BtContent }) {
  const related = (bt.related.map(getBt).filter(Boolean) as BtContent[]).map((r) => ({
    label: r.name,
    href: `/balance-transfer/${r.slug}`,
  }));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Balance Transfer", href: "/balance-transfer" },
          { name: bt.name, href: `/balance-transfer/${bt.slug}` },
        ]}
      />

      <PageHero
        eyebrow="Balance Transfer & Top-Up"
        eyebrowIcon={TrendingDown}
        title={bt.name}
        description={bt.tagline}
        primary={
          <ApplyButton presetCategory="Personal" size="lg">
            Start my transfer <ArrowRight className="h-4 w-4" />
          </ApplyButton>
        }
        secondary={{ label: "Calculate savings", href: "#calculator" }}
        trust={[
          { icon: ShieldCheck, label: "Free for borrowers" },
          { icon: Landmark, label: "30+ lenders compared" },
        ]}
      />

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="prose-loanserv">
              {bt.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lg" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <Card className="h-fit p-6">
              <h2 className="font-display text-lg text-ink">When it saves you money</h2>
              <ul className="mt-4 space-y-2.5">
                {bt.whenItSaves.map((w, i) => (
                  <li key={i} className="flex gap-2.5 text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-evergreen" />
                    {w}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Worked example */}
      <section className="bg-muted/50 py-12">
        <Container className="max-w-3xl">
          <Eyebrow>Worked example</Eyebrow>
          <h2 className="mt-3 text-display-sm">A quick savings illustration</h2>
          <Card className="mt-6 overflow-hidden p-0">
            <dl className="divide-y divide-sand">
              {bt.example.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-3.5">
                  <dt className="text-sm text-slate">{row.label}</dt>
                  <dd className="num text-sm font-semibold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <p className="mt-3 text-xs text-muted-foreground">
            Illustrative only. Actual savings depend on your outstanding balance, remaining tenure, the new rate and any
            processing fee.
          </p>
        </Container>
      </section>

      <Container>
      </Container>

      {/* Calculator */}
      <section id="calculator" className="scroll-mt-24 pb-12">
        <Container>
          <Eyebrow>Calculate your savings</Eyebrow>
          <h2 className="mt-3 text-display-sm">Balance transfer savings calculator</h2>
          <div className="mt-8">
            <BalanceTransferCalculator />
          </div>
        </Container>
      </section>

      <FaqSection faqs={bt.faqs} title={`${bt.name} — FAQs`} />

      {related.length > 0 && (
        <section className="pb-12">
          <Container className="max-w-3xl">
            <RelatedLinks title="Related balance transfer options" links={related} />
          </Container>
        </section>
      )}

      <CtaBlock title="Stop overpaying on your existing loan" subtitle="We compare transfer offers across lenders and show you the honest, net saving — including fees." />
    </>
  );
}
