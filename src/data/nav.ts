/** Navigation model consumed by the header mega-menu, mobile nav, and footer. */

export interface NavLink {
  label: string;
  href: string;
  desc?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface MegaMenu {
  label: string;
  href: string;
  columns: NavColumn[];
  featured?: { title: string; desc: string; href: string; cta: string };
}

export const megaMenus: MegaMenu[] = [
  {
    label: "Loan Types",
    href: "/loans",
    columns: [
      {
        heading: "Popular loans",
        links: [
          { label: "Personal Loan", href: "/loans/personal-loan", desc: "Unsecured, fast approval" },
          { label: "Business Loan", href: "/loans/business-loan", desc: "Grow your enterprise" },
          { label: "Home Loan", href: "/loans/home-loan", desc: "Buy, build or renovate" },
          { label: "Car Loan", href: "/loans/car-loan", desc: "New & used vehicles" },
          { label: "Loan Against Property", href: "/loans/mortgage-loan-lap", desc: "Unlock property value" },
        ],
      },
      {
        heading: "Professional & specialised",
        links: [
          { label: "Doctor Loan", href: "/loans/doctor-loan" },
          { label: "CA Loan", href: "/loans/ca-loan" },
          { label: "Professional Loan", href: "/loans/professional-loan" },
          { label: "Education Loan", href: "/loans/education-loan" },
          { label: "Overdraft (OD)", href: "/loans/overdraft" },
        ],
      },
      {
        heading: "Business & assets",
        links: [
          { label: "Working Capital Loan", href: "/loans/working-capital-loan" },
          { label: "Machinery Loan", href: "/loans/machinery-loan" },
          { label: "Loan for Self-Employed", href: "/loans/loan-for-self-employed" },
          { label: "Two-Wheeler Loan", href: "/loans/two-wheeler-loan" },
          { label: "Used Car Loan", href: "/loans/used-car-loan" },
        ],
      },
    ],
    featured: {
      title: "Not sure which loan fits?",
      desc: "Get a free callback and compare offers from 30+ lenders.",
      href: "/apply",
      cta: "Apply for Loan",
    },
  },
  {
    label: "Balance Transfer & Top-Up",
    href: "/balance-transfer",
    columns: [
      {
        heading: "Balance transfer",
        links: [
          { label: "Personal Loan Balance Transfer", href: "/balance-transfer/personal-loan" },
          { label: "Home Loan Balance Transfer", href: "/balance-transfer/home-loan" },
          { label: "Car Loan Balance Transfer", href: "/balance-transfer/car-loan" },
          { label: "LAP / Mortgage Balance Transfer", href: "/balance-transfer/mortgage-lap" },
        ],
      },
      {
        heading: "Convert & top-up",
        links: [
          { label: "Credit Card to Loan Conversion", href: "/balance-transfer/credit-card-to-loan" },
          { label: "Loan Top-Up", href: "/balance-transfer/loan-top-up" },
          { label: "Balance Transfer Hub", href: "/balance-transfer" },
        ],
      },
    ],
    featured: {
      title: "Paying too much interest?",
      desc: "See how much a balance transfer could save you.",
      href: "/calculators/balance-transfer-savings",
      cta: "Calculate savings",
    },
  },
  {
    label: "Calculators",
    href: "/calculators",
    columns: [
      {
        heading: "EMI & eligibility",
        links: [
          { label: "EMI Calculator", href: "/calculators/emi-calculator" },
          { label: "Home Loan EMI", href: "/calculators/home-loan-emi" },
          { label: "Personal Loan EMI", href: "/calculators/personal-loan-emi" },
          { label: "Loan Eligibility", href: "/calculators/loan-eligibility" },
          { label: "Prepayment Calculator", href: "/calculators/prepayment" },
        ],
      },
      {
        heading: "Investment & savings",
        links: [
          { label: "SIP Calculator", href: "/calculators/sip" },
          { label: "Lumpsum Calculator", href: "/calculators/lumpsum" },
          { label: "FD Calculator", href: "/calculators/fd" },
          { label: "PPF Calculator", href: "/calculators/ppf" },
          { label: "Compound Interest", href: "/calculators/compound-interest" },
        ],
      },
      {
        heading: "Tax & more",
        links: [
          { label: "Income Tax Calculator", href: "/calculators/income-tax" },
          { label: "HRA Calculator", href: "/calculators/hra" },
          { label: "GST Calculator", href: "/calculators/gst" },
          { label: "Retirement Corpus", href: "/calculators/retirement" },
          { label: "All calculators →", href: "/calculators" },
        ],
      },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    columns: [
      {
        heading: "City hubs",
        links: [
          { label: "Loans in Hyderabad", href: "/locations/hyderabad" },
          { label: "Loans in Bangalore", href: "/locations/bangalore" },
          { label: "Loans in Chennai", href: "/locations/chennai" },
          { label: "Loans in Vijayawada", href: "/locations/vijayawada" },
          { label: "Loans in Visakhapatnam", href: "/locations/visakhapatnam" },
        ],
      },
      {
        heading: "State hubs",
        links: [
          { label: "Loans in Telangana", href: "/locations/telangana" },
          { label: "Loans in Andhra Pradesh", href: "/locations/andhra-pradesh" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/knowledge-center",
    columns: [
      {
        heading: "Learn",
        links: [
          { label: "Knowledge Center", href: "/knowledge-center" },
          { label: "Product Info", href: "/knowledge-center/product-info" },
          { label: "Guides & Tutorials", href: "/knowledge-center/tutorials" },
          { label: "Glossary", href: "/knowledge-center/glossary" },
        ],
      },
      {
        heading: "Read",
        links: [
          { label: "Blog", href: "/blog" },
          { label: "Finance News", href: "/news" },
          { label: "This Month's Offers", href: "/offers" },
          { label: "Free CIBIL Score", href: "/free-cibil-score" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Bank & NBFC Partners", href: "/partners" },
          { label: "Contact Us", href: "/contact" },
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
  },
];

/** Flat top-level links for mobile + simple contexts. */
export const primaryNav: NavLink[] = megaMenus.map((m) => ({ label: m.label, href: m.href }));
