import { z } from "zod";

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

export const applySchema = z
  .object({
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

    consent: z.boolean().refine((v) => v === true, { message: "Consent is required to proceed" }),

    // Honeypot — must stay empty.
    company_website: z.string().max(0).optional().default(""),
  })
  .refine((d) => d.employment !== "Salaried" || d.monthlySalary.trim().length > 0, {
    path: ["monthlySalary"],
    message: "Please enter your monthly net salary",
  });

export type ApplyInput = z.infer<typeof applySchema>;
