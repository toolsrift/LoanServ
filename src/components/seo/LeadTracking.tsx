"use client";

import * as React from "react";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/track";

/**
 * Site-wide lead instrumentation, mounted once in SiteProviders:
 * - records where this visit came from (lib/attribution) so lead emails can
 *   name the channel;
 * - reports clicks on any phone or WhatsApp link as a `contact` event, so
 *   leads that never touch a form are still counted.
 */
export function LeadTracking() {
  React.useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") || "";
      const method = href.startsWith("tel:") ? "phone" : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? "whatsapp" : "";
      if (method) trackEvent("contact", { method, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
