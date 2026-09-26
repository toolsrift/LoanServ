import { z } from "zod";
import { attributionSchema } from "./attribution";

/** Shared apply-form schema — used by both client validation and the API route. */

export const LOAN_CATEGORIES = [
  "Personal",
  "Business",
  "Home",
  "Car",
  "Education",
  "Mortgage / LAP",
  "Doctor",
  "CA",
  "Overdraft",
  "Other",
] as const;

export const LOAN_TYPES = ["Fresh", "Balance Transfer", "Top-Up", "Other"] as const;

export const CITIES = [
  "Hyderabad",
  "Vijayawada",
  "Visakhapatnam",
  "Bangalore",
  "Chennai",
  "Other",
] as const;

export const EMPLOYMENT_TYPES = ["Salaried", "Self-employed / Business", "Professional"] as const;

export const existingEmiSchema = z.object({
  lender: z.string().max(80).optional().default(""),
  emi: z.string().max(20).optional().default(""),
  outstanding: z.string().max(40).optional().default(""),
});

/**
 * Version of the contact-consent text (see ContactConsentText) the user agreed
 * to. Bump when the wording changes.
 * 2.0 — added explicit consent to an automated (AI) voice callback, which is a
 * separate channel from email/WhatsApp under TRAI rules.
 */
export const CONTACT_CONSENT_VERSION = "2.0";

/**
 * Fields every lead form shares (apply form + chat callback form), kept as a
 * plain shape so each form can build its own object schema from it.
 */
export const leadFields = {
  fullName: z.string().min(2, "Please enter your full name").max(80),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),

  category: z.enum(LOAN_CATEGORIES),
  loanType: z.enum(LOAN_TYPES),
  amount: z.coerce.number().min(10000, "Minimum ₹10,000").max(1000000000),
  city: z.enum(CITIES),
  employment: z.enum(EMPLOYMENT_TYPES),

  // Conditional — salaried
  monthlySalary: z.string().max(20).optional().default(""),

  consent: z.boolean().refine((v) => v === true, { message: "Consent is required to proceed" }),

  // Honeypot — must stay empty.
  company_website: z.string().max(0).optional().default(""),

  // Where the lead came from (lib/attribution). Never fails validation.
  attribution: attributionSchema,
};

/** Salaried applicants must give a salary — shared refinement for every lead schema. */
export function hasSalaryIfSalaried(d: { employment: string; monthlySalary: string }): boolean {
  return d.employment !== "Salaried" || d.monthlySalary.trim().length > 0;
}
export const SALARY_REQUIRED = {
  path: ["monthlySalary"],
  message: "Please enter your monthly net salary",
};

export const applySchema = z
  .object({
    ...leadFields,

    // Conditional — salaried
    employer: z.string().max(120).optional().default(""),
    workLocation: z.string().max(120).optional().default(""),

    // Conditional — self-employed / business
    turnover: z.string().max(30).optional().default(""),
    businessNature: z.string().max(120).optional().default(""),
    businessVintage: z.string().max(20).optional().default(""),

    hasExistingEmis: z.boolean().default(false),
    existingEmis: z.array(existingEmiSchema).max(10).optional().default([]),

    purpose: z.string().max(400).optional().default(""),
    message: z.string().max(1000).optional().default(""),
  })
  .refine(hasSalaryIfSalaried, SALARY_REQUIRED);

export type ApplyInput = z.infer<typeof applySchema>;
