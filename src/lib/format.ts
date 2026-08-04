/**
 * Indian-format number helpers. All financial output flows through these so the
 * lakh/crore grouping and the mono-numeral treatment stay consistent site-wide.
 */

/** ₹1,23,456 — Indian digit grouping, no decimals by default. */
export function formatINR(value: number, opts: { decimals?: number } = {}): string {
  const { decimals = 0 } = opts;
  if (!Number.isFinite(value)) return "₹0";
  return (
    "₹" +
    value.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

/** 1,23,456 without the rupee symbol. */
export function formatIndianNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Compact lakh/crore labels e.g. ₹5L, ₹1.5Cr — used on slider labels/axes. */
export function formatINRCompact(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(value % 1_00_00_000 === 0 ? 0 : 1)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(value % 1_00_000 === 0 ? 0 : 1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`;
  return `₹${value}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
