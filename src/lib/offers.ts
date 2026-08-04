import fs from "node:fs";
import path from "node:path";

/** One lender × product offer record. Mirrors data/offers/<lender-slug>.json entries. */
export interface Offer {
  lender: string;
  lenderSlug: string;
  product: string;
  productSlug: string;
  roiFrom: number;
  roiTo: number;
  processingFee: string;
  tenure: string;
  preclosureCharges: string;
  foreclosureCharges: string;
  insuranceNotes: string;
  specialOffer: string;
  sourceUrl: string;
  month: string;
  lastUpdated: string;
  verified: boolean;
}

export interface OffersMeta {
  month: string;
  lastUpdated: string;
}

const OFFERS_DIR = path.join(process.cwd(), "data", "offers");

export function getOffersMeta(): OffersMeta {
  const metaPath = path.join(OFFERS_DIR, "_meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      return JSON.parse(fs.readFileSync(metaPath, "utf8")) as OffersMeta;
    } catch {
      /* fall through */
    }
  }
  return { month: "This Month", lastUpdated: "" };
}

/** Load every offer record across all lender files. */
export function getAllOffers(): Offer[] {
  if (!fs.existsSync(OFFERS_DIR)) return [];
  const files = fs.readdirSync(OFFERS_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const all: Offer[] = [];
  for (const file of files) {
    try {
      const records = JSON.parse(fs.readFileSync(path.join(OFFERS_DIR, file), "utf8")) as Offer[];
      all.push(...records);
    } catch {
      /* skip malformed file */
    }
  }
  return all;
}

export function getLenderOffers(lenderSlug: string): Offer[] {
  return getAllOffers().filter((o) => o.lenderSlug === lenderSlug);
}

export function getLenderProductOffer(lenderSlug: string, productSlug: string): Offer | undefined {
  return getAllOffers().find((o) => o.lenderSlug === lenderSlug && o.productSlug === productSlug);
}

/** Distinct lender slugs that have at least one offer. */
export function offerLenderSlugs(): string[] {
  return [...new Set(getAllOffers().map((o) => o.lenderSlug))];
}
