/**
 * Lender benchmark lending rates (MCLR / RLLR) as reported in the press.
 * These are benchmarks, not the rate a borrower is offered. Each entry must cite a source
 * and should be re-checked against the lender's official rate page before updating.
 */

export interface BenchmarkRow {
  tenor: string;
  previous: number;
  current: number;
}

export interface BenchmarkTable {
  lenderSlug: string;
  benchmark: "MCLR" | "RLLR" | "EBLR";
  effectiveFrom: string; // ISO date
  effectiveLabel: string;
  summary: string;
  rows: BenchmarkRow[];
  sourceName: string;
  sourceUrl: string;
}

export const benchmarkTables: BenchmarkTable[] = [
  {
    lenderSlug: "hdfc-bank",
    benchmark: "MCLR",
    effectiveFrom: "2026-10-07",
    effectiveLabel: "7 October 2026",
    summary:
      "HDFC Bank cut its MCLR by 5–15 basis points across tenors, even though the RBI raised the repo rate to 5.50% the same day. The cut helps only MCLR-linked loans, at their next reset date. Repo-linked loans don't change when MCLR changes.",
    rows: [
      { tenor: "Overnight", previous: 7.9, current: 7.8 },
      { tenor: "1 month", previous: 7.9, current: 7.75 },
      { tenor: "3 months", previous: 8.05, current: 7.95 },
      { tenor: "6 months", previous: 8.25, current: 8.15 },
      { tenor: "1 year", previous: 8.35, current: 8.3 },
      { tenor: "2 years", previous: 8.45, current: 8.4 },
      { tenor: "3 years", previous: 8.6, current: 8.55 },
    ],
    sourceName: "Business Standard, 8 Oct 2026",
    sourceUrl:
      "https://www.business-standard.com/finance/personal-finance/hdfc-bank-cuts-mclr-rates-by-up-to-15-bps-check-impact-on-your-loans-126100800515_1.html",
  },
];

export function getBenchmarkTables(lenderSlug: string): BenchmarkTable[] {
  return benchmarkTables.filter((t) => t.lenderSlug === lenderSlug);
}
