/**
 * Offer fetch adapter interface.
 *
 * Adapters are BEST-EFFORT and FRAGILE by design: lender websites change without
 * notice. Any data an adapter returns is written as `verified: false` DRAFT only
 * and must be reviewed by a human before it is published. The whole scrape step
 * is disabled unless ENABLE_OFFER_SCRAPER=true.
 */

export interface DraftOffer {
  lenderSlug: string;
  product: string;
  productSlug: string;
  roiFrom?: number;
  roiTo?: number;
  processingFee?: string;
  sourceUrl: string;
  /** always false — drafts are never auto-verified */
  verified: false;
  note?: string;
}

export interface OfferAdapter {
  lenderSlug: string;
  name: string;
  /** where the data legitimately comes from (official rate page / RSS / API) */
  sourceUrl: string;
  /** Return draft offers, or [] on any failure. Never throw. */
  fetchOffers(): Promise<DraftOffer[]>;
}
