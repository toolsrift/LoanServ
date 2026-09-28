/**
 * AdSense publisher ID from NEXT_PUBLIC_ADSENSE_CLIENT. Accepts "ca-pub-…" or
 * "pub-…"; anything else (blank, a "ca-pub-XXXX" placeholder) counts as unset,
 * so ad code never loads with an invalid ID.
 */
export function adsenseClient(raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT): string {
  const m = (raw || "").trim().match(/^(?:ca-)?pub-(\d{10,20})$/);
  return m ? `ca-pub-${m[1]}` : "";
}

/** ads.txt body: Google's seller line once a publisher ID is set. */
export function adsTxt(client = adsenseClient()): string {
  if (!client) return "# ads.txt for loanserv.in: set NEXT_PUBLIC_ADSENSE_CLIENT to publish the AdSense line.\n";
  // f08c47fec0942fa0 is Google's fixed certification authority ID.
  return `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
}

/**
 * Pages that never load ads: the lead forms (so competing lenders' ads don't
 * pull applicants away, and no ad script runs beside PAN/DOB fields), the
 * partner login, consent confirmations and internal tools. AdSense policy also
 * bars ads on login and confirmation screens.
 */
export const NO_ADS_PATHS = ["/apply", "/free-cibil-score", "/partner-portal", "/confirm", "/tools/partner-links"];

export function adsAllowedOn(pathname: string): boolean {
  return !NO_ADS_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
