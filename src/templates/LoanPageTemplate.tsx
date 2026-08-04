import type { ComponentType } from "react";
import Link from "next/link";
import { Check, FileText, ListChecks, ArrowRight, Star, ShieldCheck, Clock, Landmark } from "lucide-react";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock, RelatedLinks } from "@/components/sections/CtaBlock";
import { LoanCalcTabs } from "@/components/calculators/LoanCalcTabs";
import { getIcon } from "@/lib/icons";
import { formatINR, formatPercent } from "@/lib/format";
import { getLoan } from "@/data/loans";
import { getCalculator } from "@/data/calculators";
import type { LoanContent } from "@/data/types";

export function LoanPageTemplate({ loan }: { loan: LoanContent }) {
  const Icon = getIcon(loan.icon);
  const related = loan.related.map(getLoan).filter(Boolean) as LoanContent[];
  const calcLinks = loan.calculators
    .map((slug) => getCalculator(slug))
    .filter(Boolean)
    .map((c) => ({ label: c!.name, href: `/calculators/${c!.slug}` }));

  return (
    <>
      <Breadcrumbs items={[{ name: "Loans", href: "/loans" }, { name: loan.name, href: `/loans/${loan.slug}` }]} />

      {/* Hero — landing style */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(55rem 40rem at 90% -10%, rgba(34,197,139,0.16), transparent 60%), radial-gradient(45rem 35rem at -5% 110%, rgba(14,90,74,0.35), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          aria-hidden
        />
        <Container className="relative">
          <div className="grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.06] px-3 py-1.5 text-xs font-medium text-mint">
                <Icon className="h-4 w-4" /> {loan.shortName}
              </span>
              <h1 className="mt-5 text-display-xl text-paper">{loan.name}</h1>
              <p className="mt-4 max-w-xl text-lg text-paper/75">{loan.tagline}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {loan.benefits.slice(0, 4).map((b) => (
                  <li
                    key={b.title}
                    className="inline-flex items-center gap-1.5 rounded-full border border-paper/12 bg-paper/[0.05] px-3 py-1.5 text-sm text-paper/85"
                  >
                    <Check className="h-3.5 w-3.5 text-mint" /> {b.title}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ApplyButton presetCategory={loan.category} size="lg">
                  Apply for {loan.shortName} <ArrowRight className="h-4 w-4" />
                </ApplyButton>
                <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                  <Link href="#calculator">Calculate your EMI</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-paper/70">
                <span className="flex items-center gap-1.5">
                  <span className="flex text-saffron">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="num">4.8</span> rating
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-mint" /> Free for borrowers
                </span>
                <span className="flex items-center gap-1.5">
                  <Landmark className="h-4 w-4 text-mint" /> 30+ lenders compared
                </span>
              </div>
            </div>

            {/* Premium snapshot card */}
            <div className="animate-fade-up rounded-3xl border border-paper/12 bg-paper/[0.05] p-6 shadow-lift backdrop-blur [animation-delay:120ms] sm:p-7">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-mint">Indicative snapshot</p>
                <Badge tone="mint">Live</Badge>
              </div>
              <div className="mt-4 divide-y divide-paper/10">
                <SnapStat label="Interest rate" value={`${formatPercent(loan.rateRange.from)} – ${formatPercent(loan.rateRange.to)}`} sub="per annum" />
                <SnapStat label="Loan amount" value={`${formatINR(loan.amountRange.from)} – ${formatINR(loan.amountRange.to)}`} sub="based on eligibility" />
                <SnapStat
                  label="Tenure"
                  value={`${Math.round(loan.tenureRange.fromMonths / 12) || 1} – ${Math.round(loan.tenureRange.toMonths / 12)} yrs`}
                  sub="flexible repayment"
                />
              </div>
              <ApplyButton presetCategory={loan.category} size="lg" className="mt-6 w-full">
                Get my exact rate <ArrowRight className="h-4 w-4" />
              </ApplyButton>
              <p className="mt-3 text-center text-[11px] text-paper/50">
                Indicative &amp; varies by lender/profile. Not an offer.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-b border-sand bg-white">
        <Container>
          <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-4">
            <TrustItem icon={Landmark} title="30+ partners" desc="Banks & NBFCs" />
            <TrustItem icon={Clock} title="Quick process" desc="One application" />
            <TrustItem icon={ShieldCheck} title="No borrower fee" desc="DSA-paid model" />
            <TrustItem icon={Star} title="4.8 rating" desc="Borrower reviews" />
          </div>
        </Container>
      </section>

      {/* Intro + benefits */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="prose-loanserv">
              <Eyebrow>Overview</Eyebrow>
              {loan.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "mt-3 text-lg" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <div>
              <h2 className="font-display text-xl text-ink">Key benefits</h2>
              <ul className="mt-4 space-y-3">
                {loan.benefits.map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span>
                      <strong className="text-ink">{b.title}.</strong>{" "}
                      <span className="text-slate">{b.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Container>
      </Container>

      {/* Eligibility + documents */}
      <section className="bg-muted/50 py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-evergreen">
                <ListChecks className="h-5 w-5" />
                <h2 className="font-display text-xl text-ink">Eligibility criteria</h2>
              </div>
              <ul className="space-y-2.5">
                {loan.eligibility.map((e, i) => (
                  <li key={i} className="flex gap-2.5 text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-evergreen" />
                    {e}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-evergreen">
                <FileText className="h-5 w-5" />
                <h2 className="font-display text-xl text-ink">Documents required</h2>
              </div>
              <ul className="space-y-2.5">
                {loan.documents.map((d, i) => (
                  <li key={i} className="flex gap-2.5 text-slate">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-evergreen" />
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-12 sm:py-16">
        <Container>
          <Eyebrow>Compare lenders</Eyebrow>
          <h2 className="mt-3 text-display-sm">Indicative {loan.shortName} rates</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Illustrative rates and fees from popular lenders. Actual offers depend on your profile — we help you find
            the best fit.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-sand">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-sand bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Lender</th>
                  <th className="px-4 py-3 font-medium">Interest rate (p.a.)</th>
                  <th className="px-4 py-3 font-medium">Processing fee</th>
                  <th className="px-4 py-3 font-medium">Max tenure</th>
                  <th className="px-4 py-3 font-medium">Notable for</th>
                </tr>
              </thead>
              <tbody>
                {loan.comparison.map((row) => (
                  <tr key={row.lender} className="border-b border-sand/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{row.lender}</td>
                    <td className="num px-4 py-3 text-slate">{row.rate}</td>
                    <td className="num px-4 py-3 text-slate">{row.processingFee}</td>
                    <td className="num px-4 py-3 text-slate">{row.maxTenure}</td>
                    <td className="px-4 py-3 text-slate">{row.highlight || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <Badge tone="sand">Indicative</Badge> Rates last reviewed for general guidance and subject to change by
            lenders. Not an offer.
          </p>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-ink py-12 text-paper sm:py-16">
        <Container>
          <Eyebrow className="text-mint">How it works</Eyebrow>
          <h2 className="mt-3 font-display text-display-sm text-paper">Getting your {loan.shortName} in {loan.process.length} steps</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loan.process.map((step, i) => (
              <li key={i} className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-5">
                <span className="num text-2xl font-semibold text-mint">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-base text-paper">{step.title}</h3>
                <p className="mt-1 text-sm text-paper/70">{step.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Embedded calculator */}
      <section id="calculator" className="scroll-mt-24 py-12 sm:py-16">
        <Container>
          <Eyebrow>Plan your loan</Eyebrow>
          <h2 className="mt-3 text-display-sm">{loan.shortName} EMI &amp; eligibility calculators</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Estimate your monthly EMI, then switch tabs to check how much you may be eligible to borrow.
          </p>
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
                tenure: {
                  min: Math.max(6, loan.tenureRange.fromMonths),
                  max: loan.tenureRange.toMonths,
                  step: 6,
                  default: Math.min(loan.tenureRange.toMonths, 60),
                  unit: "months",
                },
              }}
            />
          </div>
        </Container>
      </section>

      <FaqSection faqs={loan.faqs} title={`${loan.name} — FAQs`} />

      {/* Related links */}
      <section className="pb-12">
        <Container>
          <div className="grid gap-4 lg:grid-cols-2">
            {calcLinks.length > 0 && <RelatedLinks title="Related calculators" links={calcLinks} />}
            {related.length > 0 && (
              <RelatedLinks
                title="Related loans"
                links={related.map((r) => ({ label: r.name, href: `/loans/${r.slug}` }))}
              />
            )}
          </div>
        </Container>
      </section>

      <CtaBlock presetCategory={loan.category} title={`Apply for a ${loan.name} today`} />
    </>
  );
}

function SnapStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <dt className="text-sm text-paper/70">{label}</dt>
        <p className="text-[11px] text-paper/40">{sub}</p>
      </div>
      <dd className="num text-right text-base font-semibold text-paper">{value}</dd>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="num text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
