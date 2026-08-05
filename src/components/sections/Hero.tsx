import Link from "next/link";
import { Sparkles, ShieldCheck, MapPin, Star, CheckCircle2, TrendingDown } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { HeroCalculator } from "@/components/calculators/HeroCalculator";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* layered modern backdrop: gradient mesh + dotted grid + ascending line */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 85% -10%, rgba(34,197,139,0.12), transparent 60%), radial-gradient(50rem 40rem at 0% 110%, rgba(14,90,74,0.10), transparent 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage: "radial-gradient(var(--sand) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <Container className="relative">
        <div className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-evergreen shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-saffron" />
                30+ bank &amp; NBFC partners
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-slate shadow-sm">
                <span className="flex text-saffron">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="num">4.8</span> borrower rating
              </span>
            </div>

            <h1 className="mt-6 text-display-xl text-ink">
              See your EMI first.
              <br />
              Then apply with{" "}
              <span className="relative whitespace-nowrap text-evergreen">
                clarity
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path d="M2 8 Q 50 2 100 6 T 198 4" fill="none" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-6 max-w-lg text-lg text-slate">
              LoanServ helps you compare and apply for personal, business, home and more — across India&apos;s top
              lenders. Real numbers, no jargon, and a local advisor from Hyderabad to Chennai.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ApplyButton size="lg">Apply for Loan</ApplyButton>
              <Button asChild variant="outline" size="lg">
                <Link href="/free-cibil-score">Check free CIBIL score</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-mint" /> Free for borrowers
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-mint" /> No impact to check
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-mint" /> AP · Telangana · Bangalore · Chennai
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            {/* floating accent pills for depth (desktop only) */}
            <div className="absolute -left-4 -top-8 z-10 hidden animate-fade-up items-center gap-2 rounded-2xl border border-sand bg-white px-3.5 py-2 shadow-lift [animation-delay:360ms] lg:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint/15 text-mint">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="num text-sm font-semibold text-ink">₹5,00,000</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">approved</p>
              </div>
            </div>
            <div className="absolute -right-3 -bottom-8 z-10 hidden animate-fade-up items-center gap-2 rounded-2xl border border-sand bg-white px-3.5 py-2 shadow-lift [animation-delay:480ms] lg:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron/15 text-[#8a5a04]">
                <TrendingDown className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="num text-sm font-semibold text-ink">2.1% lower</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">vs own bank</p>
              </div>
            </div>

            <HeroCalculator />
          </div>
        </div>
      </Container>
    </section>
  );
}
