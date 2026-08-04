import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LoanServ logo. The mark is a rupee (₹) coin inside a rounded square — money
 * made clear, trust and approval. Themes via the Ledger tokens so it works on
 * light headers, the dark footer, and as a favicon.
 */

export function LogoMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="LoanServ mark"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      {/* rounded-square token */}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="var(--ink)" />
      {/* coin ring */}
      <circle cx="20" cy="20" r="12.5" stroke="var(--evergreen)" strokeWidth="2.5" fill="none" />
      {/* rupee glyph, drawn as strokes so it stays crisp at 24px */}
      <g stroke="var(--paper)" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M15.5 14.5h9" />
        <path d="M15.5 18.5h9" />
        {/* rupee stem + leg */}
        <path d="M22.5 14.5c0 4-1.7 6-6 6h-1l7 6" />
      </g>
      {/* saffron approval dot */}
      <circle cx="30.5" cy="10" r="2.4" fill="var(--saffron)" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "full",
  wordmarkClassName,
}: {
  className?: string;
  variant?: "full" | "mark";
  /** Override wordmark color context (e.g. on dark footer). */
  wordmarkClassName?: string;
}) {
  if (variant === "mark") {
    return <LogoMark className={className} />;
  }
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      <span
        className={cn(
          "font-display text-[1.4rem] font-semibold leading-none tracking-tight",
          wordmarkClassName,
        )}
      >
        <span className="text-ink">Loan</span>
        <span className="text-evergreen">Serv</span>
      </span>
    </span>
  );
}
