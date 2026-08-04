import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { site } from "@/lib/site";

/** The recurring conversion block. Ink background, saffron CTA, ascending motif. */
export function CtaBlock({
  title = "Ready to find your best loan offer?",
  subtitle = "One free application. We compare 30+ banks & NBFCs and call you back — no obligation.",
  presetCategory,
}: {
  title?: string;
  subtitle?: string;
  presetCategory?: string;
}) {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-paper sm:px-12">
          {/* ascending line motif */}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-20"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M0 90 L300 78 L600 54 L900 32 L1200 8" fill="none" stroke="var(--mint)" strokeWidth="2" />
          </svg>
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-display-sm text-paper">{title}</h2>
              <p className="mt-3 text-paper/75">{subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ApplyButton presetCategory={presetCategory} size="lg">
                Apply for Loan <ArrowRight className="h-4 w-4" />
              </ApplyButton>
              <Button asChild variant="outline" size="lg" className="border-paper/25 text-paper hover:bg-paper/10">
                <a href={`tel:+91${site.whatsapp.slice(-10)}`}>
                  <Phone className="h-4 w-4" /> Talk to an advisor
                </a>
              </Button>
            </div>
          </div>
          <p className="relative mt-6 text-xs text-paper/50">{site.disclaimer}</p>
        </div>
      </Container>
    </section>
  );
}

/** Compact link row for related pages / internal linking. */
export function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  if (!links.length) return null;
  return (
    <div className="rounded-2xl border border-sand bg-white p-6">
      <h3 className="mb-3 font-display text-lg text-ink">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex items-center gap-1 rounded-full border border-sand bg-paper px-3 py-1.5 text-sm text-slate transition-colors hover:border-evergreen hover:text-evergreen"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
