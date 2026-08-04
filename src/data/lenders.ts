import type { Lender } from "@/data/types";

export const lenders: Lender[] = [
  {
    slug: "hdfc-bank",
    name: "HDFC Bank",
    type: "Bank",
    about:
      "HDFC Bank is one of India's largest private-sector banks, serving crores of customers across retail and corporate segments. It is known for quick digital lending journeys and a wide branch network spanning metros to smaller towns. Its retail loan book covers everything from unsecured personal credit to long-tenure home finance.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Loan Against Property", "Gold Loan"],
    established: "1994",
    tint: "#004C8F",
  },
  {
    slug: "icici-bank",
    name: "ICICI Bank",
    type: "Bank",
    about:
      "ICICI Bank is a leading private bank offering a full suite of retail and business lending products. It has invested heavily in instant, paperless loan approvals through its mobile and net-banking platforms. Salaried and self-employed borrowers alike use it for both secured and unsecured financing.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Loan Against Property", "Two-Wheeler Loan"],
    established: "1994",
    tint: "#AE292E",
  },
  {
    slug: "axis-bank",
    name: "Axis Bank",
    type: "Bank",
    about:
      "Axis Bank is among the top private banks in India with a strong presence in retail lending. It offers competitive rates on personal, home and auto loans, often bundled with pre-approved offers for existing customers. Its digital onboarding lets many borrowers complete applications end to end online.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Loan Against Property", "Education Loan"],
    established: "1993",
    tint: "#97144D",
  },
  {
    slug: "kotak-mahindra-bank",
    name: "Kotak Mahindra Bank",
    type: "Bank",
    about:
      "Kotak Mahindra Bank is a private-sector bank with a reputation for customer-friendly digital banking. Its lending range covers unsecured personal loans through to home and vehicle finance with flexible tenures. The bank frequently offers balance-transfer and top-up options to existing loan customers.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Loan Against Property"],
    established: "2003",
    tint: "#EF3E23",
  },
  {
    slug: "indusind-bank",
    name: "IndusInd Bank",
    type: "Bank",
    about:
      "IndusInd Bank is a private bank offering a broad set of retail and commercial loan products. It is well known for vehicle financing alongside personal and home loans. The bank targets both salaried professionals and self-employed borrowers with tailored eligibility criteria.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Two-Wheeler Loan"],
    established: "1994",
    tint: "#98232B",
  },
  {
    slug: "yes-bank",
    name: "Yes Bank",
    type: "Bank",
    about:
      "Yes Bank is a private-sector bank that provides retail loans across personal, home and auto categories. It focuses on digital-first processing to speed up sanction and disbursal. The bank serves urban and semi-urban borrowers with competitive offers for salaried applicants.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Loan Against Property"],
    established: "2004",
    tint: "#00518F",
  },
  {
    slug: "idfc-first-bank",
    name: "IDFC First Bank",
    type: "Bank",
    about:
      "IDFC First Bank is a technology-led private bank with a growing retail lending portfolio. It emphasises transparent, monthly-reducing interest rates and quick digital approvals. The bank is popular for personal loans and consumer finance among younger, salaried customers.",
    products: ["Personal Loan", "Home Loan", "Car Loan", "Business Loan", "Two-Wheeler Loan"],
    established: "2018",
    tint: "#9C1D26",
  },
  {
    slug: "bandhan-bank",
    name: "Bandhan Bank",
    type: "Bank",
    about:
      "Bandhan Bank grew from a microfinance institution into a full-service private bank with deep rural and semi-urban reach. It offers retail and micro-lending products aimed at first-time and underserved borrowers. Its network is especially strong across eastern India.",
    products: ["Personal Loan", "Home Loan", "Business Loan", "Micro Loan", "Two-Wheeler Loan"],
    established: "2015",
    tint: "#B01E3C",
  },
  {
    slug: "bajaj-finserv",
    name: "Bajaj Finserv",
    type: "NBFC",
    about:
      "Bajaj Finserv, through Bajaj Finance, is one of India's largest non-banking financial companies for retail lending. It is widely known for instant personal loans, consumer-durable EMI finance and flexible loan-on-EMI cards. Fast approvals and pre-approved offers make it a popular choice for quick funds.",
    products: ["Personal Loan", "Business Loan", "Loan Against Property", "Home Loan", "Consumer Durable Loan", "Gold Loan"],
    established: "2007",
    tint: "#0057A3",
  },
  {
    slug: "tata-capital",
    name: "Tata Capital",
    type: "NBFC",
    about:
      "Tata Capital is the financial-services arm of the Tata Group, offering a wide range of retail and commercial loans. It provides personal, home and business finance with the trust of the Tata brand. Digital tools allow borrowers to check eligibility and apply online in minutes.",
    products: ["Personal Loan", "Home Loan", "Business Loan", "Loan Against Property", "Two-Wheeler Loan"],
    established: "2007",
    tint: "#486AAE",
  },
  {
    slug: "aditya-birla-finance",
    name: "Aditya Birla Finance",
    type: "NBFC",
    about:
      "Aditya Birla Finance is the lending arm of the Aditya Birla Capital group, serving retail and corporate borrowers. It offers personal loans, loans against property and business finance with flexible structures. The company caters to both salaried individuals and enterprises seeking growth capital.",
    products: ["Personal Loan", "Business Loan", "Loan Against Property", "Home Loan", "Loan Against Securities"],
    established: "1991",
    tint: "#C4161C",
  },
  {
    slug: "poonawalla-fincorp",
    name: "Poonawalla Fincorp",
    type: "NBFC",
    about:
      "Poonawalla Fincorp is a digital-first NBFC focused on consumer and small-business lending. It is known for competitive rates on personal loans and quick, technology-driven disbursals. The company targets salaried and self-employed borrowers with a largely paperless process.",
    products: ["Personal Loan", "Business Loan", "Loan Against Property", "Professional Loan", "Pre-Owned Car Loan"],
    established: "2020",
    tint: "#00A44E",
  },
  {
    slug: "cholamandalam",
    name: "Cholamandalam",
    type: "NBFC",
    about:
      "Cholamandalam Investment and Finance, part of the Murugappa Group, is a leading NBFC in vehicle and small-business finance. It has a strong presence in semi-urban and rural markets across India. The company serves first-time borrowers and small entrepreneurs with accessible loan products.",
    products: ["Vehicle Loan", "Business Loan", "Loan Against Property", "Home Loan", "Personal Loan"],
    established: "1978",
    tint: "#E11B22",
  },
  {
    slug: "lt-finance",
    name: "L&T Finance",
    type: "NBFC",
    about:
      "L&T Finance is the retail-lending NBFC of the Larsen & Toubro group, offering a diverse loan portfolio. It provides personal, two-wheeler, farm and business finance with a wide rural footprint. The company blends digital processing with an extensive on-ground presence.",
    products: ["Personal Loan", "Two-Wheeler Loan", "Business Loan", "Farm Equipment Loan", "Home Loan"],
    established: "2008",
    tint: "#0072BC",
  },
  {
    slug: "muthoot-finance",
    name: "Muthoot Finance",
    type: "NBFC",
    about:
      "Muthoot Finance is India's largest gold-loan NBFC, with thousands of branches nationwide. It is best known for fast, secured lending against gold jewellery with minimal paperwork. Beyond gold, it has expanded into personal and business finance for its customer base.",
    products: ["Gold Loan", "Personal Loan", "Business Loan", "Home Loan", "Two-Wheeler Loan"],
    established: "1939",
    tint: "#B21F24",
  },
  {
    slug: "utkarsh-small-finance-bank",
    name: "Utkarsh Small Finance Bank",
    type: "Small Finance Bank",
    about:
      "Utkarsh Small Finance Bank focuses on financial inclusion, serving underbanked and micro-enterprise customers. It offers micro-loans, business finance and retail lending with a strong presence in northern and eastern India. The bank aims to bring formal credit to first-time borrowers.",
    products: ["Micro Loan", "Business Loan", "Home Loan", "Personal Loan", "Loan Against Property"],
    established: "2016",
    tint: "#F26522",
  },
];

export function getLender(slug: string) {
  return lenders.find((l) => l.slug === slug);
}
