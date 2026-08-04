/**
 * Optional, best-effort scrape step. Runs ONLY when ENABLE_OFFER_SCRAPER=true.
 * Writes drafts to data/offers/_drafts.json as verified:false. NEVER publishes to
 * production offer files. A human must review and flip verified:true.
 *
 * Run with: npx tsx scripts/offers/run-adapters.ts
 */
import fs from "node:fs";
import path from "node:path";
import { hdfcAdapter } from "./adapters/example-hdfc";
import { bajajAdapter } from "./adapters/example-bajaj";
import type { OfferAdapter, DraftOffer } from "./adapters/types";

async function main() {
  if (process.env.ENABLE_OFFER_SCRAPER !== "true") {
    console.log("ENABLE_OFFER_SCRAPER is not 'true' — scrape step skipped (safe default).");
    return;
  }

  const adapters: OfferAdapter[] = [hdfcAdapter, bajajAdapter];
  const drafts: DraftOffer[] = [];

  for (const adapter of adapters) {
    try {
      const result = await adapter.fetchOffers();
      console.log(`[${adapter.name}] returned ${result.length} draft(s).`);
      drafts.push(...result);
    } catch (err) {
      console.warn(`[${adapter.name}] failed:`, err instanceof Error ? err.message : err);
    }
  }

  const OUT = path.join(process.cwd(), "data", "offers");
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "_drafts.json"), JSON.stringify(drafts, null, 2));
  console.log(`Wrote ${drafts.length} draft(s) to data/offers/_drafts.json (verified:false — review required).`);
}

main();
