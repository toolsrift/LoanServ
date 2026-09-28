"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { adsAllowedOn } from "@/lib/adsense";

/**
 * Google AdSense Auto Ads loader — gated behind NEXT_PUBLIC_ADSENSE_CLIENT.
 * Loading this single script site-wide is all Auto Ads needs; Google decides
 * placement from the AdSense dashboard. Renders nothing until a client is set,
 * and never on the pages in NO_ADS_PATHS.
 */
export function AutoAds() {
  const pathname = usePathname();
  if (!site.adsenseClient || !adsAllowedOn(pathname)) return null;
  return (
    <Script
      id="adsense-auto-ads"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}
