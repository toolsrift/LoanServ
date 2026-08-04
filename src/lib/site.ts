/**
 * Single source of truth for brand + business facts.
 * Used across metadata, JSON-LD, header/footer, and email routes.
 */
export const site = {
  name: "LoanServ",
  legalName: "LoanServ",
  domain: "loanserv.in",
  // Prefer the env value in production; fall back to the canonical URL.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://loanserv.in",
  tagline: "Compare and apply for loans across India's top banks & NBFCs.",
  description:
    "LoanServ is a DSA loan facilitator helping you compare and apply for personal, business, home and other loans across 30+ banks and NBFCs in Andhra Pradesh, Telangana, Bangalore and Chennai.",
  email: "contact@loanserv.in",
  address: {
    street: "City Homes Sai Kastle, Bandari Layout, Nizampet",
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500090",
    country: "IN",
    full: "City Homes Sai Kastle, Bandari Layout, Nizampet, Hyderabad – 500090",
  },
  geo: { lat: 17.5152, lng: 78.3899 }, // Nizampet, Hyderabad (approx)
  regions: ["Andhra Pradesh", "Telangana", "Bangalore (Karnataka)", "Chennai (Tamil Nadu)"],
  serviceCities: ["Hyderabad", "Vijayawada", "Visakhapatnam", "Bangalore", "Chennai"],
  hours: "Mon–Sat, 10:00 AM – 7:00 PM",
  social: {
    // TODO: replace with real handles
    twitter: "@loanserv",
  },
  disclaimer:
    "LoanServ is a loan facilitator / DSA and not a lender or bank. Loan approval and terms are at the sole discretion of partner banks/NBFCs.",
  // Read at build/runtime from env; falls back to the real business number.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919000308525",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
} as const;

export type SiteConfig = typeof site;
