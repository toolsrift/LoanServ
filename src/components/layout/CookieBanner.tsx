"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const KEY = "loanserv-cookie-consent";

/** Lightweight cookie notice (required for AdSense/analytics disclosure). */
export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* storage blocked — stay hidden */
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
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
