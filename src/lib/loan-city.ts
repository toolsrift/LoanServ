import { getLoan } from "@/data/loans";
import { getCity, cities } from "@/data/cities";
import type { LoanContent, CityContent } from "@/data/types";

/** The main loan types we generate city landing pages for. */
export const CITY_LOAN_SLUGS = [
  "personal-loan",
  "business-loan",
  "home-loan",
  "mortgage-loan-lap",
  "car-loan",
  "education-loan",
  "working-capital-loan",
  "doctor-loan",
];

/** All (loanType, city) params for static generation — city-type hubs only. */
export function loanCityParams() {
  const cityHubs = cities.filter((c) => c.type === "city");
  const params: { loanType: string; city: string }[] = [];
  for (const loanSlug of CITY_LOAN_SLUGS) {
    for (const c of cityHubs) {
      params.push({ loanType: loanSlug, city: c.slug });
    }
  }
  return params;
}

export interface LoanCityData {
  loan: LoanContent;
  city: CityContent;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
}

/** Resolve + build localized, varied copy for a loan×city combo. Returns null if invalid. */
export function getLoanCity(loanType: string, citySlug: string): LoanCityData | null {
  const loan = getLoan(loanType);
  const city = getCity(citySlug);
  if (!loan || !city || city.type !== "city") return null;
  if (!CITY_LOAN_SLUGS.includes(loanType)) return null;

  const areaA = city.areas[0] || city.city;
  const areaB = city.areas[1] || city.city;
  const areaC = city.areas[2] || city.city;

  // Varied templated-but-localized copy (kept distinct per combo to avoid thin content).
  const intro = [
    `Looking for a ${loan.name.toLowerCase()} in ${city.city}? LoanServ is a local DSA facilitator helping ${city.city} borrowers compare and apply for a ${loan.shortName.toLowerCase()} across 30+ banks and NBFCs. From ${areaA} to ${areaB}, our advisors bring the paperwork to your doorstep and match you to lenders whose eligibility fits your profile — at indicative rates from ${loan.rateRange.from}% p.a.`,
    `${loan.intro[0]}`,
    `Whether you live or work in ${areaA}, ${areaB} or ${areaC}, we know which ${city.state} lenders move fastest for a ${loan.shortName.toLowerCase()} and how to present your application cleanly. There's no fee to you — as a DSA, LoanServ is paid by the lender only when your loan is disbursed. Approval and final terms always rest with the bank or NBFC.`,
  ];

  return {
    loan,
    city,
    title: `${loan.name} in ${city.city}`,
    metaTitle: `${loan.name} in ${city.city} — Rates & Apply`.slice(0, 65),
    metaDescription:
      `Apply for a ${loan.name.toLowerCase()} in ${city.city} with LoanServ. Compare indicative rates from ${loan.rateRange.from}% p.a. across 30+ lenders, check eligibility & EMI. Local ${city.city} advisors.`.slice(
        0,
        160,
      ),
    intro,
  };
}
