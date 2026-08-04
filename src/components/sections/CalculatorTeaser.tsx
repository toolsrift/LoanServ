import Link from "next/link";
import { Calculator, TrendingUp, PiggyBank, Receipt, ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";

const groups = [
  { icon: Calculator, title: "EMI & eligibility", desc: "Know your monthly outgo and how much you qualify for.", href: "/calculators/emi-calculator" },
  { icon: TrendingUp, title: "Balance transfer & prepayment", desc: "See exactly how much switching or prepaying saves.", href: "/calculators/balance-transfer-savings" },
  { icon: PiggyBank, title: "SIP, FD & investments", desc: "Plan the growth side of your money, not just the borrowing.", href: "/calculators/sip" },
  { icon: Receipt, title: "Tax & other tools", desc: "Income tax, HRA, GST and compound-interest calculators.", href: "/calculators/income-tax" },
];

export function CalculatorTeaser() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Free calculators</Eyebrow>
            <h2 className="mt-3 max-w-lg text-display-sm">Do the maths before you sign</h2>
          </div>
          <Link href="/calculators" className="flex shrink-0 items-center gap-1 text-sm font-medium text-evergreen hover:underline">
            All 20+ calculators <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint/15 text-[#0c6b4c]">
                <g.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base text-ink">{g.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
