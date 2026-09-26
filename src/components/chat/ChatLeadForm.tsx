"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactConsentText } from "@/components/apply/ContactConsentText";
import { LOAN_CATEGORIES, LOAN_TYPES, CITIES, EMPLOYMENT_TYPES } from "@/lib/apply-schema";
import { chatLeadSchema, type ChatMessage, type LeadPrefill } from "@/lib/chat-schema";
import { getAttribution } from "@/lib/attribution";
import { trackLead } from "@/lib/track";

type Errors = Record<string, string>;

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
  consent: false,
  company_website: "",
};
type FormState = typeof initial;

/**
 * Short callback form shown inside the chat panel. Loan details are pre-filled
 * from the conversation where the assistant picked them up; contact details
 * are always typed by the visitor and never pass through the AI model.
 */
export function ChatLeadForm({
  transcript,
  onSubmitted,
  onCancel,
  onOpenFullForm,
}: {
  transcript: ChatMessage[];
  onSubmitted: (lead: { firstName: string; mobile: string }) => void;
  onCancel: () => void;
  onOpenFullForm: (category: string) => void;
}) {
  const [form, setForm] = React.useState<FormState>(initial);
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = React.useState("");
  const [prefilled, setPrefilled] = React.useState(false);
  // Fields the visitor has edited — pre-fill must never overwrite their input.
  const touched = React.useRef(new Set<string>());

  const set = (k: keyof FormState, v: string | boolean) => {
    touched.current.add(k);
    setForm((f) => ({ ...f, [k]: v }));
  };

  // Transcript is captured once, when the form opens.
  const initialTranscript = React.useRef(transcript);
  React.useEffect(() => {
    const messages = initialTranscript.current.slice(-40);
    if (!messages.some((m) => m.role === "user")) return;
    const ctrl = new AbortController();
    fetch("/api/chat/prefill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<LeadPrefill>) : ({} as LeadPrefill)))
      .then((p) => {
        const updates: Partial<FormState> = {};
        if (p.category) updates.category = p.category;
        if (p.loanType) updates.loanType = p.loanType;
        if (p.amount) updates.amount = String(p.amount);
        if (p.city) updates.city = p.city;
        if (p.employment) updates.employment = p.employment;
        if (p.monthlySalary) updates.monthlySalary = String(p.monthlySalary);
        const fresh: Partial<FormState> = {};
        for (const k of Object.keys(updates) as (keyof FormState)[]) {
          if (!touched.current.has(k)) Object.assign(fresh, { [k]: updates[k] });
        }
        if (!Object.keys(fresh).length) return;
        setForm((f) => ({ ...f, ...fresh }));
        setPrefilled(true);
      })
      .catch(() => {
        /* pre-fill is optional */
      });
    return () => ctrl.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const parsed = chatLeadSchema.safeParse({
      ...form,
      transcript: transcript.slice(-40),
      attribution: getAttribution(),
    });
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      document.getElementById(`chat-${Object.keys(fieldErrors)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      trackLead("chat", form.category);
      onSubmitted({ firstName: form.fullName.trim().split(" ")[0], mobile: form.mobile });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  const isSalaried = form.employment === "Salaried";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-sm">
      <div>
        <h3 className="font-display text-lg text-ink">Request a callback</h3>
        <p className="mt-1 text-slate">
          A LoanServ advisor will call you to go through your options — free, no obligation.
        </p>
        {prefilled && (
          <p className="mt-2 rounded-lg bg-mint/10 px-3 py-2 text-xs text-evergreen">
            We&apos;ve filled in loan details from our chat — please check them.
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, bots fill it */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="chat-company_website">Company website</label>
        <input
          id="chat-company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => set("company_website", e.target.value)}
        />
      </div>

      <Field label="Full name" htmlFor="chat-fullName" required error={errors.fullName}>
        <Input
          id="chat-fullName"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          autoComplete="name"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Mobile" htmlFor="chat-mobile" required error={errors.mobile}>
          <Input
            id="chat-mobile"
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
            placeholder="9876543210"
            autoComplete="tel"
            className="num"
          />
        </Field>
        <Field label="Email" htmlFor="chat-email" required error={errors.email}>
          <Input
            id="chat-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Loan" htmlFor="chat-category" required error={errors.category}>
          <NativeSelect id="chat-category" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {LOAN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Type" htmlFor="chat-loanType" required error={errors.loanType}>
          <NativeSelect id="chat-loanType" value={form.loanType} onChange={(e) => set("loanType", e.target.value)}>
            {LOAN_TYPES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Amount (₹)" htmlFor="chat-amount" required error={errors.amount}>
          <Input
            id="chat-amount"
            inputMode="numeric"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value.replace(/[^\d]/g, ""))}
            placeholder="500000"
            className="num"
          />
        </Field>
        <Field label="City" htmlFor="chat-city" required error={errors.city}>
          <NativeSelect id="chat-city" value={form.city} onChange={(e) => set("city", e.target.value)}>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Employment"
          htmlFor="chat-employment"
          required
          error={errors.employment}
          className={isSalaried ? "" : "col-span-2"}
        >
          <NativeSelect
            id="chat-employment"
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
        {isSalaried && (
          <Field label="Net salary / mo (₹)" htmlFor="chat-monthlySalary" required error={errors.monthlySalary}>
            <Input
              id="chat-monthlySalary"
              inputMode="numeric"
              value={form.monthlySalary}
              onChange={(e) => set("monthlySalary", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="60000"
              className="num"
            />
          </Field>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3">
          <Checkbox
            id="chat-consent"
            checked={form.consent}
            onCheckedChange={(v) => set("consent", Boolean(v))}
            className="mt-0.5"
          />
          <ContactConsentText />
        </label>
        {errors.consent && <p className="mt-1 text-xs font-medium text-red-600">{errors.consent}</p>}
      </div>

      {serverError && <p className="rounded-xl bg-red-50 px-4 py-3 text-red-700">{serverError}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Back to chat
        </Button>
        <Button type="submit" variant="primary" className="flex-[2]" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Request callback"
          )}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Prefer more detail?{" "}
        <button
          type="button"
          onClick={() => onOpenFullForm(form.category)}
          className="text-evergreen underline underline-offset-2"
        >
          Open the full application
        </button>
      </p>
    </form>
  );
}
