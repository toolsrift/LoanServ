import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { siteFaqs } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions — Loans, Fees & Process",
  description:
    "Answers about how LoanServ works as a loan DSA — our fees, which lenders and cities we cover, documents needed, disbursal time, credit-score impact, data privacy and more.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />

      <section className="bg-paper py-14 sm:py-16">
        <Container className="max-w-3xl">
          <Eyebrow>Help centre</Eyebrow>
          <h1 className="mt-3 text-display-lg text-ink">Frequently asked questions</h1>
          <p className="mt-4 text-lg text-slate">
            Everything borrowers usually ask us — what a DSA is, whether we charge a fee, which
            lenders and cities we cover, how long disbursal takes, and how we handle your data.
          </p>
        </Container>
      </section>

      <FaqSection faqs={siteFaqs} bare={false} title="Your questions, answered" />

      <CtaBlock
        title="Still have a question?"
        subtitle="Send your requirement and a local advisor will call you back — free, with no obligation."
      />
    </>
  );
}
