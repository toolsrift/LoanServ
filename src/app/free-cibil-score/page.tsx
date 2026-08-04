import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Gauge, FileText, RefreshCw, Eye } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card } from "@/components/ui/primitives";
import { CibilForm } from "@/components/cibil/CibilForm";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free CIBIL / Credit Score Check — Know Your Score",
  description:
    "Check your CIBIL / credit score for free with LoanServ. Understand the 300–900 range, what affects your score, and how to improve it before you apply for a loan.",
  path: "/free-cibil-score",
});

const bands = [
  { range: "800–900", label: "Excellent", color: "#22C58B", note: "Best rates & fastest approvals" },
  { range: "750–799", label: "Very good", color: "#0E5A4A", note: "Strong approval odds" },
  { range: "700–749", label: "Good", color: "#F6A623", note: "Approvable at standard rates" },
  { range: "650–699", label: "Fair", color: "#E08a1e", note: "May face higher rates" },
  { range: "300–649", label: "Needs work", color: "#c0562b", note: "Build before applying" },
];

const factors = [
  { icon: RefreshCw, title: "Repayment history (~35%)", desc: "Paying every EMI and credit-card bill on time is the single biggest driver." },
  { icon: Gauge, title: "Credit utilisation (~30%)", desc: "Using a large share of your card limit hurts. Keep utilisation below ~30%." },
  { icon: FileText, title: "Credit age & mix (~20%)", desc: "A longer history and a healthy mix of secured and unsecured credit helps." },
  { icon: Eye, title: "Enquiries & new credit (~15%)", desc: "Many hard enquiries in a short span signal risk. Space out applications." },
];

const steps = [
  { title: "Enter your details", desc: "Name, mobile, email, PAN and date of birth — with your consent for a soft check." },
  { title: "We verify securely", desc: "Your data is transmitted over HTTPS. A soft enquiry never affects your score." },
  { title: "Get your score & guidance", desc: "See where you stand on the 300–900 scale and how to improve before applying." },
];

const faqs = [
  {
    q: "Is checking my CIBIL score here really free?",
    a: "Yes. Checking your own score through LoanServ is free and is treated as a soft enquiry, which does not affect your credit score. You can check as often as you like.",
  },
  {
    q: "Will checking my score reduce it?",
    a: "No. A soft enquiry — when you check your own score — has zero impact. Only a hard enquiry, when a lender pulls your report for a specific loan or card application, can cause a small temporary dip.",
  },
  {
    q: "What is a good CIBIL score in India?",
    a: "CIBIL scores range from 300 to 900. A score of 750 and above is generally considered good and unlocks the best interest rates and quickest approvals. Below 650, you may face higher rates or rejections.",
  },
  {
    q: "How often is my score updated?",
    a: "Bureaus typically refresh scores every 30–45 days as lenders report your repayment activity. Checking monthly is a healthy habit and helps you catch errors early.",
  },
  {
    q: "Why do you ask for my PAN and date of birth?",
    a: "Your PAN and date of birth are how credit bureaus uniquely identify you. We treat them as sensitive information, transmit them only over HTTPS, and do not store them unnecessarily. See our Data & Privacy Policy.",
  },
  {
    q: "What's the difference between a credit score and a credit report?",
    a: "Your credit score is a single three-digit number (300–900) summarising your creditworthiness. Your credit report is the detailed underlying document — every loan, card, payment and enquiry. Lenders look at both.",
  },
];

export default function FreeCibilPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Free CIBIL Score", href: "/free-cibil-score" }]} />

      {/* Hero + form */}
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-evergreen">
                <ShieldCheck className="h-3.5 w-3.5 text-mint" /> Free · Soft check · No score impact
              </span>
              <h1 className="mt-5 text-display-lg text-ink">Check your CIBIL / credit score for free</h1>
              <p className="mt-4 max-w-lg text-lg text-slate">
                Know your number before you apply. A healthy score means better rates and faster approvals — and if it
                needs work, we&apos;ll show you exactly how to improve it.
              </p>
              <ul className="mt-6 space-y-3">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-evergreen/10 text-sm font-semibold text-evergreen">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="text-ink">{s.title}.</strong>{" "}
                      <span className="text-slate">{s.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-xl text-ink">Get your score</h2>
              <p className="mt-1 text-sm text-muted-foreground">Takes under a minute.</p>
              <div className="mt-5">
                <CibilForm />
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Score bands */}
      <section className="py-14">
        <Container>
          <Eyebrow>The 300–900 scale</Eyebrow>
          <h2 className="mt-3 text-display-sm">What your score means</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {bands.map((b) => (
              <Card key={b.range} className="p-5">
                <span className="num text-lg font-semibold" style={{ color: b.color }}>
                  {b.range}
                </span>
                <p className="mt-1 font-display text-base text-ink">{b.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.note}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Factors */}
      <section className="bg-muted/50 py-14">
        <Container>
          <Eyebrow>What moves your score</Eyebrow>
          <h2 className="mt-3 text-display-sm">The factors that affect your CIBIL score</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {factors.map((f) => (
              <Card key={f.title} className="flex gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SEO content cluster */}
      <section className="py-14">
        <Container className="max-w-3xl">
          <div className="prose-loanserv">
            <h2>What is a CIBIL score?</h2>
            <p>
              A CIBIL score is a three-digit number between 300 and 900 that summarises how reliably you have repaid
              borrowed money in the past. It is calculated by TransUnion CIBIL — one of India&apos;s four RBI-licensed
              credit bureaus, alongside Experian, Equifax and CRIF High Mark — using the repayment data that banks and
              NBFCs report every month. The higher your score, the lower the perceived risk, and the better the loan
              terms you can command.
            </p>
            <h2>Why lenders check your score</h2>
            <p>
              When you apply for a loan or credit card, the lender pulls your credit report and score to decide whether
              to approve you, how much to offer, and at what interest rate. A score of 750+ typically means quick
              approval at the best rates. A lower score doesn&apos;t always mean rejection, but it usually means a higher
              rate, a lower limit, or a request for additional documents or a co-applicant.
            </p>
            <h2>How to improve your credit score</h2>
            <p>
              Improving your score is a matter of consistent habits over a few months: pay every EMI and card bill on or
              before the due date, keep your credit-card utilisation below about 30% of your limit, avoid applying for
              multiple loans in a short window, hold on to older credit cards to lengthen your credit history, and
              review your report regularly to dispute any errors. Read our detailed guide on{" "}
              <Link href="/blog/how-to-improve-cibil-score">how to improve your CIBIL score</Link>.
            </p>
            <h2>How often should you check it?</h2>
            <p>
              Checking your own score is a soft enquiry and has no impact, so a monthly check is perfectly safe and
              genuinely useful. Regular checks help you track progress, spot identity theft or reporting errors early,
              and time your loan application for when your score is strongest. Once you know your number, use our{" "}
              <Link href="/calculators/loan-eligibility">loan eligibility calculator</Link> to estimate how much you could
              borrow.
            </p>
            <h2>Credit report vs credit score</h2>
            <p>
              Think of the score as the headline and the report as the full story. The report lists every active and
              closed loan, each credit card, your payment track record, outstanding balances, and every enquiry made
              against your name. When you apply through LoanServ, understanding both helps us match you to the lenders
              most likely to approve you — improving your odds and protecting your score from unnecessary hard enquiries.
            </p>
          </div>
        </Container>
      </section>

      <FaqSection faqs={faqs} title="Credit score FAQs" />
      <CtaBlock title="Know your score, then find your loan" subtitle="Once you know where you stand, we'll match you to lenders that fit your profile — improving approval odds." />
    </>
  );
}
