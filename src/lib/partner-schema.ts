import { z } from "zod";
import { leadFields, hasSalaryIfSalaried, SALARY_REQUIRED } from "./apply-schema";

/** Shared by the partner portal and its API routes. */

/** What a partner submits about a customer. No email, no consent — the customer gives those. */
export const partnerReferralSchema = z
  .object({
    fullName: leadFields.fullName,
    mobile: leadFields.mobile,
    category: leadFields.category,
    loanType: leadFields.loanType,
    amount: leadFields.amount,
    city: leadFields.city,
    employment: leadFields.employment,
    monthlySalary: leadFields.monthlySalary,
    notes: z.string().max(500).optional().default(""),
    // Partner attests they have the customer's permission to share these details.
    partnerAttests: z.boolean().refine((v) => v === true, {
      message: "Please confirm the customer agreed to share their details",
    }),
  })
  .refine(hasSalaryIfSalaried, SALARY_REQUIRED);

export type PartnerReferralInput = z.infer<typeof partnerReferralSchema>;

/** The customer's answer on the confirmation page. */
export const referralDecisionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("confirm"),
    token: z.string().min(20).max(64),
    email: z.union([z.literal(""), z.string().email("Enter a valid email address")]).optional().default(""),
    consent: leadFields.consent,
  }),
  z.object({
    action: z.literal("decline"),
    token: z.string().min(20).max(64),
  }),
]);
