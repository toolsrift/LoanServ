"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, Input } from "@/components/ui/field";
import { ContactConsentText } from "@/components/apply/ContactConsentText";
import { trackLead } from "@/lib/track";

/** Customer's confirm / decline for a partner referral. */
export function ReferralDecision({ token }: { token: string }) {
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "sending" | "confirmed" | "declined">("idle");
  const [error, setError] = React.useState("");

  async function decide(action: "confirm" | "decline") {
    setError("");
    if (action === "confirm" && !consent) {
      setError("Please tick the box to confirm we may contact you.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/referral/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "confirm" ? { action, token, email, consent } : { action, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      if (action === "confirm") trackLead("partner");
      setStatus(action === "confirm" ? "confirmed" : "declined");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (status === "confirmed" || status === "declined") {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-mint/10 p-5 text-evergreen">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          {status === "confirmed"
            ? "Thank you! A LoanServ advisor will call you shortly to discuss your options."
            : "Done — we won't contact you about this enquiry."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Field label="Email (optional)" htmlFor="ref-email" hint="So we can send you loan offers in writing">
        <Input id="ref-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </Field>
      <label className="flex items-start gap-3">
        <Checkbox id="ref-consent" checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} className="mt-0.5" />
        <ContactConsentText />
      </label>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" size="lg" className="flex-1" disabled={status === "sending"} onClick={() => decide("confirm")}>
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Yes, contact me
        </Button>
        <Button variant="ghost" size="lg" disabled={status === "sending"} onClick={() => decide("decline")}>
          No, don&apos;t contact me
        </Button>
      </div>
    </div>
  );
}
