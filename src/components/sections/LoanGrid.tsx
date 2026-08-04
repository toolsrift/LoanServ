import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/Reveal";
import { getIcon } from "@/lib/icons";
import { loans } from "@/data/loans";
import { formatPercent } from "@/lib/format";

export function LoanGrid({
  limit,
  title = "A loan for every need",
  eyebrow = "Loan types",
  subtitle = "From a quick personal loan to a ₹5-crore property loan — compare options across 30+ lenders.",
}: {
  limit?: number;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
}) {
  const list = limit ? loans.slice(0, limit) : loans;
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 max-w-lg text-display-sm">{title}</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((loan, i) => {
            const Icon = getIcon(loan.icon);
            return (
              <Reveal key={loan.slug} delay={Math.min(i * 0.04, 0.3)}>
                <Link
                  href={`/loans/${loan.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
                  </div>
                  <h3 className="font-display text-lg text-ink">{loan.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{loan.tagline}</p>
                  <p className="num mt-3 text-xs font-medium text-evergreen">
                    From {formatPercent(loan.rateRange.from)} p.a. · indicative
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
