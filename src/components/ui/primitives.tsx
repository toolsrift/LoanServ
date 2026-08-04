import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered content container matching the editorial grid. */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)} {...props} />;
}

/** Vertical section rhythm with optional tone. */
export function Section({
  className,
  tone = "paper",
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "paper" | "ink" | "muted" | "transparent" }) {
  const tones = {
    paper: "bg-paper text-slate",
    muted: "bg-muted text-slate",
    ink: "bg-ink text-paper",
    transparent: "",
  } as const;
  return <section className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)} {...props} />;
}

/** Small uppercase eyebrow label used above section headings. */
export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-evergreen",
        className,
      )}
    >
      <span className="h-px w-6 bg-evergreen/50" aria-hidden />
      {children}
    </span>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand bg-card text-card-foreground shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "evergreen",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "evergreen" | "saffron" | "mint" | "sand" }) {
  const tones = {
    evergreen: "bg-evergreen/10 text-evergreen",
    saffron: "bg-saffron/15 text-[#8a5a04]",
    mint: "bg-mint/15 text-[#0c6b4c]",
    sand: "bg-sand text-slate",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Ascending-line divider — the recurring growth motif. */
export function AscendingRule({ className }: { className?: string }) {
  return (
    <div className={cn("relative py-8", className)} aria-hidden>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-6 w-full">
        <path
          d="M0 32 L280 30 L520 22 L760 14 L1000 8 L1200 4"
          fill="none"
          stroke="var(--sand)"
          strokeWidth="1.5"
        />
        <circle cx="1200" cy="4" r="3" fill="var(--mint)" />
      </svg>
    </div>
  );
}
