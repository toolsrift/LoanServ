import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import type { Faq } from "@/data/types";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions — Loans, Fees & Process",
  description:
    "Answers about how LoanServ works as a loan DSA — our fees, which lenders and cities we cover, documents needed, disbursal time, credit-score impact, data privacy and more.",
  path: "/faq",
});

const faqs: Faq[] = [
  {
    q: "What exactly is a loan DSA, and how is LoanServ different from a bank?",
    a: "A DSA (Direct Selling Agent) is an authorised channel partner for banks and NBFCs. LoanServ is a DSA facilitator, not a lender — we help you compare offers, prepare a clean application and submit it to the right partner. The bank or NBFC alone decides whether to approve your loan and on what terms. We are with you through the process, but we never lend money ourselves or set interest rates.",
  },
  {
    q: "Does LoanServ charge me any fee for its service?",
    a: "No. Our service is free for borrowers. Banks and NBFCs pay a sourcing commission to their DSA partners, so we are paid by the lender — not by you. You pay only the lender's own charges, such as the processing fee, exactly as you would if you approached the branch directly. If anyone asks you to pay LoanServ an upfront fee to 'guarantee' approval, treat it as a red flag.",
  },
  {
    q: "Which banks and NBFCs can I apply to through LoanServ?",
    a: "We have direct tie-ups with 30+ banks, NBFCs and small finance banks — including names like HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Bajaj Finserv, Tata Capital, Aditya Birla Finance and more. Based on your income, city and profile, we route your application to the lenders most likely to approve it at a competitive rate.",
  },
  {
    q: "Which cities and regions do you serve?",
    a: "We serve Andhra Pradesh, Telangana, Bangalore (Karnataka) and Chennai (Tamil Nadu), with our office in Nizampet, Hyderabad. We regularly help borrowers in Hyderabad, Vijayawada, Visakhapatnam, Bangalore and Chennai. If you are elsewhere in these states, get in touch — many of our lender partners operate nationally.",
  },
  {
    q: "What types of loans can I get help with?",
    a: "We facilitate personal loans, business loans, home loans, loan against property (LAP), car loans, gold loans, and professional loans for doctors, CAs and other professionals. We also help with balance transfers and top-up loans. Tell us your requirement and we will point you to the right category and lender.",
  },
  {
    q: "What documents will I typically need?",
    a: "For most loans, lenders ask for identity and address proof (Aadhaar/PAN/passport/voter ID), recent salary slips or bank statements, and — for the self-employed — business proof, GST returns or ITRs. Home and property loans additionally need property papers. The exact list depends on the lender and loan type; we will share a precise checklist once we know your profile. Note that you do not submit these on our website form.",
  },
  {
    q: "How long does it take to get a loan disbursed?",
    a: "It varies by loan type and lender. Pre-approved and small personal loans can disburse within 24–72 hours once documents are verified. Business loans and LAP usually take a few working days to a couple of weeks, and home loans longer because of legal and technical property checks. We work to keep your file moving and set realistic expectations up front.",
  },
  {
    q: "Will applying through LoanServ hurt my credit score?",
    a: "Applying to many lenders at once triggers multiple hard inquiries, which can dent your score. Because we match your profile to the lenders most likely to approve you, we help you avoid scattershot applications. A single, well-targeted application typically has minimal impact — and getting approved and repaying on time is good for your score over the long run.",
  },
  {
    q: "What is a balance transfer, and when does it make sense?",
    a: "A balance transfer moves your existing loan to a new lender offering a lower interest rate or better terms, often with a top-up. It usually makes sense when there is a meaningful rate difference and enough tenure remaining to recover any switching costs (processing and foreclosure fees). We can run the maths with you before you decide.",
  },
  {
    q: "Can you check my CIBIL / credit score, and does checking it lower my score?",
    a: "You can check your own credit score as often as you like — this is a 'soft' inquiry and does not affect your score. Only a lender's 'hard' inquiry when you formally apply can have a small effect. We can guide you to check your score for free and, if it needs improvement, suggest practical steps before you apply.",
  },
  {
    q: "What are the common reasons loan applications get rejected?",
    a: "Frequent reasons include a low credit score, a high existing EMI-to-income (FOIR) ratio, unstable or unverifiable income, incomplete documentation, a recent flurry of loan inquiries, or a mismatch with a specific lender's eligibility grid. Part of our job is to spot these issues in advance and either fix them or steer you to a lender whose criteria you actually meet.",
  },
  {
    q: "How is my personal data handled and protected?",
    a: "We collect only what is needed to understand your requirement and connect you with the right lender, and we use it solely to contact you and process your enquiry. We do not sell your data. Once you choose to proceed, your KYC and financial documents are shared directly with the chosen bank or NBFC for their underwriting. Please review our Privacy Policy for full details.",
  },
  {
    q: "Do I have to share Aadhaar, PAN or bank details to enquire?",
    a: "No. Our website enquiry form never asks for Aadhaar, PAN or bank-account details. We only need your name, contact number, city and a rough idea of your requirement to start. Sensitive KYC documents are collected later, and only by the lender you choose to proceed with, as part of their formal process.",
  },
  {
    q: "Am I obligated to take a loan after applying through LoanServ?",
    a: "Not at all. Submitting an enquiry or even receiving offers puts you under no obligation. You are free to compare, ask questions, take your time, or walk away. We would rather you make an informed decision than rush into a loan that doesn't fit.",
  },
  {
    q: "Can self-employed people and small business owners apply?",
    a: "Yes. We work with many lenders that lend to the self-employed, professionals and small businesses — including business loans, loan against property and professional loans for doctors and CAs. Eligibility usually looks at your business vintage, turnover, bank statements and ITRs. We help you present these in the strongest possible light.",
  },
  {
    q: "How do I get started with LoanServ?",
    a: "Send us your requirement using the Apply form, email us at contact@loanserv.in, or message us on WhatsApp. A local advisor will review your profile and call you back to discuss suitable lenders and next steps. There is no fee to talk to us and no obligation to proceed.",
  },
];

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

      <FaqSection faqs={faqs} bare={false} title="Your questions, answered" />

      <CtaBlock
        title="Still have a question?"
        subtitle="Send your requirement and a local advisor will call you back — free, with no obligation."
      />
    </>
  );
}
