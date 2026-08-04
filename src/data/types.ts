/** Shared content models for data-driven, SEO-consistent pages. */

export interface Faq {
  q: string;
  a: string;
}

export interface ComparisonRow {
  lender: string;
  rate: string;
  processingFee: string;
  maxTenure: string;
  highlight?: string;
}

export interface LoanContent {
  slug: string;
  name: string;
  /** e.g. "Personal" — maps to the apply-form category */
  category: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  /** hero tagline */
  tagline: string;
  /** 2–3 intro paragraphs (unique per loan) */
  intro: string[];
  /** Bullet benefits */
  benefits: { title: string; desc: string }[];
  eligibility: string[];
  documents: string[];
  /** step-by-step process */
  process: { title: string; desc: string }[];
  comparison: ComparisonRow[];
  /** illustrative rate range shown as "indicative" */
  rateRange: { from: number; to: number };
  amountRange: { from: number; to: number };
  tenureRange: { fromMonths: number; toMonths: number };
  faqs: Faq[];
  /** related calculator slugs */
  calculators: string[];
  /** related loan slugs for internal linking */
  related: string[];
  icon: string; // lucide icon name
}

export type CalculatorKind =
  | "emi"
  | "eligibility"
  | "balance-transfer"
  | "prepayment"
  | "lap"
  | "sip"
  | "lumpsum"
  | "fd"
  | "rd"
  | "ppf"
  | "income-tax"
  | "hra"
  | "compound-interest"
  | "gst"
  | "retirement";

export interface CalculatorMeta {
  slug: string;
  kind: CalculatorKind;
  name: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  /** short original explainer paragraphs */
  intro: string[];
  /** how-to / notes section */
  notes?: string[];
  faqs: Faq[];
  /** preset config for EMI-style calculators */
  presetCategory?: string;
  defaults?: {
    amount?: { min: number; max: number; step: number; default: number; label?: string };
    rate?: { min: number; max: number; step: number; default: number; label?: string };
    tenure?: { min: number; max: number; step: number; default: number; label?: string; unit?: "months" | "years" };
  };
  related: string[];
  group: "Loan EMI" | "Eligibility" | "Investment" | "Tax & Other";
}

export interface CityContent {
  slug: string;
  city: string;
  state: string;
  type: "city" | "state";
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string[];
  /** local landmarks / areas served for local flavour */
  areas: string[];
  /** why LoanServ here */
  highlights: { title: string; desc: string }[];
  faqs: Faq[];
  /** loan slugs featured for this city */
  featuredLoans: string[];
}

export interface Lender {
  slug: string;
  name: string;
  type: "Bank" | "NBFC" | "Small Finance Bank" | "HFC";
  /** short blurb */
  about: string;
  /** products offered */
  products: string[];
  established?: string;
  /** brand tint hex for the placeholder logo tile */
  tint: string;
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  letter: string;
  definition: string;
  related?: string[];
}

export interface BtContent {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string[];
  whenItSaves: string[];
  example: { label: string; value: string }[];
  faqs: Faq[];
  related: string[];
}
