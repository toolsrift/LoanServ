"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { cibilSchema } from "@/lib/cibil-schema";

type Errors = Record<string, string>;

export function CibilForm() {
  const [form, setForm] = React.useState({
    fullName: "",
    mobile: "",
    email: "",
    pan: "",
    dob: "",
    consent: false,
    company_website: "",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [result, setResult] = React.useState<{ mode?: string; score?: number; band?: string }>({});
  const [serverError, setServerError] = React.useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = cibilSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as string;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/cibil-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-mint">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        {result.mode === "score" && result.score ? (
          <>
            <h3 className="font-display text-2xl text-ink">Your credit score</h3>
            <p className="num text-5xl font-semibold text-evergreen">{result.score}</p>
            <p className="text-slate">{result.band}</p>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl text-ink">Request received</h3>
            <p className="max-w-sm text-slate">
              Thanks, {form.fullName.split(" ")[0] || "there"}. With your consent, we&apos;ll retrieve your credit report
              and share it with you shortly on <span className="num">+91 {form.mobile}</span>.
            </p>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          Your PAN &amp; date of birth are treated as sensitive and are not stored unnecessarily. See our{" "}
          <Link href="/legal/data-policy" className="text-evergreen underline">
            Data &amp; Privacy Policy
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="absolute left-[-9999px]" aria-hidden>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => set("company_website", e.target.value)}
        />
      </div>

      <Field label="Full name (as per PAN)" htmlFor="c-name" required error={errors.fullName}>
        <Input id="c-name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile number" htmlFor="c-mobile" required error={errors.mobile}>
          <Input
            id="c-mobile"
            inputMode="numeric"
            maxLength={10}
            className="num"
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
            autoComplete="tel"
          />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={errors.email}>
          <Input id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PAN" htmlFor="c-pan" required error={errors.pan} hint="Format: ABCDE1234F">
          <Input
            id="c-pan"
            className="num uppercase"
            maxLength={10}
            value={form.pan}
            onChange={(e) => set("pan", e.target.value.toUpperCase())}
          />
        </Field>
        <Field label="Date of birth" htmlFor="c-dob" required error={errors.dob}>
          <Input id="c-dob" type="date" className="num" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
        </Field>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-sand bg-white p-3.5">
        <Checkbox id="c-consent" checked={form.consent} onCheckedChange={(v) => set("consent", Boolean(v))} className="mt-0.5" />
        <span className="text-sm text-slate">
          I authorise LoanServ and its partner to perform a soft enquiry to retrieve my credit score/report, and I
          accept the{" "}
          <Link href="/legal/data-policy" className="text-evergreen underline" target="_blank">
            Data &amp; Privacy Policy
          </Link>
          . A soft check does not affect my score.
        </span>
      </label>
      {errors.consent && <p className="text-xs font-medium text-red-600">{errors.consent}</p>}

      {serverError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Checking…
          </>
        ) : (
          "Check my score for free"
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-mint" /> Encrypted over HTTPS · No impact on your score
      </p>
    </form>
  );
}
