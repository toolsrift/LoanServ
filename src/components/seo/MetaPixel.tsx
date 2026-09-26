"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { CONSENT_EVENT, getConsent, type ConsentChoice } from "@/lib/consent";

// Interpolated into an inline script, so digits only.
const PIXEL_ID = /^\d+$/.test(site.metaPixelId) ? site.metaPixelId : "";

/**
 * Meta (Facebook/Instagram) Pixel — for measuring Meta lead-ad campaigns.
 * Loads only when NEXT_PUBLIC_META_PIXEL_ID is set AND the visitor clicked
 * "Accept" on the cookie banner; never before, never after "Decline".
 */
export function MetaPixel() {
  const [allowed, setAllowed] = React.useState(false);
  const pathname = usePathname();
  const firstPath = React.useRef(true);

  React.useEffect(() => {
    if (!PIXEL_ID) return;
    const sync = () => setAllowed(getConsent() === "accepted");
    sync();
    const onChoice = (e: Event) => setAllowed((e as CustomEvent<ConsentChoice>).detail === "accepted");
    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => window.removeEventListener(CONSENT_EVENT, onChoice);
  }, []);

  // The init snippet tracks the first PageView; client-side navigations don't
  // reload the page, so report those here.
  React.useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID || !allowed) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
