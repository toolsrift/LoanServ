import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";

const areas = [
  { city: "Hyderabad", slug: "hyderabad", note: "Head office · Nizampet", state: "Telangana" },
  { city: "Vijayawada", slug: "vijayawada", note: "Benz Circle & MG Road", state: "Andhra Pradesh" },
  { city: "Visakhapatnam", slug: "visakhapatnam", note: "MVP Colony & Gajuwaka", state: "Andhra Pradesh" },
  { city: "Bangalore", slug: "bangalore", note: "Whitefield to Electronic City", state: "Karnataka" },
  { city: "Chennai", slug: "chennai", note: "T. Nagar to OMR", state: "Tamil Nadu" },
];

export function ServiceArea() {
  return (
    <section className="bg-ink py-16 text-paper sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow className="text-mint">Where we work</Eyebrow>
            <h2 className="mt-3 font-display text-display-sm text-paper">
              On-ground DSA support across South India
            </h2>
            <p className="mt-4 max-w-md text-paper/75">
              Headquartered in Hyderabad, LoanServ serves borrowers across Andhra Pradesh, Telangana, Bangalore and
              Chennai — with doorstep document pickup and a local advisor who knows your city&apos;s lenders.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/locations/telangana"
                className="rounded-full border border-paper/20 px-4 py-2 text-sm text-paper/90 hover:border-mint hover:text-mint"
              >
                Telangana
              </Link>
              <Link
                href="/locations/andhra-pradesh"
                className="rounded-full border border-paper/20 px-4 py-2 text-sm text-paper/90 hover:border-mint hover:text-mint"
              >
                Andhra Pradesh
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/locations/${a.slug}`}
                className="group flex items-start justify-between gap-3 rounded-2xl border border-paper/10 bg-paper/[0.04] p-4 transition-colors hover:border-mint/40 hover:bg-paper/[0.07]"
              >
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                  <div>
                    <p className="font-semibold text-paper">Loans in {a.city}</p>
                    <p className="text-xs text-paper/60">{a.note}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-paper/40">{a.state}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-paper/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mint" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
