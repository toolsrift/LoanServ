import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/site";

const footerCols: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Loans",
    links: [
      { label: "Personal Loan", href: "/loans/personal-loan" },
      { label: "Business Loan", href: "/loans/business-loan" },
      { label: "Home Loan", href: "/loans/home-loan" },
      { label: "Loan Against Property", href: "/loans/mortgage-loan-lap" },
      { label: "Car Loan", href: "/loans/car-loan" },
      { label: "All loan types", href: "/loans" },
    ],
  },
  {
    heading: "Calculators",
    links: [
      { label: "EMI Calculator", href: "/calculators/emi-calculator" },
      { label: "Eligibility Calculator", href: "/calculators/loan-eligibility" },
      { label: "Balance Transfer Savings", href: "/calculators/balance-transfer-savings" },
      { label: "SIP Calculator", href: "/calculators/sip" },
      { label: "Income Tax Calculator", href: "/calculators/income-tax" },
      { label: "All calculators", href: "/calculators" },
    ],
  },
  {
    heading: "Locations",
    links: [
      { label: "Loans in Hyderabad", href: "/locations/hyderabad" },
      { label: "Loans in Bangalore", href: "/locations/bangalore" },
      { label: "Loans in Chennai", href: "/locations/chennai" },
      { label: "Loans in Vijayawada", href: "/locations/vijayawada" },
      { label: "Loans in Visakhapatnam", href: "/locations/visakhapatnam" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Knowledge Center", href: "/knowledge-center" },
      { label: "Glossary", href: "/knowledge-center/glossary" },
      { label: "Blog", href: "/blog" },
      { label: "This Month's Offers", href: "/offers" },
      { label: "Free CIBIL Score", href: "/free-cibil-score" },
      { label: "Finance News", href: "/news" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Bank & NBFC Partners", href: "/partners" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Apply Now", href: "/apply" },
      { label: "Style Guide", href: "/style-guide" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
  { label: "Data & Privacy (CIBIL)", href: "/legal/data-policy" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper print:hidden">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="lg:pr-6">
            <Logo wordmarkClassName="[&>span:first-child]:text-paper" />
            <p className="mt-4 max-w-xs text-sm text-paper/70">{site.tagline}</p>
            <ul className="mt-5 space-y-2 text-sm text-paper/80">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                <span>{site.address.full}</span>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                <a href={`mailto:${site.email}`} className="hover:text-mint">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                <span>{site.hours}</span>
              </li>
            </ul>
          </div>

          {footerCols.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-sm font-semibold text-paper">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-mint">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal disclaimer strip */}
        <div className="mt-12 rounded-2xl border border-paper/10 bg-paper/[0.04] p-5">
          <p className="text-xs leading-relaxed text-paper/70">
            <strong className="text-paper">Disclaimer:</strong> {site.disclaimer} All interest rates, fees and offers
            shown on this website are indicative, sourced from public information, and subject to change by the
            respective banks/NBFCs at their sole discretion. Please confirm current terms with the lender before
            applying.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-paper/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-paper/60">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-paper/60 hover:text-mint">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
