// Generates seed offer JSON for the current month for every lender.
// Also used as the base the monthly workflow bumps. Figures are INDICATIVE.
// Usage: node scripts/offers/generate-seed.mjs "July 2026"
import fs from "node:fs";
import path from "node:path";

const monthLabel = process.argv[2] || new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const today = new Date().toISOString().slice(0, 10);

const OUT = path.join(process.cwd(), "data", "offers");
fs.mkdirSync(OUT, { recursive: true });

// lenderSlug, name, type, and the products to seed
const LENDERS = [
  ["hdfc-bank", "HDFC Bank", "Bank", ["personal", "home", "business", "lap", "car"]],
  ["icici-bank", "ICICI Bank", "Bank", ["personal", "home", "business", "lap", "car"]],
  ["axis-bank", "Axis Bank", "Bank", ["personal", "home", "business", "lap", "car"]],
  ["kotak-mahindra-bank", "Kotak Mahindra Bank", "Bank", ["personal", "home", "business", "car"]],
  ["indusind-bank", "IndusInd Bank", "Bank", ["personal", "home", "business"]],
  ["yes-bank", "Yes Bank", "Bank", ["personal", "business", "lap"]],
  ["idfc-first-bank", "IDFC First Bank", "Bank", ["personal", "home", "business", "car"]],
  ["bandhan-bank", "Bandhan Bank", "Bank", ["personal", "business", "home"]],
  ["bajaj-finserv", "Bajaj Finserv", "NBFC", ["personal", "business", "lap", "doctor"]],
  ["tata-capital", "Tata Capital", "NBFC", ["personal", "business", "lap", "home"]],
  ["aditya-birla-finance", "Aditya Birla Finance", "NBFC", ["personal", "business", "lap"]],
  ["poonawalla-fincorp", "Poonawalla Fincorp", "NBFC", ["personal", "business", "doctor"]],
  ["cholamandalam", "Cholamandalam", "NBFC", ["business", "lap", "car"]],
  ["lt-finance", "L&T Finance", "NBFC", ["personal", "business", "car"]],
  ["muthoot-finance", "Muthoot Finance", "NBFC", ["personal", "business"]],
  ["utkarsh-small-finance-bank", "Utkarsh Small Finance Bank", "Small Finance Bank", ["personal", "business"]],
];

const PRODUCTS = {
  personal: { name: "Personal Loan", roi: [10.5, 24], tenure: "12–72 months" },
  home: { name: "Home Loan", roi: [8.4, 10.75], tenure: "Up to 30 years" },
  business: { name: "Business Loan", roi: [14, 26], tenure: "12–60 months" },
  lap: { name: "Loan Against Property", roi: [9, 14], tenure: "Up to 15 years" },
  car: { name: "Car Loan", roi: [8.7, 13], tenure: "12–84 months" },
  doctor: { name: "Doctor Loan", roi: [11, 18], tenure: "12–72 months" },
};

// deterministic tiny jitter so lenders differ slightly
function jitter(seed, base, spread) {
  const x = Math.sin(seed) * 10000;
  return +(base + (x - Math.floor(x)) * spread).toFixed(2);
}

let count = 0;
LENDERS.forEach(([slug, name, type, products], li) => {
  const records = products.map((pKey, pi) => {
    const p = PRODUCTS[pKey];
    const roiFrom = jitter(li * 7 + pi, p.roi[0], 0.6);
    const roiTo = p.roi[1];
    return {
      lender: name,
      lenderSlug: slug,
      product: p.name,
      productSlug: pKey,
      roiFrom,
      roiTo,
      processingFee: pKey === "home" ? "Up to 0.50% + GST" : "Up to 2% + GST",
      tenure: p.tenure,
      preclosureCharges: type === "Bank" && pKey === "home" ? "Nil (floating rate)" : "2–4% of outstanding",
      foreclosureCharges: pKey === "home" ? "Nil for floating-rate individual borrowers" : "Up to 4% + GST (after lock-in)",
      insuranceNotes: "Optional loan-protection insurance may be offered; not mandatory.",
      specialOffer: pi === 0 ? `Festive processing-fee waiver (indicative) for select ${name} customers` : "",
      sourceUrl: "https://www." + slug.replace(/-/g, "") + ".com",
      month: monthLabel,
      lastUpdated: today,
      verified: false, // seed data is unverified until the owner confirms
    };
  });
  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(records, null, 2));
  count += records.length;
});

fs.writeFileSync(
  path.join(OUT, "_meta.json"),
  JSON.stringify({ month: monthLabel, lastUpdated: today }, null, 2),
);

console.log(`Seeded ${count} offers across ${LENDERS.length} lenders for ${monthLabel}.`);
