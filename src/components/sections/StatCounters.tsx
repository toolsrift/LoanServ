"use client";

import * as React from "react";
import { Container } from "@/components/ui/primitives";

function AnimatedStat({ value, suffix, prefix, label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [display, setDisplay] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          if (reduced) {
            setDisplay(value);
            return;
          }
          const duration = 1200;
          let start: number | null = null;
          const tick = (t: number) => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / duration);
            setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, started]);

  return (
    <div ref={ref} className="text-center">
      <p className="num text-4xl font-semibold text-ink sm:text-5xl">
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatCounters() {
  return (
    <section className="border-y border-sand bg-white py-12">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <AnimatedStat value={30} suffix="+" label="Bank & NBFC partners" />
          <AnimatedStat value={5} label="Cities served" />
          <AnimatedStat value={15000} prefix="₹" suffix="+ Cr" label="Loan requirements handled" />
          <AnimatedStat value={98} suffix="%" label="Applications get a callback" />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Illustrative figures. LoanServ is a DSA facilitator, not a lender.
        </p>
      </Container>
    </section>
  );
}
