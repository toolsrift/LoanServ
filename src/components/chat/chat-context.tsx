"use client";

import * as React from "react";

/** DOM id of the floating chat launcher; focus returns to it when the panel closes. */
export const CHAT_LAUNCHER_ID = "chat-launcher";

interface ChatContextValue {
  /** False when the assistant isn't configured — nothing chat-related renders. */
  enabled: boolean;
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

export function ChatProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const openChat = React.useCallback(() => setOpen(true), []);
  const closeChat = React.useCallback(() => {
    setOpen(false);
    document.getElementById(CHAT_LAUNCHER_ID)?.focus();
  }, []);

  const value = React.useMemo(() => ({ enabled, open, openChat, closeChat }), [enabled, open, openChat, closeChat]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatAgent() {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error("useChatAgent must be used within ChatProvider");
  return ctx;
}
