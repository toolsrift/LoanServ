import { z } from "zod";

/** Consent-based free credit-score check. PAN/DOB are sensitive — handled with care. */
export const cibilSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(80),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  pan: z
    .string()
    .transform((s) => s.toUpperCase().trim())
    .pipe(z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN (e.g. ABCDE1234F)")),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth as YYYY-MM-DD")
    .refine(
      (s) => {
        const [y, m, day] = s.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, day));
        // Reject impossible calendar dates (e.g. 2023-02-31 rolls over).
        if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== day) {
          return false;
        }
        const now = new Date();
        if (dt.getTime() > now.getTime()) return false; // no future dates
        // Age in whole years.
        let age = now.getUTCFullYear() - y;
        const beforeBirthday =
          now.getUTCMonth() < m - 1 || (now.getUTCMonth() === m - 1 && now.getUTCDate() < day);
        if (beforeBirthday) age -= 1;
        return age >= 18 && age <= 100;
      },
      { message: "You must be between 18 and 100 years old" }
    ),
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required to check your score" }),
  company_website: z.string().max(0).optional().default(""), // honeypot
});

export type CibilInput = z.infer<typeof cibilSchema>;
