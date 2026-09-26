"use client";

import * as React from "react";
import { Check, Copy, Loader2, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/field";
import { CITIES, EMPLOYMENT_TYPES, LOAN_CATEGORIES, LOAN_TYPES } from "@/lib/apply-schema";
import { partnerReferralSchema } from "@/lib/partner-schema";
import { formatINR } from "@/lib/format";

type Creds = { code: string; key: string };
type Row = { name: string; mobile: string; category: string; amount: number; city: string; status: string; createdAt: string };
type Errors = Record<string, string>;

const STORAGE_KEY = "loanserv-partner";

const blank = {
  fullName: "",
  mobile: "",
  category: "Home",
  loanType: "Fresh",
  amount: "",
  city: "Hyderabad",
  employment: "Salaried",
  monthlySalary: "",
  notes: "",
  partnerAttests: false,
};

const headers = (c: Creds) => ({ "content-type": "application/json", "x-partner-code": c.code, "x-partner-key": c.key });

type MeResponse = { partner: { code: string; name: string }; referrals: Row[] };

/** Checks credentials and loads the partner's referrals. No React state — callers apply the result. */
async function fetchMe(c: Creds): Promise<{ ok: true; data: MeResponse } | { ok: false; error: string }> {
  const res = await fetch("/api/partner/me", { method: "POST", headers: headers(c) }).catch(() => null);
  const data = res ? await res.json().catch(() => ({})) : {};
  return res?.ok ? { ok: true, data } : { ok: false, error: data?.error || "Couldn't sign in. Please try again." };
}

function saveCreds(c: Creds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    /* storage blocked — just stay signed in for this visit */
  }
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-saffron/15 text-[#8a5a04]",
  confirmed: "bg-mint/15 text-evergreen",
  declined: "bg-red-50 text-red-700",
  expired: "bg-sand text-slate",
};

export function PartnerPortal() {
  const [creds, setCreds] = React.useState<Creds | null>(null);
  const [partnerName, setPartnerName] = React.useState("");
  const [rows, setRows] = React.useState<Row[]>([]);
  const [login, setLogin] = React.useState({ code: "", key: "", remember: true });
  const [loginError, setLoginError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const [form, setForm] = React.useState(blank);
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitError, setSubmitError] = React.useState("");
  const [result, setResult] = React.useState<{ confirmUrl: string; whatsappUrl: string; message: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const apply = React.useCallback((c: Creds, r: Awaited<ReturnType<typeof fetchMe>>) => {
    setBusy(false);
    if (!r.ok) {
      setLoginError(r.error);
      return;
    }
    setCreds(c);
    setPartnerName(r.data.partner.name);
    setRows(r.data.referrals);
    setLoginError("");
  }, []);

  async function signIn(c: Creds, remember: boolean) {
    const r = await fetchMe(c);
    if (r.ok && remember) saveCreds(c);
    apply(c, r);
  }

  // Sign back in with saved credentials, if any. State is only set in the
  // promise callback, never synchronously in the effect.
  React.useEffect(() => {
    let saved: Creds | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      saved = null;
    }
    const c = saved;
    if (c?.code && c?.key) fetchMe(c).then((r) => apply(c, r));
  }, [apply]);

  function signOut() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setCreds(null);
    setRows([]);
    setResult(null);
  }

  const set = (k: keyof typeof blank, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!creds) return;
    setSubmitError("");
    const parsed = partnerReferralSchema.safeParse(form);
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
    setBusy(true);
    const res = await fetch("/api/partner/referrals", {
      method: "POST",
      headers: headers(creds),
      body: JSON.stringify(parsed.data),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res?.ok) {
      setSubmitError(data?.error || "Couldn't save the referral. Please try again.");
      return;
    }
    setResult(data);
    setForm(blank);
    void signIn(creds, false); // refresh the list
  }

  async function copyMessage() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  if (!creds) {
    return (
      <form
        className="space-y-4 rounded-2xl border border-sand bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          void signIn({ code: login.code.trim().toLowerCase(), key: login.key.trim() }, login.remember);
        }}
      >
        <h2 className="font-display text-xl text-ink">Partner sign in</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Partner code" htmlFor="pp-code">
            <Input id="pp-code" value={login.code} onChange={(e) => setLogin((l) => ({ ...l, code: e.target.value }))} autoComplete="username" />
          </Field>
          <Field label="Access key" htmlFor="pp-key">
            <Input id="pp-key" type="password" value={login.key} onChange={(e) => setLogin((l) => ({ ...l, key: e.target.value }))} autoComplete="current-password" />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate">
          <Checkbox checked={login.remember} onCheckedChange={(v) => setLogin((l) => ({ ...l, remember: Boolean(v) }))} />
          Keep me signed in on this device
        </label>
        {loginError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loginError}</p>}
        <Button type="submit" variant="secondary" disabled={busy || !login.code || !login.key}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </Button>
        <p className="text-xs text-muted-foreground">Don&apos;t have a code? Ask your LoanServ contact to set you up as a partner.</p>
      </form>
    );
  }

  const isSalaried = form.employment === "Salaried";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-slate">
          Signed in as <b className="text-ink">{partnerName}</b> <span className="num text-sm">({creds.code})</span>
        </p>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      {result && (
        <div className="space-y-3 rounded-2xl border border-mint/40 bg-mint/10 p-5">
          <p className="font-medium text-evergreen">Referral saved. Now send the customer their confirmation link:</p>
          <p className="rounded-xl bg-white p-3 text-sm text-slate">{result.message}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="primary" size="sm">
              <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Send on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={copyMessage}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy message"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            LoanServ won&apos;t contact the customer until they open the link and confirm. It expires in 7 days.
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-sand bg-white p-6">
        <h2 className="font-display text-xl text-ink">Customer details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" htmlFor="pp-fullName" required error={errors.fullName}>
            <Input id="pp-fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </Field>
          <Field label="Customer mobile" htmlFor="pp-mobile" required error={errors.mobile}>
            <Input id="pp-mobile" inputMode="numeric" maxLength={10} className="num" value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
          </Field>
          <Field label="Loan" htmlFor="pp-category" required>
            <NativeSelect id="pp-category" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {LOAN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Type" htmlFor="pp-loanType" required>
            <NativeSelect id="pp-loanType" value={form.loanType} onChange={(e) => set("loanType", e.target.value)}>
              {LOAN_TYPES.map((c) => <option key={c}>{c}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Amount (₹)" htmlFor="pp-amount" required error={errors.amount}>
            <Input id="pp-amount" inputMode="numeric" className="num" value={form.amount} onChange={(e) => set("amount", e.target.value.replace(/\D/g, ""))} placeholder="2500000" />
          </Field>
          <Field label="City" htmlFor="pp-city" required>
            <NativeSelect id="pp-city" value={form.city} onChange={(e) => set("city", e.target.value)}>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Employment" htmlFor="pp-employment" required>
            <NativeSelect id="pp-employment" value={form.employment} onChange={(e) => set("employment", e.target.value)}>
              {EMPLOYMENT_TYPES.map((c) => <option key={c}>{c}</option>)}
            </NativeSelect>
          </Field>
          {isSalaried && (
            <Field label="Monthly net salary (₹)" htmlFor="pp-monthlySalary" required error={errors.monthlySalary}>
              <Input id="pp-monthlySalary" inputMode="numeric" className="num" value={form.monthlySalary} onChange={(e) => set("monthlySalary", e.target.value.replace(/\D/g, ""))} />
            </Field>
          )}
        </div>
        <Field label="Notes for our advisor (optional)" htmlFor="pp-notes" error={errors.notes}>
          <Textarea id="pp-notes" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Buying a flat in our project; wants a balance transfer too" />
        </Field>
        <label className="flex items-start gap-3 text-sm text-slate">
          <Checkbox checked={form.partnerAttests} onCheckedChange={(v) => set("partnerAttests", Boolean(v))} className="mt-0.5" />
          The customer asked me to share their details with LoanServ for a loan enquiry. I understand LoanServ will
          only contact them after they confirm on the link I send.
        </label>
        {errors.partnerAttests && <p className="text-xs font-medium text-red-600">{errors.partnerAttests}</p>}
        {submitError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
        <Button type="submit" variant="primary" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save referral &amp; get link
        </Button>
      </form>

      <div>
        <h2 className="font-display text-xl text-ink">Your referrals</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No referrals yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-sand bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-sand text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Loan</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-sand/60 last:border-0">
                    <td className="px-4 py-2">
                      {r.name} <span className="num block text-xs text-muted-foreground">+91 {r.mobile}</span>
                    </td>
                    <td className="px-4 py-2">
                      {r.category} · <span className="num">{formatINR(Number(r.amount))}</span> · {r.city}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status] || ""}`}>{r.status}</span>
                    </td>
                    <td className="num px-4 py-2 text-xs text-slate">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          <b>Pending</b>: waiting for the customer to confirm. <b>Confirmed</b>: our advisor is on it.
          <b> Declined</b>: the customer chose not to be contacted. Links expire after 7 days.
        </p>
      </div>
    </div>
  );
}
