import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow, Card } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { lenders } from "@/data/lenders";
import type { Lender } from "@/data/types";

export const metadata: Metadata = buildMetadata({
  title: "Our Bank & NBFC Partners — 30+ Lenders",
  description:
    "LoanServ has direct DSA tie-ups with 30+ banks, NBFCs and small finance banks — HDFC, ICICI, Axis, Bajaj Finserv, Tata Capital and more. Compare offers and apply in one place.",
  path: "/partners",
});

/** Brand-tinted initials tile — placeholder until real partner logos are supplied. */
function initialsOf(name: string) {
  return name
    .replace(/Bank|Finance|Finserv|Capital|Fincorp|Limited|Ltd/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function PartnerTile({ lender }: { lender: Lender }) {
  return (
    <Link
      href={`/offers/${lender.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-sand bg-white p-4 transition-shadow hover:shadow-soft"
      title={lender.name}
    >
      {/* TODO: replace initials tile with real partner logo. alt text = lender name */}
      <span
        role="img"
        aria-label={`${lender.name} logo`}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
        style={{ background: lender.tint }}
      >
        {initialsOf(lender.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink group-hover:text-evergreen">
          {lender.name}
        </span>
        {lender.established && (
          <span className="num block text-xs text-muted-foreground">Since {lender.established}</span>
        )}
      </span>
    </Link>
  );
}

const GROUPS: { type: Lender["type"]; heading: string; blurb: string }[] = [
  { type: "Bank", heading: "Banks", blurb: "Private and scheduled commercial banks for secured and unsecured lending." },
  { type: "NBFC", heading: "NBFCs", blurb: "Non-banking financial companies known for fast, flexible retail credit." },
  {
    type: "Small Finance Bank",
    heading: "Small Finance Banks",
    blurb: "Inclusion-focused lenders serving micro-enterprises and first-time borrowers.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Partners", href: "/partners" }]} />

      <section className="bg-paper py-14 sm:py-16">
        <Container>
          <Eyebrow>Our lending partners</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">
            Direct DSA tie-ups with 30+ banks &amp; NBFCs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            {site.name} routes your application to the lenders most likely to approve it at a sensible
            rate. Below is a selection of our partners across banks, NBFCs and small finance banks —
            tap any tile to see the offers and details for that lender.
          </p>
        </Container>
      </section>

      <section className="pb-8 sm:pb-12">
        <Container>
          {GROUPS.map((group) => {
            const items = lenders.filter((l) => l.type === group.type);
            if (!items.length) return null;
            return (
              <div key={group.type} className="mb-12 last:mb-0">
                <div className="mb-5">
                  <h2 className="font-display text-display-sm text-ink">{group.heading}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate">{group.blurb}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((lender) => (
                    <PartnerTile key={lender.slug} lender={lender} />
                  ))}
                </div>
              </div>
            );
          })}

          <Card className="mt-4 flex flex-col items-start gap-2 bg-muted p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate">
              …and more. We continually add bank, NBFC and HFC partners across our service regions.
            </p>
            <Link
              href="/contact"
              className="shrink-0 text-sm font-medium text-evergreen underline underline-offset-2"
            >
              Ask which lender suits you →
            </Link>
          </Card>
        </Container>
      </section>

      <CtaBlock
        title="Not sure which lender fits your profile?"
        subtitle="Send one free application. We compare our partners and call you back with the best-fit options — no obligation."
      />
    </>
  );
}
