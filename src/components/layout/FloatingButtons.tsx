"use client";

import * as React from "react";
import { ArrowUp, MessageCircle, Sparkles } from "lucide-react";
import { useApply } from "@/components/apply/apply-context";
import { CHAT_LAUNCHER_ID, useChatAgent } from "@/components/chat/chat-context";
import { site } from "@/lib/site";
import { trackEvent } from "@/lib/track";

const WHATSAPP_URL = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi LoanServ, I'd like help with a loan.",
)}`;

/**
 * Bottom-right floating actions: Apply, WhatsApp, AI chat (when enabled) and
 * back-to-top (shown on scroll). WhatsApp clicks are counted by LeadTracking.
 */
export function FloatingButtons() {
  const { openApply } = useApply();
  const { enabled: chatEnabled, open: chatOpen, openChat } = useChatAgent();
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
      {chatEnabled && (
        <button
          id={CHAT_LAUNCHER_ID}
          onClick={() => {
            openChat();
            trackEvent("chat_open", { page: window.location.pathname });
          }}
          aria-label="Chat with the LoanServ AI assistant"
          title="Ask our AI assistant"
          aria-expanded={chatOpen}
          className="grid h-13 w-13 place-items-center rounded-full bg-evergreen text-white shadow-lift transition-transform hover:scale-105"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with LoanServ on WhatsApp"
        title="WhatsApp us"
        className="grid h-13 w-13 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <button
        onClick={() => openApply()}
        className="flex h-13 items-center gap-2 rounded-full bg-saffron px-5 font-semibold text-ink shadow-lift transition-transform hover:scale-105"
      >
        Apply Loan
      </button>
    </div>
  );
}
