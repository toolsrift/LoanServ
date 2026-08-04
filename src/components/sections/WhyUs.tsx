import { Scale, Clock, ShieldCheck, Users, IndianRupee, Headphones } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";

const reasons = [
  {
    icon: Scale,
    title: "Compare, don't settle",
    desc: "We put offers from 30+ banks & NBFCs side by side so you see the real cost — not just the first quote.",
  },
  {
    icon: IndianRupee,
    title: "No fee to you",
    desc: "Our service is free for borrowers. We're paid by lenders as a DSA only when your loan is disbursed.",
  },
  {
    icon: Clock,
    title: "Fast, guided process",
    desc: "One application, one point of contact. We chase paperwork and follow up with the bank so you don't have to.",
  },
  {
    icon: ShieldCheck,
    title: "Honest, indicative numbers",
    desc: "Every rate and fee is clearly marked indicative. We show you the maths, including processing fees.",
  },
  {
    icon: Users,
    title: "Local advisors",
    desc: "On-ground support in Hyderabad, Vijayawada, Vizag, Bangalore and Chennai — including doorstep pickup.",
  },
  {
    icon: Headphones,
    title: "Support after sanction",
    desc: "From sanction letter to disbursement and future top-ups, your advisor stays with you.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <Container>
        <div className="mb-10 max-w-xl">
          <Eyebrow>Why LoanServ</Eyebrow>
          <h2 className="mt-3 text-display-sm">A DSA that works for the borrower</h2>
          <p className="mt-3 text-muted-foreground">
            We&apos;re not a lender. That means we can shop the whole market for you and stay on your side of the table.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex h-full gap-4 rounded-2xl border border-sand bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-saffron/15 text-[#8a5a04]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base text-ink">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
