/** Investment, savings and tax math for the calculator suite. All verified formulas. */

/** SIP future value (annuity due-ish, monthly compounding): M = P·[((1+i)^n − 1)/i]·(1+i). */
export function sipFutureValue(monthly: number, annualRatePct: number, years: number) {
  const i = annualRatePct / 12 / 100;
  const n = years * 12;
  const invested = monthly * n;
  const fv = i === 0 ? invested : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  return { invested: Math.round(invested), futureValue: Math.round(fv), gains: Math.round(fv - invested) };
}

/** Lumpsum future value with annual compounding: A = P(1+r)^t. */
export function lumpsumFutureValue(principal: number, annualRatePct: number, years: number) {
  const fv = principal * Math.pow(1 + annualRatePct / 100, years);
  return { invested: Math.round(principal), futureValue: Math.round(fv), gains: Math.round(fv - principal) };
}

/** FD maturity with quarterly compounding (standard Indian bank convention). */
export function fdMaturity(principal: number, annualRatePct: number, years: number) {
  const n = 4;
  const fv = principal * Math.pow(1 + annualRatePct / 100 / n, n * years);
  return { invested: Math.round(principal), futureValue: Math.round(fv), gains: Math.round(fv - principal) };
}

/** RD maturity — monthly deposit, quarterly compounding approximation. */
export function rdMaturity(monthly: number, annualRatePct: number, years: number) {
  const n = years * 12;
  const i = annualRatePct / 4 / 100; // quarterly rate
  let maturity = 0;
  for (let m = 1; m <= n; m++) {
    const quartersRemaining = (n - m + 1) / 3;
    maturity += monthly * Math.pow(1 + i, quartersRemaining);
  }
  const invested = monthly * n;
  return { invested: Math.round(invested), futureValue: Math.round(maturity), gains: Math.round(maturity - invested) };
}

/** PPF — yearly deposit, annual compounding for a chosen number of years. */
export function ppfMaturity(yearly: number, annualRatePct: number, years: number) {
  let balance = 0;
  for (let y = 0; y < years; y++) {
    balance = (balance + yearly) * (1 + annualRatePct / 100);
  }
  const invested = yearly * years;
  return { invested: Math.round(invested), futureValue: Math.round(balance), gains: Math.round(balance - invested) };
}

/** Generic compound interest: A = P(1+r/n)^(nt). */
export function compoundInterest(principal: number, annualRatePct: number, years: number, timesPerYear = 1) {
  const fv = principal * Math.pow(1 + annualRatePct / 100 / timesPerYear, timesPerYear * years);
  return { invested: Math.round(principal), futureValue: Math.round(fv), gains: Math.round(fv - principal) };
}

/**
 * Simplified income tax — New Regime FY 2025-26 slabs (illustrative).
 * 0-4L: 0%, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, 24L+: 30%.
 * Includes ₹75,000 standard deduction for salaried and a §87A rebate up to ₹12L taxable.
 */
export function incomeTaxNewRegime(grossIncome: number, isSalaried = true) {
  const std = isSalaried ? 75000 : 0;
  const taxable = Math.max(0, grossIncome - std);
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ] as const;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxable > prev) {
      tax += (Math.min(taxable, limit) - prev) * rate;
      prev = limit;
    } else break;
  }
  // §87A rebate: no tax if taxable income ≤ ₹12,00,000
  if (taxable <= 1200000) tax = 0;
  const cess = tax * 0.04;
  return { taxable: Math.round(taxable), tax: Math.round(tax), cess: Math.round(cess), total: Math.round(tax + cess) };
}

/** HRA exemption = least of (actual HRA, rent − 10% basic, 50%/40% of basic). */
export function hraExemption(basic: number, hraReceived: number, rentPaid: number, isMetro: boolean) {
  const a = hraReceived;
  const b = Math.max(0, rentPaid - 0.1 * basic);
  const c = (isMetro ? 0.5 : 0.4) * basic;
  const exempt = Math.max(0, Math.min(a, b, c));
  return { exempt: Math.round(exempt), taxable: Math.round(Math.max(0, hraReceived - exempt)) };
}

/** GST — add or remove GST from an amount at a given rate. */
export function gstCalc(amount: number, ratePct: number, mode: "add" | "remove") {
  if (mode === "add") {
    const gst = (amount * ratePct) / 100;
    return { base: Math.round(amount), gst: Math.round(gst), total: Math.round(amount + gst) };
  }
  const base = (amount * 100) / (100 + ratePct);
  return { base: Math.round(base), gst: Math.round(amount - base), total: Math.round(amount) };
}
