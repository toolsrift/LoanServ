import { site } from "./site";

/**
 * Client-side conversion tracking. Every call is a no-op when the matching tag
 * isn't configured or hasn't loaded (not set up, blocked, or consent declined),
 * and never throws — tracking must not break a form.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* ignore */
  }
}

/**
 * A lead was submitted. Sends GA4's recommended `generate_lead` event, the
 * Google Ads conversion (when configured) and the Meta Pixel `Lead` event.
 */
export function trackLead(form: "apply" | "chat" | "cibil", category?: string): void {
  trackEvent("generate_lead", { form_name: form, loan_category: category || "" });
  try {
    if (site.googleAdsId && site.googleAdsLeadLabel) {
      window.gtag?.("event", "conversion", { send_to: `${site.googleAdsId}/${site.googleAdsLeadLabel}` });
    }
    window.fbq?.("track", "Lead", { content_category: category || form });
  } catch {
    /* ignore */
  }
}
