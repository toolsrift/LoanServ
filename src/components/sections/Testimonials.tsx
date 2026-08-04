"use client";

import * as React from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";

const testimonials = [
  {
    name: "Sridhar Reddy",
    role: "Software engineer, Gachibowli",
    quote:
      "LoanServ compared offers from four banks and got me a personal loan at almost 2% lower than my own bank quoted. The advisor picked up documents from my office.",
    loan: "Personal Loan · Hyderabad",
  },
  {
    name: "Meena Krishnan",
    role: "Boutique owner, Chennai",
    quote:
      "I needed working capital before the festive season. They understood my turnover-based eligibility and arranged a business loan within a week.",
    loan: "Business Loan · Chennai",
  },
  {
    name: "Dr. Anil Kumar",
    role: "Dentist, Vijayawada",
    quote:
      "As a self-employed professional I was worried about paperwork. LoanServ handled the doctor-loan process end to end and kept me updated at every stage.",
    loan: "Doctor Loan · Vijayawada",
  },
  {
    name: "Rahul & Divya",
    role: "First-home buyers, Bangalore",
    quote:
      "The home-loan balance transfer saved us over ₹6 lakh in interest across the tenure. They ran the numbers honestly, including the processing fee.",
    loan: "Home Loan BT · Bangalore",
  },
];

export function Testimonials() {
  const [i, setI] = React.useState(0);
  const t = testimonials[i];
  const next = () => setI((v) => (v + 1) % testimonials.length);
  const prev = () => setI((v) => (v - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <div className="mb-8 text-center">
          <Eyebrow>What borrowers say</Eyebrow>
          <h2 className="mt-3 text-display-sm">Real results, honestly earned</h2>
        </div>
        <div className="relative rounded-3xl border border-sand bg-white p-8 shadow-soft sm:p-10">
          <Quote className="absolute right-8 top-8 h-10 w-10 text-sand" />
          <div className="mb-4 flex gap-1 text-saffron">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <blockquote className="font-display text-xl leading-relaxed text-ink sm:text-2xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
              <p className="num mt-1 text-xs font-medium text-evergreen">{t.loan}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="grid h-10 w-10 place-items-center rounded-full border border-sand text-slate hover:border-evergreen hover:text-evergreen"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="grid h-10 w-10 place-items-center rounded-full border border-sand text-slate hover:border-evergreen hover:text-evergreen"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Representative experiences. Individual outcomes depend on lender approval and profile.
        </p>
      </Container>
    </section>
  );
}
