/**
 * The visitor's cookie choice from the CookieBanner, shared by the banner and
 * the tracking tags. Undecided visitors keep the site's existing behaviour
 * (Google Analytics on); "declined" switches Google tags to denied and keeps
 * the Meta Pixel from ever loading; the Meta Pixel loads only on "accepted".
 */

export const CONSENT_KEY = "loanserv-cookie-consent";
export const CONSENT_EVENT = "loanserv:consent";

export type ConsentChoice = "accepted" | "declined";

export function getConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* storage blocked — the choice still applies for this page view */
  }
  const state = choice === "accepted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}
