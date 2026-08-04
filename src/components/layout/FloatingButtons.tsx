"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { useApply } from "@/components/apply/apply-context";

/** Bottom-right floating actions: Apply + a back-to-top button (shown on scroll). */
export function FloatingButtons() {
  const { openApply } = useApply();
  const [showTop, setShowTop] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 print:hidden">
      {showTop && (
        <button
          onClick={toTop}
          aria-label="Back to top"
          className="grid h-11 w-11 place-items-center rounded-full border border-sand bg-white text-ink shadow-lift transition-transform hover:scale-105 hover:text-evergreen"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={() => openApply()}
        className="flex h-13 items-center gap-2 rounded-full bg-saffron px-5 font-semibold text-ink shadow-lift transition-transform hover:scale-105"
      >
        Apply Loan
      </button>
    </div>
  );
}
