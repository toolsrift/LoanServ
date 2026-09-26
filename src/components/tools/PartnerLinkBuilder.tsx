"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/field";
import { site } from "@/lib/site";

const LANDING_PAGES = [
  { label: "Home page", path: "/" },
  { label: "Home loan", path: "/loans/home-loan" },
  { label: "Loan against property", path: "/loans/mortgage-loan-lap" },
  { label: "Balance transfer", path: "/balance-transfer" },
  { label: "Personal loan", path: "/loans/personal-loan" },
  { label: "Business loan", path: "/loans/business-loan" },
  { label: "Car loan", path: "/loans/car-loan" },
  { label: "Used car loan", path: "/loans/used-car-loan" },
  { label: "Doctor loan", path: "/loans/doctor-loan" },
  { label: "CA loan", path: "/loans/ca-loan" },
  { label: "Apply form", path: "/apply" },
];

/** "Sri Sai Builders" → "sri-sai-builders" — the format lib/attribution stores. */
function toCode(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function PartnerLinkBuilder() {
  const [kind, setKind] = React.useState<"partner" | "customer">("partner");
  const [name, setName] = React.useState("");
  const [path, setPath] = React.useState("/");
  const [copied, setCopied] = React.useState(false);

  const month = new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(2, 4); // mmyy
  const base = toCode(name);
  const code = base ? (kind === "customer" ? `cust-${base}-${month}` : base) : "";
  const link = code
    ? `${site.url}${path}?ref=${code}&utm_source=${kind}&utm_medium=referral`
    : "";
  const qr = link
    ? `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=12&data=${encodeURIComponent(link)}`
    : "";
  const share = link
    ? `https://wa.me/?text=${encodeURIComponent(`Need a loan? Compare offers from 30+ banks with LoanServ — free: ${link}`)}`
    : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is still selectable */
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-sand bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Link for" htmlFor="pl-kind">
          <NativeSelect id="pl-kind" value={kind} onChange={(e) => setKind(e.target.value as "partner" | "customer")}>
            <option value="partner">Referral partner (builder, dealer, CA…)</option>
            <option value="customer">Customer referral</option>
          </NativeSelect>
        </Field>
        <Field label="Landing page" htmlFor="pl-path">
          <NativeSelect id="pl-path" value={path} onChange={(e) => setPath(e.target.value)}>
            {LANDING_PAGES.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field
        label={kind === "customer" ? "Customer first name" : "Partner name"}
        htmlFor="pl-name"
        hint={code ? `Code: ${code}` : "Letters and numbers; spaces become hyphens"}
      >
        <Input
          id="pl-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={kind === "customer" ? "Ravi" : "Sri Sai Builders"}
        />
      </Field>

      {link && (
        <div className="space-y-4 border-t border-sand pt-6">
          <div className="flex gap-2">
            <Input readOnly value={link} className="num text-sm" onFocus={(e) => e.currentTarget.select()} />
            <Button type="button" variant="secondary" onClick={copy} aria-label="Copy link">
              {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- external QR service image */}
            <img src={qr} alt={`QR code for ${code}`} width={220} height={220} className="rounded-xl border border-sand" />
            <div className="space-y-3 text-sm text-slate">
              <p>Print the QR for the partner&apos;s counter, or send the link on WhatsApp.</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={qr} target="_blank" rel="noopener noreferrer">
                    Open QR (to save or print)
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={share} target="_blank" rel="noopener noreferrer">
                    Share on WhatsApp
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The QR image is generated by the free goqr.me service; only the link above is sent to it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
