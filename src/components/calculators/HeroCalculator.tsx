"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { useCountUp } from "./useCountUp";
import { calculateEmi } from "@/lib/emi";
import { formatINR, formatINRCompact } from "@/lib/format";

/**
 * The signature element: a live EMI mini-calculator. Drag loan amount, interest
 * rate and tenure and watch the monthly EMI animate in real time, with a
 * principal-vs-interest bar. "Instant clarity, real numbers, no forms."
 */
export function HeroCalculator() {
  const [amount, setAmount] = React.useState(1000000);
  const [rate, setRate] = React.useState(11.5);
  const [tenure, setTenure] = React.useState(36);

  const { emi, totalInterest, principal, totalPayable } = React.useMemo(
    () => calculateEmi(amount, rate, tenure),
    [amount, rate, tenure],
  );

  const emiDisplay = useCountUp(emi);
  const interestDisplay = useCountUp(totalInterest);
  const principalPct = totalPayable > 0 ? (principal / totalPayable) * 100 : 0;

  return (
    <div className="rounded-3xl border border-sand bg-white/90 p-6 shadow-lift backdrop-blur sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-evergreen">Your monthly EMI</p>
          <p className="num mt-1 text-4xl font-semibold text-ink sm:text-5xl">{formatINR(emiDisplay)}</p>
        </div>
        <span className="num rounded-full bg-mint/15 px-3 py-1 text-sm font-medium text-[#0c6b4c]">
          @ {rate.toFixed(1)}% p.a.
        </span>
      </div>

      {/* Principal vs interest bar */}
      <div className="mb-1 flex h-3 overflow-hidden rounded-full bg-sand" aria-hidden>
        <div className="h-full bg-evergreen transition-all duration-500" style={{ width: `${principalPct}%` }} />
        <div className="h-full bg-saffron transition-all duration-500" style={{ width: `${100 - principalPct}%` }} />
      </div>
      <div className="mb-6 flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-evergreen" /> Principal {formatINRCompact(principal)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-saffron" /> Interest{" "}
          <span className="num">{formatINR(interestDisplay)}</span>
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label className="text-sm font-medium text-slate">Loan amount</label>
            <span className="num text-sm font-semibold text-ink">{formatINR(amount)}</span>
          </div>
          <Slider
            value={[amount]}
            min={50000}
            max={10000000}
            step={50000}
            onValueChange={(v) => setAmount(v[0])}
            aria-label="Loan amount"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground num">
            <span>₹50K</span>
            <span>₹1Cr</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label className="text-sm font-medium text-slate">Interest rate</label>
            <span className="num text-sm font-semibold text-ink">{rate.toFixed(1)}% p.a.</span>
          </div>
          <Slider
            value={[rate]}
            min={8}
            max={24}
            step={0.1}
            onValueChange={(v) => setRate(v[0])}
            aria-label="Interest rate"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground num">
            <span>8%</span>
            <span>24%</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label className="text-sm font-medium text-slate">Tenure</label>
            <span className="num text-sm font-semibold text-ink">
              {tenure} months · {(tenure / 12).toFixed(tenure % 12 === 0 ? 0 : 1)} yrs
            </span>
          </div>
          <Slider
            value={[tenure]}
            min={6}
            max={84}
            step={6}
            onValueChange={(v) => setTenure(v[0])}
            aria-label="Tenure in months"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground num">
            <span>6 mo</span>
            <span>7 yrs</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <ApplyButton size="lg" className="flex-1">
          Apply for this loan <ArrowRight className="h-4 w-4" />
        </ApplyButton>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Indicative only. Final rate depends on the lender &amp; your profile.
      </p>
    </div>
  );
}
