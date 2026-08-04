// Monthly offers refresh — SAFE part (always runs).
//  (a) Bumps the visible month label on every published (verified) offer + _meta.
//  (b) Does NOT fetch or publish any unverified data. The optional scrape step
//      lives in run-adapters.ts and writes drafts only, gated by ENABLE_OFFER_SCRAPER.
// Usage: node scripts/offers/update-offers.mjs ["August 2026"]
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "data", "offers");
const monthLabel =
  process.argv[2] || new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const today = new Date().toISOString().slice(0, 10);

if (!fs.existsSync(OUT)) {
  console.error("No data/offers directory. Run generate-seed.mjs first.");
  process.exit(1);
}

const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
let updated = 0;

for (const file of files) {
  const p = path.join(OUT, file);
  const records = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const r of records) {
    // Only bump the label on records already marked verified by a human.
    // Unverified records keep their existing month so they never silently "go live".
    if (r.verified) {
      r.month = monthLabel;
      r.lastUpdated = today;
      updated++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(records, null, 2));
}

fs.writeFileSync(
  path.join(OUT, "_meta.json"),
  JSON.stringify({ month: monthLabel, lastUpdated: today }, null, 2),
);

const summary = `## Monthly offers refresh — ${monthLabel}

- Bumped month label to **${monthLabel}** on ${updated} verified offer record(s).
- Unverified records were left untouched (they are not published as current).

### Owner action needed
Review any drafts in \`data/offers/_drafts.json\` (if the scraper ran), confirm figures against each lender's official page, set \`verified: true\`, and commit.
`;
fs.writeFileSync(path.join(OUT, "_changes.md"), summary);
console.log(summary);
