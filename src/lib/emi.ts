/**
 * Reducing-balance EMI math. Verified against the standard formula:
 *   EMI = P·r·(1+r)^n / ((1+r)^n − 1)
 * where r = monthly rate = annualRate/12/100, n = tenure in months.
 */

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayable: number;
  principal: number;
}

export function calculateEmi(principal: number, annualRate: number, tenureMonths: number): EmiResult {
  const p = Math.max(0, principal);
  const n = Math.max(1, Math.round(tenureMonths));
  const r = annualRate / 12 / 100;

  let emi: number;
  if (r === 0) {
    emi = p / n;
  } else {
    const pow = Math.pow(1 + r, n);
    emi = (p * r * pow) / (pow - 1);
  }
  const totalPayable = emi * n;
  const totalInterest = totalPayable - p;
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    principal: Math.round(p),
  };
}

export interface AmortRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

/** Yearly amortization schedule for charts/tables. */
export function amortizationByYear(principal: number, annualRate: number, tenureMonths: number): AmortRow[] {
  const r = annualRate / 12 / 100;
  const { emi } = calculateEmi(principal, annualRate, tenureMonths);
  let balance = principal;
  const rows: AmortRow[] = [];
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalComponent = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalComponent);
    yearPrincipal += principalComponent;
    yearInterest += interest;

    if (month % 12 === 0 || month === tenureMonths) {
      rows.push({
        year: Math.ceil(month / 12),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        balance: Math.round(balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }
  return rows;
}

/** Balance-transfer savings: compare remaining cost on old vs new rate. */
export function balanceTransferSavings(
  outstanding: number,
  oldRate: number,
  newRate: number,
  remainingMonths: number,
  processingFeePct = 0,
) {
  const oldEmi = calculateEmi(outstanding, oldRate, remainingMonths);
  const newEmi = calculateEmi(outstanding, newRate, remainingMonths);
  const processingFee = (outstanding * processingFeePct) / 100;
  const grossSavings = oldEmi.totalPayable - newEmi.totalPayable;
  const netSavings = grossSavings - processingFee;
  return {
    oldEmi: oldEmi.emi,
    newEmi: newEmi.emi,
    monthlySaving: oldEmi.emi - newEmi.emi,
    grossSavings: Math.round(grossSavings),
    processingFee: Math.round(processingFee),
    netSavings: Math.round(netSavings),
  };
}

/**
 * Months needed to repay `principal` at `annualRate` with a fixed `emi`.
 * Returns Infinity when the EMI does not cover the monthly interest (the loan never closes).
 *   n = −ln(1 − P·r/E) / ln(1 + r)
 */
export function tenureForEmi(principal: number, annualRate: number, emi: number): number {
  const p = Math.max(0, principal);
  if (p === 0) return 0;
  if (emi <= 0) return Infinity;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.ceil(p / emi);
  const x = 1 - (p * r) / emi;
  if (x <= 0) return Infinity;
  return Math.ceil(-Math.log(x) / Math.log(1 + r));
}

export interface PayoffResult {
  months: number;
  totalInterest: number;
  /** false when the EMI never covers the interest */
  closes: boolean;
}

/** Month-by-month payoff of a balance at a fixed EMI (capped at 600 months). */
export function payoff(balance: number, annualRate: number, emi: number): PayoffResult {
  const r = annualRate / 12 / 100;
  let b = Math.max(0, balance);
  let interest = 0;
  let months = 0;
  // Ignore rounding dust smaller than ₹1 per ₹1,000 of EMI so a rounded EMI doesn't add a phantom month.
  const dust = Math.max(1, emi / 1000);
  while (b > dust && months < 600) {
    const i = b * r;
    if (emi <= i) return { months: Infinity, totalInterest: Infinity, closes: false };
    interest += i;
    b = Math.max(0, b + i - emi); // final instalment is only what is owed
    months++;
  }
  if (b > dust) return { months: Infinity, totalInterest: Infinity, closes: false };
  return { months, totalInterest: Math.round(interest), closes: true };
}
