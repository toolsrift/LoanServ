import Link from "next/link";
import { MapPin, ArrowUpRight, Check, ArrowRight, Landmark, ShieldCheck } from "lucide-react";
import { Container, Eyebrow, Card, Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ApplyButton } from "@/components/apply/ApplyButton";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { getIcon } from "@/lib/icons";
import { getLoan } from "@/data/loans";
import { CITY_LOAN_SLUGS } from "@/lib/loan-city";
import type { CityContent, LoanContent } from "@/data/types";

export function LocationPageTemplate({ city }: { city: CityContent }) {
  const featured = city.featuredLoans.map(getLoan).filter(Boolean) as LoanContent[];

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Locations", href: "/locations" },
          { name: `Loans in ${city.city}`, href: `/locations/${city.slug}` },
        ]}
      />

      <PageHero
        eyebrow={city.state}
        eyebrowIcon={MapPin}
        title={`Loans in ${city.city}`}
        description={city.tagline}
        chips={city.areas.slice(0, 5)}
        primary={
          <ApplyButton size="lg">
            Apply in {city.city} <ArrowRight className="h-4 w-4" />
          </ApplyButton>
        }
        trust={[
          { icon: Landmark, label: "30+ lenders compared" },
          { icon: ShieldCheck, label: "Free for borrowers" },
          { icon: MapPin, label: "Local advisors" },
        ]}
      />

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="prose-loanserv">
              {city.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lg" : ""}>
                  {p}
                </p>
              ))}
            </div>
            <Card className="h-fit p-6">
              <h2 className="font-display text-lg text-ink">Areas we serve in {city.city}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {city.areas.map((a) => (
                  <Badge key={a} tone="sand">
                    {a}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="bg-muted/50 py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {city.highlights.map((h) => (
              <Card key={h.title} className="p-5">
                <Check className="h-5 w-5 text-evergreen" />
                <h3 className="mt-3 font-display text-base text-ink">{h.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Container>
      </Container>

      {/* Featured loans in this city */}
      <section className="pb-12">
        <Container>
          <Eyebrow>Popular in {city.city}</Eyebrow>
          <h2 className="mt-3 text-display-sm">Loans people apply for here</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((loan) => {
              const Icon = getIcon(loan.icon);
              // The loan×city doorway URL only exists for real cities whose loan is in the param set;
              // for state hubs (or loans without city pages) link to the loan hub so it resolves 200.
              const hasCityPage = city.type === "city" && CITY_LOAN_SLUGS.includes(loan.slug);
              const href = hasCityPage ? `/${loan.slug}/${city.slug}` : `/loans/${loan.slug}`;
              return (
                <Link
                  key={loan.slug}
                  href={href}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-sand bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="flex gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-evergreen/10 text-evergreen">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base text-ink group-hover:text-evergreen">
                        {loan.shortName} in {city.city}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{loan.tagline}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-evergreen" />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <FaqSection faqs={city.faqs} title={`Loans in ${city.city} — FAQs`} />
      <CtaBlock title={`Apply for a loan in ${city.city}`} />
    </>
  );
}
