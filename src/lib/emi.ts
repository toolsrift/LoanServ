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
