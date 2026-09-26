import Script from "next/script";
import { site } from "@/lib/site";
import { CONSENT_KEY } from "@/lib/consent";

/** Tag IDs are interpolated into inline scripts, so only accept the documented shapes. */
const tagId = (v: string) => (/^[A-Z]{1,4}-[A-Z0-9]+$/i.test(v) ? v : "");

/**
 * Google tag loader for Analytics (NEXT_PUBLIC_GA_ID) and Google Ads conversion
 * tracking (NEXT_PUBLIC_GOOGLE_ADS_ID). Renders nothing until one is configured.
 *
 * Consent: a visitor who clicked "Decline" on the cookie banner gets every
 * Google consent type set to denied before any tag is configured; everyone
 * else keeps the site's existing behaviour. See lib/consent.
 */
export function Analytics() {
  const ids = [tagId(site.gaId), tagId(site.googleAdsId)].filter(Boolean);
  if (!ids.length) return null;
  const configs = [
    tagId(site.gaId) && `gtag('config', '${tagId(site.gaId)}', { anonymize_ip: true });`,
    tagId(site.googleAdsId) && `gtag('config', '${tagId(site.googleAdsId)}');`,
  ]
    .filter(Boolean)
    .join("\n");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          try {
            if (localStorage.getItem('${CONSENT_KEY}') === 'declined') {
              gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
            }
          } catch (e) {}
          gtag('js', new Date());
          ${configs}
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
