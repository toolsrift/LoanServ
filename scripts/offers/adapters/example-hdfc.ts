import type { OfferAdapter, DraftOffer } from "./types";

/**
 * EXAMPLE adapter — best-effort, fragile, disabled by default.
 *
 * This is a template showing HOW you would wire a legitimate source (an official
 * rate page or API the lender provides). It intentionally does NOT scrape by
 * default — it returns a single illustrative draft so you can see the flow.
 * Replace the body with a real fetch + parse against a source you are permitted
 * to use. Everything it returns is verified:false and needs human review.
 */
export const hdfcAdapter: OfferAdapter = {
  lenderSlug: "hdfc-bank",
  name: "HDFC Bank (example)",
  sourceUrl: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan/rates-fees",
  async fetchOffers(): Promise<DraftOffer[]> {
    try {
      // TODO: real implementation, e.g.:
      // const res = await fetch(this.sourceUrl, { headers: { "User-Agent": "LoanServ/1.0" } });
      // const html = await res.text();
      // parse the official rates table here...
      return [
        {
          lenderSlug: "hdfc-bank",
          product: "Personal Loan",
          productSlug: "personal",
          roiFrom: undefined, // left undefined — must be confirmed by a human
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
