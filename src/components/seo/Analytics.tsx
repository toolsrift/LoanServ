import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics loader — gated behind NEXT_PUBLIC_GA_ID. Renders nothing until
 * an ID is configured, so the site never breaks before analytics is set up.
 */
export function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${site.gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

/**
 * Google AdSense Auto Ads loader — gated behind NEXT_PUBLIC_ADSENSE_CLIENT.
 * Loading this single script site-wide is all Auto Ads needs; Google decides
 * placement from the AdSense dashboard. Renders nothing until a client is set.
 */
export function AutoAds() {
  if (!site.adsenseClient) return null;
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
