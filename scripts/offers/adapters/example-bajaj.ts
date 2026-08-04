import type { OfferAdapter, DraftOffer } from "./types";

/**
 * EXAMPLE adapter #2 — best-effort, fragile, disabled by default.
 * Same contract as example-hdfc: returns verified:false drafts for human review.
 */
export const bajajAdapter: OfferAdapter = {
  lenderSlug: "bajaj-finserv",
  name: "Bajaj Finserv (example)",
  sourceUrl: "https://www.bajajfinserv.in/personal-loan-interest-rates-and-charges",
  async fetchOffers(): Promise<DraftOffer[]> {
    try {
      // TODO: replace with a real, permitted fetch + parse.
      return [
        {
          lenderSlug: "bajaj-finserv",
          product: "Personal Loan",
          productSlug: "personal",
          roiFrom: undefined,
          sourceUrl: this.sourceUrl,
          verified: false,
          note: "Draft placeholder from example adapter — confirm figures on the official page.",
        },
      ];
    } catch {
      return [];
    }
  },
};
