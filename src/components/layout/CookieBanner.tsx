"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT, CONSENT_KEY, setConsent, type ConsentChoice } from "@/lib/consent";

// The banner shows until a choice is stored. Read straight from localStorage
// (an external store) so there's no setState-in-effect and no hydration
// mismatch: the server snapshot is "hidden".
function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
function needsChoice(): boolean {
  try {
    return !localStorage.getItem(CONSENT_KEY);
  } catch {
    return false; // storage blocked — stay hidden
  }
}

/** Lightweight cookie notice (required for AdSense/analytics disclosure). */
export function CookieBanner() {
  const visible = React.useSyncExternalStore(subscribe, needsChoice, () => false);

  function decide(value: ConsentChoice) {
    setConsent(value); // stores the choice and fires CONSENT_EVENT, which hides the banner
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-paper/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          We use cookies for analytics and to serve ads (including Google AdSense &amp; third-party vendors). See our{" "}
          <Link href="/legal/cookie-policy" className="text-evergreen underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy-policy" className="text-evergreen underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide("declined")}>
            Decline
          </Button>
          <Button variant="secondary" size="sm" onClick={() => decide("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
