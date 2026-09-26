"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, PhoneCall, Sparkles, X } from "lucide-react";
import { useApply } from "@/components/apply/apply-context";
import { CHAT_INPUT_MAX, type ChatMessage, type ChatResponse, type ChatSource } from "@/lib/chat-schema";
import { cn } from "@/lib/utils";
import { useChatAgent } from "./chat-context";
import { ChatMarkdown } from "./ChatMarkdown";
import { ChatLeadForm } from "./ChatLeadForm";

type UiMessage = ChatMessage & {
  id: number;
  sources?: ChatSource[];
  offerLeadForm?: boolean;
  /** Shown to the visitor only — never sent to the model (greeting, confirmations, errors). */
  local?: boolean;
  error?: boolean;
};

const GREETING =
  "Hi! I'm LoanServ's AI assistant. Ask me about loans, EMIs, eligibility or documents — in English, हिंदी, తెలుగు, தமிழ் or ಕನ್ನಡ.";

const STARTERS = [
  "Am I eligible for a personal loan?",
  "Documents needed for a home loan",
  "How is EMI calculated?",
  "Should I do a balance transfer?",
];

const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

/** Floating chat panel — mounted once in SiteProviders when the assistant is enabled. */
export function ChatPanel() {
  const { open, closeChat } = useChatAgent();
  const { openApply } = useApply();
  const nextId = React.useRef(1);
  const [messages, setMessages] = React.useState<UiMessage[]>([
    { id: 0, role: "assistant", content: GREETING, local: true },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [view, setView] = React.useState<"chat" | "lead">("chat");
  const [leadSent, setLeadSent] = React.useState(false);
  const scroller = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const add = (m: Omit<UiMessage, "id">) =>
    setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);

  /** What the server sees: real turns only, each within the schema's length cap. */
  const transcript = (list: UiMessage[]): ChatMessage[] =>
    list.filter((m) => !m.local).map(({ role, content }) => ({ role, content: content.slice(0, 4000) }));

  React.useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, view]);

  React.useEffect(() => {
    // Skip on phones: focusing would pop the keyboard over the greeting.
    if (open && view === "chat" && !isSmallScreen()) inputRef.current?.focus();
  }, [open, view]);

  async function send(text: string) {
    const content = text.trim().slice(0, CHAT_INPUT_MAX);
    if (!content || sending) return;
    const userMsg: UiMessage = { id: nextId.current++, role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcript(history).slice(-40) }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<ChatResponse> & { error?: string };
      if (!res.ok || !data.reply) throw new Error(data.error || "Sorry, I couldn't answer that. Please try again.");
      add({ role: "assistant", content: data.reply, sources: data.sources, offerLeadForm: data.offerLeadForm });
    } catch (err) {
      add({
        role: "assistant",
        content: err instanceof Error ? err.message : "Something went wrong.",
        local: true,
        error: true,
      });
    } finally {
      setSending(false);
    }
  }

  const onNavigate = () => {
    if (isSmallScreen()) closeChat();
  };

  const showStarters = !messages.some((m) => m.role === "user");

  return (
    <div
      role="dialog"
      aria-label="LoanServ chat assistant"
      onKeyDown={(e) => {
        if (e.key === "Escape") closeChat();
      }}
      className={cn(
        // Kept mounted while closed so the conversation survives; hidden via display.
        open ? "flex" : "hidden",
        "fixed inset-0 z-[60] flex-col overflow-hidden bg-paper shadow-lift print:hidden",
        "sm:inset-auto sm:bottom-4 sm:right-4 sm:h-[min(640px,calc(100dvh_-_2rem))] sm:w-[400px] sm:rounded-2xl sm:border sm:border-sand",
      )}
    >
      <div className="flex items-center gap-3 bg-evergreen px-4 py-3 text-white">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">LoanServ Assistant</p>
          <p className="text-xs text-white/75">AI answers · a real advisor on request</p>
        </div>
        <button
          onClick={closeChat}
          aria-label="Close chat"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="border-b border-sand bg-saffron/10 px-4 py-2 text-[0.72rem] leading-snug text-slate">
        AI can make mistakes; rates are indicative. LoanServ is a DSA, not a lender. Please don&apos;t share
        Aadhaar, PAN or bank details here. Messages are processed by our AI provider, Sarvam AI —{" "}
        <Link href="/legal/privacy-policy" onClick={onNavigate} className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>

      <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {view === "lead" ? (
          <ChatLeadForm
            transcript={transcript(messages)}
            onCancel={() => setView("chat")}
            onOpenFullForm={(category) => {
              closeChat();
              openApply(category);
            }}
            onSubmitted={({ firstName, mobile }) => {
              setLeadSent(true);
              setView("chat");
              add({
                role: "assistant",
                content: `Thanks${firstName ? `, ${firstName}` : ""}! A LoanServ advisor will call you on +91 ${mobile} shortly. Anything else I can help with meanwhile?`,
                local: true,
              });
            }}
          />
        ) : (
          <div className="space-y-3" aria-live="polite">
            {messages.map((m) => (
              <Bubble
                key={m.id}
                m={m}
                onNavigate={onNavigate}
                onCallback={!leadSent && m.offerLeadForm ? () => setView("lead") : undefined}
              />
            ))}
            {sending && (
              <div className="flex w-fit gap-1 rounded-2xl rounded-bl-md border border-sand bg-white px-4 py-3" aria-label="Assistant is typing">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-evergreen/60"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}
            {showStarters && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-evergreen/30 bg-white px-3 py-1.5 text-left text-xs text-evergreen hover:bg-evergreen/[0.06]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {view === "chat" && (
        <div className="border-t border-sand bg-white px-3 pb-3 pt-2">
          {!leadSent && (
            <button
              onClick={() => setView("lead")}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-evergreen hover:underline"
            >
              <PhoneCall className="h-3.5 w-3.5" /> Request a callback from an advisor
            </button>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Type your question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={CHAT_INPUT_MAX}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about loans, EMIs, documents…"
              className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-sand bg-white px-3.5 py-2.5 text-[0.95rem] text-slate placeholder:text-muted-foreground focus-visible:border-evergreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-evergreen/20"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={sending || !input.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-evergreen text-white transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Bubble({
  m,
  onNavigate,
  onCallback,
}: {
  m: UiMessage;
  onNavigate: () => void;
  onCallback?: () => void;
}) {
  if (m.role === "user") {
    return (
      <div className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-evergreen px-3.5 py-2.5 text-sm text-white">
        {m.content}
      </div>
    );
  }
  return (
    <div className="max-w-[90%] space-y-2">
      <div
        className={cn(
          "break-words rounded-2xl rounded-bl-md border px-3.5 py-2.5 text-sm",
          m.error ? "border-red-200 bg-red-50 text-red-700" : "border-sand bg-white text-slate",
        )}
      >
        <ChatMarkdown text={m.content} onNavigate={onNavigate} />
      </div>
      {m.sources && m.sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-1 text-xs text-muted-foreground">
          <span>Read more:</span>
          {m.sources.map((s) => (
            <Link key={s.url} href={s.url} onClick={onNavigate} className="text-evergreen underline underline-offset-2">
              {s.title}
            </Link>
          ))}
        </div>
      )}
      {onCallback && (
        <button
          onClick={onCallback}
          className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3.5 py-1.5 text-xs font-semibold text-ink shadow-soft"
        >
          <PhoneCall className="h-3.5 w-3.5" /> Request a callback
        </button>
      )}
    </div>
  );
}
