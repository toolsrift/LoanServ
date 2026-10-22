/**
 * Festive-season 2026 loan offers as reported in the press (Business Standard, 6 Oct 2026).
 * Offers are time-bound. Re-verify each one against the lender's official page before editing,
 * and remove the page from navigation once the season ends.
 */

export interface FestiveOffer {
  lender: string;
  /** lender slug on /offers/<slug>, if LoanServ has a lender page */
  lenderSlug?: string;
  campaign?: string;
  products: string;
  offer: string;
  validity: string;
}

export const festiveSource = {
  name: "Business Standard, 6 Oct 2026",
  url: "https://www.business-standard.com/amp/industry/banking/banks-sweeten-offers-for-retail-customers-as-festive-shopping-picks-up-126100601236_1.html",
  lastChecked: "22 October 2026",
};

export const festiveOffers: FestiveOffer[] = [
  {
    lender: "Punjab National Bank",
    campaign: "PNB Utsav Festivities 2026",
    products: "Home loan, car loan; mortgage and top-up loans for existing home-loan customers",
    offer:
      "Home loans: full waiver of upfront, processing and documentation charges, plus a 5 bps rate concession. Car loans: upfront and processing charges waived. Existing home-loan customers: extra 10 bps concession on mortgage and top-up loans.",
    validity: "Till 31 December 2026",
  },
  {
    lender: "Kotak Mahindra Bank",
    lenderSlug: "kotak-mahindra-bank",
    products: "Home, car, personal, business, two-wheeler, gold, commercial vehicle and construction equipment loans",
    offer: "50% waiver on processing fees.",
    validity: "Festive season — check the bank's website",
  },
  {
    lender: "Yes Bank",
    lenderSlug: "yes-bank",
    products: "Loans (as reported)",
    offer: "50% waiver on processing fees.",
    validity: "Till Diwali",
  },
  {
    lender: "State Bank of India",
    products: "Personal, car and gold loans; loans against mutual funds",
    offer: "Concessional interest rates and processing fee waivers for customers.",
    validity: "Festive season — check the bank's website",
  },
  {
    lender: "HDFC Bank",
    lenderSlug: "hdfc-bank",
    campaign: "Festive Treats 2026 (from 10 Oct)",
    products: "Xpress personal loan, Xpress car loan, home loan",
    offer:
      "Concessional starting rates were reported on Xpress personal loans, Xpress car loans and home loans. The figures quoted could not be reconciled with HDFC Bank's own published rates, so they are not shown here — check the bank's rate page, or our HDFC Bank page, for current rates. No processing fee waiver was reported.",
    validity: "Festive season — check the bank's website",
  },
];

/** Last day of the festive campaign window. The page de-indexes itself after this date. */
export const festiveSeasonEndsOn = "2026-12-31";

/**
 * True once `festiveSeasonEndsOn` has passed, taking end of day in IST (UTC+5:30).
 * Guards the seasonal page so a forgotten takedown degrades into a dated notice
 * and a `noindex` rather than a live page of expired offers.
 */
export function festiveSeasonHasEnded(now: Date = new Date()): boolean {
  return now.getTime() > Date.parse(`${festiveSeasonEndsOn}T18:30:00.000Z`);
}
