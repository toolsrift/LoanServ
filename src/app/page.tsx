import { Hero } from "@/components/sections/Hero";
import { StatCounters } from "@/components/sections/StatCounters";
import { LoanGrid } from "@/components/sections/LoanGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { PartnerMarquee } from "@/components/sections/PartnerMarquee";
import { Testimonials } from "@/components/sections/Testimonials";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { LatestBlog } from "@/components/sections/LatestBlog";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { Container } from "@/components/ui/primitives";

const homeFaqs = [
  {
    q: "Is LoanServ a bank or a lender?",
    a: "No. LoanServ is a DSA (Direct Selling Agent) and loan facilitator. We help you compare and apply for loans across 30+ partner banks and NBFCs, but the loan is sanctioned and disbursed by the lender. Approval and final terms are at the lender's sole discretion.",
  },
  {
    q: "Does LoanServ charge me a fee?",
    a: "No. Our service is free for borrowers. As a DSA, we are paid a commission by the lender only when your loan is successfully disbursed. You never pay LoanServ to compare offers or apply.",
  },
  {
    q: "Which cities does LoanServ serve?",
    a: "We serve Hyderabad (head office), Vijayawada, Visakhapatnam and the wider Andhra Pradesh and Telangana regions, plus Bangalore (Karnataka) and Chennai (Tamil Nadu).",
  },
  {
    q: "What documents do I need to apply?",
    a: "It varies by loan and lender, but typically KYC (identity and address proof), income proof (salary slips or bank statements/ITR), and for secured loans, property or asset papers. Your advisor gives you an exact checklist after understanding your requirement.",
  },
  {
    q: "Will checking my options affect my credit score?",
    a: "Submitting an enquiry to LoanServ does not affect your score. A hard enquiry is only recorded when a lender formally pulls your credit report for a specific application, which happens with your consent.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatCounters />
      <LoanGrid />

      <Container>
      </Container>

      <WhyUs />
      <CalculatorTeaser />
      <PartnerMarquee />
      <Testimonials />
      <ServiceArea />
      <LatestBlog />
      <FaqSection faqs={homeFaqs} title="Questions borrowers ask us" />
      <CtaBlock />
    </>
  );
}
