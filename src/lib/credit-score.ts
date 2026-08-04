import "server-only";
import type { CibilInput } from "./cibil-schema";

/**
 * Credit-score provider adapter.
 *
 * TODO: Real score retrieval requires a paid, licensed bureau/partner agreement
 * (CIBIL/TransUnion, Experian, Equifax, CRIF) and compliance with India's Credit
 * Information Companies (Regulation) Act, user consent and data-protection rules.
 * It cannot be self-hosted for free. Until CREDIT_BUREAU_API_URL / _API_KEY are
 * set, the feature degrades to a consented lead (emailed like the apply form).
 */
export interface CreditScoreResult {
  configured: boolean;
  score?: number;
  band?: string;
}

export function isCreditBureauConfigured(): boolean {
  return Boolean(process.env.CREDIT_BUREAU_API_URL && process.env.CREDIT_BUREAU_API_KEY);
}

export async function fetchCreditScore(input: CibilInput): Promise<CreditScoreResult> {
  if (!isCreditBureauConfigured()) {
    return { configured: false };
  }

  // TODO: Implement the real provider call against your bureau/partner agreement.
  // Example shape (do NOT log PAN/DOB):
  //   const res = await fetch(process.env.CREDIT_BUREAU_API_URL!, {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${process.env.CREDIT_BUREAU_API_KEY}`, "Content-Type": "application/json" },
  //     body: JSON.stringify({ pan: input.pan, dob: input.dob, name: input.fullName, mobile: input.mobile }),
  //   });
  //   const data = await res.json();
  //   return { configured: true, score: data.score, band: bandFor(data.score) };

  void input;
  // Not implemented yet even though env is set — treat as unconfigured to stay safe.
  return { configured: false };
}

export function scoreBand(score: number): string {
  if (score >= 800) return "Excellent";
  if (score >= 750) return "Very good";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 550) return "Needs work";
  return "Poor";
}
