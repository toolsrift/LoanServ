import Link from "next/link";
import { Zap, ShieldCheck, LineChart } from "lucide-react";
import { Container, Card } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock, RelatedLinks } from "@/components/sections/CtaBlock";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import {
  EligibilityCalculator,
  BalanceTransferCalculator,
  PrepaymentCalculator,
  InvestmentCalculator,
  IncomeTaxCalculator,
  HraCalculator,
  GstCalculator,
  RetirementCalculator,
} from "@/components/calculators/tools";
import { getCalculator } from "@/data/calculators";
import type { CalculatorMeta } from "@/data/types";

function CalculatorWidget({ meta }: { meta: CalculatorMeta }) {
  switch (meta.kind) {
    case "emi":
    case "lap":
      return <EmiCalculator config={{ presetCategory: meta.presetCategory, ...meta.defaults }} />;
    case "eligibility":
      return <EligibilityCalculator presetCategory={meta.presetCategory} />;
    case "balance-transfer":
      return <BalanceTransferCalculator />;
    case "prepayment":
      return <PrepaymentCalculator />;
    case "income-tax":
      return <IncomeTaxCalculator />;
    case "hra":
      return <HraCalculator />;
    case "gst":
      return <GstCalculator />;
    case "retirement":
      return <RetirementCalculator />;
    case "sip":
    case "lumpsum":
    case "fd":
    case "rd":
    case "ppf":
    case "compound-interest":
      return <InvestmentCalculator kind={meta.kind} />;
    default:
      return <EmiCalculator config={{ presetCategory: meta.presetCategory }} />;
  }
}

export function CalculatorPageTemplate({ meta }: { meta: CalculatorMeta }) {
  const related = meta.related
    .map((slug) => getCalculator(slug))
    .filter(Boolean)
    .map((c) => ({ label: c!.name, href: `/calculators/${c!.slug}` }));

  return (
    <>
      <Breadcrumbs
        items={[{ name: "Calculators", href: "/calculators" }, { name: meta.name, href: `/calculators/${meta.slug}` }]}
      />

      <PageHero
        eyebrow={meta.group}
        eyebrowIcon={LineChart}
        title={meta.name}
        description={meta.tagline}
        trust={[
          { icon: Zap, label: "Instant results" },
          { icon: ShieldCheck, label: "Free · no sign-up" },
          { icon: LineChart, label: "Charts & breakdown" },
        ]}
      />

      <section className="pb-10">
        <Container>
          <CalculatorWidget meta={meta} />
        </Container>
      </section>

      <Container>
      </Container>

      {/* Explainer */}
      <section className="pb-6">
        <Container className="max-w-3xl">
          <div className="prose-loanserv">
            <h2>About the {meta.name}</h2>
            {meta.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {meta.notes && meta.notes.length > 0 && (
              <>
                <h3>How to use it</h3>
                <ul>
                  {meta.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Container>
      </section>

      <FaqSection faqs={meta.faqs} title={`${meta.name} — FAQs`} />

      <section className="pb-12">
        <Container className="max-w-3xl">
          {related.length > 0 ? (
            <RelatedLinks title="Related calculators" links={related} />
          ) : (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                Explore all our{" "}
                <Link href="/calculators" className="text-evergreen underline">
                  free financial calculators
                </Link>
                .
              </p>
            </Card>
          )}
        </Container>
      </section>

      <CtaBlock presetCategory={meta.presetCategory} />
    </>
  );
}
