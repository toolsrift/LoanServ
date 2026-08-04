import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, ArrowRight, MapPin } from "lucide-react";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { LoanCalcTabs } from "@/components/calculators/LoanCalcTabs";
import { getIcon } from "@/lib/icons";
import { formatINR, formatPercent } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { loanCityParams, getLoanCity } from "@/lib/loan-city";

export const dynamicParams = true;

export function generateStaticParams() {
  return loanCityParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ loanType: string; city: string }>;
}): Promise<Metadata> {
  const { loanType, city } = await params;
  const data = getLoanCity(loanType, city);
  if (!data) return {};
  return buildMetadata({ title: data.metaTitle, description: data.metaDescription, path: `/${loanType}/${city}` });
}

export default async function LoanCityPage({
  params,
}: {
  params: Promise<{ loanType: string; city: string }>;
}) {
  const { loanType, city } = await params;
  const data = getLoanCity(loanType, city);
  if (!data) notFound();
  const { loan, city: cityData, title, intro } = data;
  const Icon = getIcon(loan.icon);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Locations", href: "/locations" },
          { name: `Loans in ${cityData.city}`, href: `/locations/${cityData.slug}` },
          { name: loan.shortName, href: `/${loanType}/${city}` },
        ]}
      />

      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-xl bg-evergreen/10 px-3 py-1.5 text-sm font-medium text-evergreen">
                <MapPin className="h-4 w-4" /> {cityData.city} · {cityData.state}
              </span>
              <h1 className="text-display-lg text-ink">{title}</h1>
              <p className="mt-4 max-w-xl text-lg text-slate">
                Compare and apply for a {loan.shortName.toLowerCase()} in {cityData.city} with a local LoanServ advisor.
              </p>
              <div className="mt-6">
                <ApplyButton presetCategory={loan.category} size="lg">
                  Apply in {cityData.city} <ArrowRight className="h-4 w-4" />
                </ApplyButton>
              </div>
            </div>
            <Card className="p-6">
              <div className="mb-3 flex items-center gap-2 text-evergreen">
                <Icon className="h-5 w-5" />
                <p className="font-display text-lg text-ink">{loan.name}</p>
              </div>
              <dl className="space-y-3">
                <SnapRow label="Indicative rate" value={`${formatPercent(loan.rateRange.from)} – ${formatPercent(loan.rateRange.to)} p.a.`} />
                <SnapRow label="Loan amount" value={`${formatINR(loan.amountRange.from)} – ${formatINR(loan.amountRange.to)}`} />
                <SnapRow label="Serving" value={cityData.areas.slice(0, 3).join(", ")} />
              </dl>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="max-w-3xl">
          <div className="prose-loanserv">
            {intro.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg" : ""}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {cityData.areas.map((a) => (
              <Badge key={a} tone="sand">
                {a}
              </Badge>
            ))}
          </div>
        </Container>
      </section>

      <Container>
      </Container>

      {/* Benefits + eligibility recap */}
      <section className="bg-muted/50 py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-xl text-ink">Why {cityData.city} borrowers choose us</h2>
              <ul className="mt-4 space-y-2.5">
                {loan.benefits.slice(0, 4).map((b) => (
                  <li key={b.title} className="flex gap-2.5 text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-evergreen" />
                    <span>
                      <strong className="text-ink">{b.title}.</strong> {b.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-xl text-ink">Who can apply in {cityData.city}</h2>
              <ul className="mt-4 space-y-2.5">
                {loan.eligibility.slice(0, 5).map((e, i) => (
                  <li key={i} className="flex gap-2.5 text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-evergreen" />
                    {e}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Eyebrow>Plan your loan</Eyebrow>
          <h2 className="mt-3 text-display-sm">{loan.shortName} EMI &amp; eligibility in {cityData.city}</h2>
          <div className="mt-8">
            <LoanCalcTabs
              config={{
                presetCategory: loan.category,
                rate: { min: loan.rateRange.from, max: loan.rateRange.to, step: 0.1, default: loan.rateRange.from + 1, label: "Interest rate (% p.a.)" },
                amount: {
                  min: loan.amountRange.from,
                  max: loan.amountRange.to,
                  step: Math.max(10000, Math.round(loan.amountRange.to / 200 / 10000) * 10000),
                  default: Math.min(loan.amountRange.to, Math.max(loan.amountRange.from, 1000000)),
                },
                tenure: { min: Math.max(6, loan.tenureRange.fromMonths), max: loan.tenureRange.toMonths, step: 6, default: Math.min(loan.tenureRange.toMonths, 60), unit: "months" },
              }}
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            See the full{" "}
            <Link href={`/loans/${loan.slug}`} className="text-evergreen underline">
              {loan.name} guide
            </Link>{" "}
            or explore{" "}
            <Link href={`/locations/${cityData.slug}`} className="text-evergreen underline">
              all loans in {cityData.city}
            </Link>
            .
          </p>
        </Container>
      </section>

      <FaqSection faqs={loan.faqs} title={`${loan.shortName} in ${cityData.city} — FAQs`} />
      <CtaBlock presetCategory={loan.category} title={`Apply for a ${loan.name} in ${cityData.city}`} />
    </>
  );
}

function SnapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-sand/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="num text-right text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
