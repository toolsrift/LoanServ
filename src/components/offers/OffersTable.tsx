"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { Offer } from "@/lib/offers";

export function OffersTable({ offers, month }: { offers: Offer[]; month: string }) {
  const products = React.useMemo(
    () => [...new Map(offers.map((o) => [o.productSlug, o.product])).entries()],
    [offers],
  );
  const [product, setProduct] = React.useState<string>("all");

  const rows = product === "all" ? offers : offers.filter((o) => o.productSlug === product);
  const sorted = [...rows].sort((a, b) => a.roiFrom - b.roiFrom);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={product === "all"} onClick={() => setProduct("all")}>
          All products
        </FilterChip>
        {products.map(([slug, name]) => (
          <FilterChip key={slug} active={product === slug} onClick={() => setProduct(slug)}>
            {name}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sand">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-sand bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Lender</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Interest (p.a.)</th>
              <th className="px-4 py-3 font-medium">Processing fee</th>
              <th className="px-4 py-3 font-medium">Tenure</th>
              <th className="px-4 py-3 font-medium">Foreclosure</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((o, i) => (
              <tr key={`${o.lenderSlug}-${o.productSlug}-${i}`} className="border-b border-sand/60 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  <Link href={`/offers/${o.lenderSlug}`} className="hover:text-evergreen hover:underline">
                    {o.lender}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate">
                  <Link href={`/offers/${o.lenderSlug}/${o.productSlug}`} className="hover:text-evergreen hover:underline">
                    {o.product}
                  </Link>
                </td>
                <td className="num px-4 py-3 font-medium text-ink">
                  {o.roiFrom}% – {o.roiTo}%
                </td>
                <td className="num px-4 py-3 text-slate">{o.processingFee}</td>
                <td className="num px-4 py-3 text-slate">{o.tenure}</td>
                <td className="px-4 py-3 text-slate">{o.foreclosureCharges}</td>
                <td className="px-4 py-3">
                  <a
                    href={o.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-evergreen hover:underline"
                  >
                    Lender <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge tone="sand">Indicative</Badge>
        Rates & fees are indicative, last updated {month}. Confirm current terms with the lender before applying.
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-evergreen bg-evergreen text-white"
          : "border-sand bg-white text-slate hover:border-evergreen hover:text-evergreen",
      )}
    >
      {children}
    </button>
  );
}
