"use client";

import { ApplyProvider } from "@/components/apply/apply-context";
import { ApplyModal } from "@/components/apply/ApplyModal";
import { ChatProvider } from "@/components/chat/chat-context";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { FloatingButtons } from "./FloatingButtons";
import { CookieBanner } from "./CookieBanner";

/** Client shell: apply-modal + chat contexts, global modal/panel, floating actions, cookie notice. */
export function SiteProviders({
  chatEnabled = false,
  children,
}: {
  /** Resolved on the server (lib/chat-agent) so no config reaches the client bundle. */
  chatEnabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ApplyProvider>
      <ChatProvider enabled={chatEnabled}>
        {children}
        <ApplyModal />
        {chatEnabled && <ChatPanel />}
        <FloatingButtons />
        <CookieBanner />
      </ChatProvider>
    </ApplyProvider>
  );
}
