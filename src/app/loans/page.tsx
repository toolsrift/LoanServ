import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { LoanGrid } from "@/components/sections/LoanGrid";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Loan Types — Compare & Apply Across 30+ Lenders",
  description:
    "Explore every loan LoanServ helps you compare — personal, business, home, LAP, car, education, doctor, CA and more. Indicative rates, eligibility and instant EMI maths.",
  path: "/loans",
});

export default function LoansHubPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Loans", href: "/loans" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>All loan types</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Find the right loan, then apply with clarity</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            We facilitate every major secured and unsecured loan across India&apos;s top banks and NBFCs. Pick a
            category to see indicative rates, eligibility, documents and a live EMI calculator.
          </p>
        </Container>
      </section>
      <LoanGrid title="Browse all loans" subtitle="Every category we help you compare and apply for." />
      <CtaBlock />
    </>
  );
}
