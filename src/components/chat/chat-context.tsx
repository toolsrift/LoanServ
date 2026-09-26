"use client";

import * as React from "react";

interface ChatContextValue {
  /** False when the assistant isn't configured — nothing chat-related renders. */
  enabled: boolean;
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  /** The floating launcher, so focus can return to it when the panel closes. */
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

export function ChatProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const launcherRef = React.useRef<HTMLButtonElement | null>(null);

  const openChat = React.useCallback(() => setOpen(true), []);
  const closeChat = React.useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const value = React.useMemo(
    () => ({ enabled, open, openChat, closeChat, launcherRef }),
    [enabled, open, openChat, closeChat],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatAgent() {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error("useChatAgent must be used within ChatProvider");
  return ctx;
}
