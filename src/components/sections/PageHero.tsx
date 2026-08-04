import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Check, Star } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export interface HeroTrustItem {
  icon: LucideIcon;
  label: string;
}

/**
 * Shared dark "landing" hero used across inner-page templates so the site feels
 * consistently designed. Ink backdrop + gradient mesh + dotted grid, eyebrow,
 * big display title, optional benefit chips, dual CTAs, a trust row and an
 * optional right-hand aside card.
 */
export function PageHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  chips,
  primary,
  secondary,
  trust,
  aside,
}: {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  description?: string;
  chips?: string[];
  primary?: React.ReactNode;
  secondary?: { label: string; href: string };
  trust?: HeroTrustItem[];
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(55rem 40rem at 90% -10%, rgba(34,197,139,0.16), transparent 60%), radial-gradient(45rem 35rem at -5% 110%, rgba(14,90,74,0.35), transparent 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        aria-hidden
      />
      <Container className="relative">
        <div
          className={
            aside
              ? "grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20"
              : "max-w-3xl py-14 lg:py-16"
          }
        >
          <div className="animate-fade-up">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.06] px-3 py-1.5 text-xs font-medium text-mint">
                {EyebrowIcon && <EyebrowIcon className="h-4 w-4" />} {eyebrow}
              </span>
            )}
            <h1 className="mt-5 text-display-xl text-paper">{title}</h1>
            {description && <p className="mt-4 max-w-xl text-lg text-paper/75">{description}</p>}

            {chips && chips.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full border border-paper/12 bg-paper/[0.05] px-3 py-1.5 text-sm text-paper/85"
                  >
                    <Check className="h-3.5 w-3.5 text-mint" /> {c}
                  </li>
                ))}
              </ul>
            )}

            {(primary || secondary) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primary}
                {secondary && (
                  <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                )}
              </div>
            )}

            {trust && trust.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-paper/70">
                {trust.map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <t.icon className="h-4 w-4 text-mint" /> {t.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {aside && <div className="animate-fade-up [animation-delay:120ms]">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}

/** A ready-made 4-star trust snippet for hero trust rows. */
export function StarTrust() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex text-saffron">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="num">4.8</span> rating
    </span>
  );
}
