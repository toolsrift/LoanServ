"use client";

import { ApplyProvider } from "@/components/apply/apply-context";
import { ApplyModal } from "@/components/apply/ApplyModal";
import { FloatingButtons } from "./FloatingButtons";
import { CookieBanner } from "./CookieBanner";

/** Client shell: apply-modal context, global modal, floating actions, cookie notice. */
export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApplyProvider>
      {children}
      <ApplyModal />
      <FloatingButtons />
      <CookieBanner />
    </ApplyProvider>
  );
}
