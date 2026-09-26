"use client";

import * as React from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useApply } from "@/components/apply/apply-context";
import { useChatAgent } from "@/components/chat/chat-context";

/** Bottom-right floating actions: Apply, chat (when enabled) + back-to-top (shown on scroll). */
export function FloatingButtons() {
  const { openApply } = useApply();
  const chat = useChatAgent();
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
      {chat.enabled && (
        <button
          ref={chat.launcherRef}
          onClick={chat.openChat}
          aria-label="Chat with the LoanServ assistant"
          aria-expanded={chat.open}
          className="grid h-13 w-13 place-items-center rounded-full bg-evergreen text-white shadow-lift transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
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
