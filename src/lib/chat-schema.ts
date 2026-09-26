import { z } from "zod";
import {
  leadFields,
  hasSalaryIfSalaried,
  SALARY_REQUIRED,
  LOAN_CATEGORIES,
  LOAN_TYPES,
  CITIES,
  EMPLOYMENT_TYPES,
} from "./apply-schema";

/** Shared chat-assistant schemas — used by the widget and the API routes. */

/** Longest message a visitor can type into the chat box. */
export const CHAT_INPUT_MAX = 1000;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  // Assistant turns echo back model output, which can run longer than user input.
  content: z.string().trim().min(1).max(4000),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(40)
    .refine((m) => m[m.length - 1].role === "user", "The last message must be from the user")
    .refine(
      (m) => m.every((x) => x.role !== "user" || x.content.length <= CHAT_INPUT_MAX),
      "Message too long",
    ),
});

/** Any saved conversation (e.g. for form pre-fill) — no constraint on who spoke last. */
export const chatTranscriptSchema = z.object({
  messages: z.array(chatMessageSchema).max(40),
});

export type ChatSource = { title: string; url: string };

export type ChatResponse = {
  reply: string;
  sources: ChatSource[];
  /** The model judged the visitor wants to apply / be called — show the callback form. */
  offerLeadForm: boolean;
};

/** Callback form inside the chat: the apply form's core fields + the chat so far. */
export const chatLeadSchema = z
  .object({
    ...leadFields,
    transcript: z.array(chatMessageSchema).max(40).optional().default([]),
  })
  .refine(hasSalaryIfSalaried, SALARY_REQUIRED);

export type ChatLeadInput = z.infer<typeof chatLeadSchema>;

/**
 * Fields the assistant may pre-fill in the callback form from the conversation.
 * Every field is optional and anything invalid is dropped, never an error.
 * Contact details are never pre-filled — the visitor types those themselves.
 */
export const leadPrefillSchema = z.object({
  category: z.enum(LOAN_CATEGORIES).optional().catch(undefined),
  loanType: z.enum(LOAN_TYPES).optional().catch(undefined),
  amount: z.coerce.number().int().min(10000).max(1000000000).optional().catch(undefined),
  city: z.enum(CITIES).optional().catch(undefined),
  employment: z.enum(EMPLOYMENT_TYPES).optional().catch(undefined),
  monthlySalary: z.coerce.number().int().min(1000).max(100000000).optional().catch(undefined),
});

export type LeadPrefill = z.infer<typeof leadPrefillSchema>;
