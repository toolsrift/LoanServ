import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { buildMetadata } from "@/lib/seo";
import { cities } from "@/data/cities";

export const metadata: Metadata = buildMetadata({
  title: "Loan Services by City — Hyderabad, Bangalore, Chennai & More",
  description:
    "LoanServ offers on-ground DSA loan support across Hyderabad, Vijayawada, Visakhapatnam, Bangalore and Chennai, plus Telangana and Andhra Pradesh state hubs.",
  path: "/locations",
});

export default function LocationsHub() {
  const cityHubs = cities.filter((c) => c.type === "city");
  const stateHubs = cities.filter((c) => c.type === "state");

  return (
    <>
      <Breadcrumbs items={[{ name: "Locations", href: "/locations" }]} />
      <section className="bg-paper py-12 sm:py-16">
        <Container>
          <Eyebrow>Where we work</Eyebrow>
          <h1 className="mt-3 max-w-2xl text-display-lg text-ink">Loan services across South India</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">
            Headquartered in Nizampet, Hyderabad, LoanServ serves borrowers with local advisors and doorstep document
            pickup across four states.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <h2 className="mb-5 font-display text-xl text-ink">City hubs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityHubs.map((c) => (
              <CityCard key={c.slug} slug={c.slug} city={c.city} state={c.state} />
            ))}
          </div>

          <h2 className="mb-5 mt-12 font-display text-xl text-ink">State hubs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {stateHubs.map((c) => (
              <CityCard key={c.slug} slug={c.slug} city={c.city} state={c.state} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBlock />
    </>
  );
}

function CityCard({ slug, city, state }: { slug: string; city: string; state: string }) {
  return (
    <Link
      href={`/locations/${slug}`}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-base text-ink group-hover:text-evergreen">Loans in {city}</h3>
          <p className="text-sm text-muted-foreground">{state}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
    </Link>
  );
}
