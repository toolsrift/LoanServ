"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  applySchema,
  LOAN_CATEGORIES,
  LOAN_TYPES,
  CITIES,
  EMPLOYMENT_TYPES,
} from "@/lib/apply-schema";
import { cn } from "@/lib/utils";

type Errors = Record<string, string>;
type EmiRow = { lender: string; emi: string; outstanding: string };

const initial = {
  fullName: "",
  mobile: "",
  email: "",
  category: "Personal",
  loanType: "Fresh",
  amount: "",
  city: "Hyderabad",
  employment: "Salaried",
  monthlySalary: "",
  employer: "",
  workLocation: "",
  turnover: "",
  businessNature: "",
  businessVintage: "",
  hasExistingEmis: false,
  purpose: "",
  message: "",
  consent: false,
  company_website: "",
};

export function ApplyForm({
  presetCategory,
  compact = false,
  onSuccess,
}: {
  presetCategory?: string;
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const [form, setForm] = React.useState({
    ...initial,
    category: presetCategory && LOAN_CATEGORIES.includes(presetCategory as never) ? presetCategory : "Personal",
  });
  const [emiRows, setEmiRows] = React.useState<EmiRow[]>([{ lender: "", emi: "", outstanding: "" }]);
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = React.useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const isSalaried = form.employment === "Salaried";
  const isBusiness = form.employment === "Self-employed / Business" || form.employment === "Professional";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const payload = {
      ...form,
      amount: form.amount,
      consent: form.consent,
      existingEmis: form.hasExistingEmis ? emiRows : [],
    };
    const parsed = applySchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // Focus first error
      const first = Object.keys(fieldErrors)[0];
      const firstEl = document.getElementById(`apply-${first}`);
      firstEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstEl?.focus({ preventScroll: true });
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-mint">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="font-display text-2xl text-ink">Application received</h3>
        <p className="max-w-sm text-slate">
          Thank you, {form.fullName.split(" ")[0] || "there"}. Our loan advisor will call you shortly on{" "}
          <span className="num font-medium">+91 {form.mobile}</span> to discuss your options.
        </p>
        <p className="text-sm text-muted-foreground">
          Meanwhile, explore our{" "}
          <Link href="/calculators/emi-calculator" className="text-evergreen underline">
            EMI calculator
          </Link>{" "}
          or{" "}
          <Link href="/free-cibil-score" className="text-evergreen underline">
            check your CIBIL score
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-7", compact ? "p-0" : "")} noValidate>
      {/* Honeypot — visually hidden, bots fill it */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => set("company_website", e.target.value)}
        />
      </div>

      <Fieldset title="Your contact details" step={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="apply-fullName" required error={errors.fullName}>
            <Input
              id="apply-fullName"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="e.g. Ravi Kumar"
              autoComplete="name"
            />
          </Field>
          <Field label="Mobile number" htmlFor="apply-mobile" required error={errors.mobile} hint="10-digit Indian mobile">
            <Input
              id="apply-mobile"
              inputMode="numeric"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              autoComplete="tel"
              className="num"
            />
          </Field>
        </div>
        <Field label="Email address" htmlFor="apply-email" required error={errors.email}>
          <Input
            id="apply-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
      </Fieldset>

      <Fieldset title="What loan do you need?" step={2}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Loan category" htmlFor="apply-category" required error={errors.category}>
            <NativeSelect id="apply-category" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {LOAN_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Loan type" htmlFor="apply-loanType" required error={errors.loanType}>
            <NativeSelect id="apply-loanType" value={form.loanType} onChange={(e) => set("loanType", e.target.value)}>
              {LOAN_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Loan amount required (₹)" htmlFor="apply-amount" required error={errors.amount}>
            <Input
              id="apply-amount"
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="500000"
              className="num"
            />
          </Field>
          <Field label="City / Location" htmlFor="apply-city" required error={errors.city}>
            <NativeSelect id="apply-city" value={form.city} onChange={(e) => set("city", e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <Field label="Employment type" htmlFor="apply-employment" required error={errors.employment}>
          <NativeSelect
            id="apply-employment"
            value={form.employment}
            onChange={(e) => set("employment", e.target.value)}
          >
            {EMPLOYMENT_TYPES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </Fieldset>

      {isSalaried && (
        <Fieldset title="Employment details" step={3}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Monthly net salary (₹)" htmlFor="apply-monthlySalary" required error={errors.monthlySalary}>
              <Input
                id="apply-monthlySalary"
                inputMode="numeric"
                value={form.monthlySalary}
                onChange={(e) => set("monthlySalary", e.target.value.replace(/[^\d]/g, ""))}
                placeholder="60000"
                className="num"
              />
            </Field>
            <Field label="Company / Employer" htmlFor="apply-employer" error={errors.employer}>
              <Input id="apply-employer" value={form.employer} onChange={(e) => set("employer", e.target.value)} />
            </Field>
          </div>
          <Field label="Work location" htmlFor="apply-workLocation" error={errors.workLocation}>
            <Input
              id="apply-workLocation"
              value={form.workLocation}
              onChange={(e) => set("workLocation", e.target.value)}
              placeholder="e.g. HITEC City, Hyderabad"
            />
          </Field>
        </Fieldset>
      )}

      {isBusiness && (
        <Fieldset title="Business details" step={3}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Annual turnover (₹)" htmlFor="apply-turnover" error={errors.turnover}>
              <Input
                id="apply-turnover"
                inputMode="numeric"
                value={form.turnover}
                onChange={(e) => set("turnover", e.target.value.replace(/[^\d]/g, ""))}
                placeholder="2500000"
                className="num"
              />
            </Field>
            <Field label="Business vintage (years)" htmlFor="apply-businessVintage" error={errors.businessVintage}>
              <Input
                id="apply-businessVintage"
                inputMode="numeric"
                value={form.businessVintage}
                onChange={(e) => set("businessVintage", e.target.value.replace(/[^\d]/g, ""))}
                placeholder="3"
                className="num"
              />
            </Field>
          </div>
          <Field label="Nature of business" htmlFor="apply-businessNature" error={errors.businessNature}>
            <Input
              id="apply-businessNature"
              value={form.businessNature}
              onChange={(e) => set("businessNature", e.target.value)}
              placeholder="e.g. Retail trading, manufacturing, clinic"
            />
          </Field>
        </Fieldset>
      )}

      <Fieldset title="Existing obligations" step={isSalaried || isBusiness ? 4 : 3}>
        <label className="flex items-center gap-3 rounded-xl border border-sand bg-white p-3.5">
          <Checkbox
            checked={form.hasExistingEmis}
            onCheckedChange={(v) => set("hasExistingEmis", Boolean(v))}
            id="apply-hasExistingEmis"
          />
          <span className="text-sm text-slate">I have existing EMIs / loans running</span>
        </label>
        {form.hasExistingEmis && (
          <div className="mt-3 space-y-3">
            {emiRows.map((row, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Input
                  aria-label="Lender name"
                  placeholder="Lender"
                  value={row.lender}
                  onChange={(e) =>
                    setEmiRows((r) => r.map((x, j) => (j === i ? { ...x, lender: e.target.value } : x)))
                  }
                />
                <Input
                  aria-label="EMI amount"
                  placeholder="EMI ₹"
                  className="num"
                  value={row.emi}
                  onChange={(e) =>
                    setEmiRows((r) => r.map((x, j) => (j === i ? { ...x, emi: e.target.value.replace(/[^\d]/g, "") } : x)))
                  }
                />
                <Input
                  aria-label="Outstanding / tenure"
                  placeholder="Outstanding / tenure"
                  value={row.outstanding}
                  onChange={(e) =>
                    setEmiRows((r) => r.map((x, j) => (j === i ? { ...x, outstanding: e.target.value } : x)))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove row"
                  onClick={() => setEmiRows((r) => (r.length > 1 ? r.filter((_, j) => j !== i) : r))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEmiRows((r) => [...r, { lender: "", emi: "", outstanding: "" }])}
            >
              <Plus className="h-4 w-4" /> Add another EMI
            </Button>
          </div>
        )}
      </Fieldset>

      <Fieldset title="Anything else?" step={isSalaried || isBusiness ? 5 : 4}>
        <Field label="Loan purpose / requirement" htmlFor="apply-purpose" error={errors.purpose}>
          <Input
            id="apply-purpose"
            value={form.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            placeholder="e.g. Home renovation, working capital, wedding"
          />
        </Field>
        <Field label="Message (optional)" htmlFor="apply-message" error={errors.message}>
          <Textarea id="apply-message" value={form.message} onChange={(e) => set("message", e.target.value)} rows={3} />
        </Field>
      </Fieldset>

      <div>
        <label className="flex items-start gap-3">
          <Checkbox
            id="apply-consent"
            checked={form.consent}
            onCheckedChange={(v) => set("consent", Boolean(v))}
            className="mt-0.5"
          />
          <span className="text-sm text-slate">
            I agree to be contacted by LoanServ regarding my loan requirement — by phone, WhatsApp
            or email, including an automated AI voice callback — and accept the{" "}
            <Link href="/legal/privacy-policy" className="text-evergreen underline" target="_blank">
              Privacy Policy
            </Link>
            . I understand LoanServ is a DSA facilitator, not a lender.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-xs font-medium text-red-600">{errors.consent}</p>}
      </div>

      {serverError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit application"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We never ask for Aadhaar, PAN, or bank details on this form. Your data is used only to contact you.
      </p>
    </form>
  );
}

function Fieldset({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 flex items-center gap-2.5 font-display text-lg text-ink">
        <span className="num grid h-7 w-7 place-items-center rounded-full bg-evergreen/10 text-sm font-semibold text-evergreen">
          {step}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
