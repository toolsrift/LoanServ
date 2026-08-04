"use client";

import * as React from "react";

interface ApplyContextValue {
  open: boolean;
  presetCategory?: string;
  openApply: (presetCategory?: string) => void;
  closeApply: () => void;
  setOpen: (v: boolean) => void;
}

const ApplyContext = React.createContext<ApplyContextValue | null>(null);

export function ApplyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [presetCategory, setPresetCategory] = React.useState<string | undefined>();

  const openApply = React.useCallback((preset?: string) => {
    setPresetCategory(preset);
    setOpen(true);
  }, []);
  const closeApply = React.useCallback(() => setOpen(false), []);

  const value = React.useMemo(
    () => ({ open, presetCategory, openApply, closeApply, setOpen }),
    [open, presetCategory, openApply, closeApply],
  );

  return <ApplyContext.Provider value={value}>{children}</ApplyContext.Provider>;
}

export function useApply() {
  const ctx = React.useContext(ApplyContext);
  if (!ctx) throw new Error("useApply must be used within ApplyProvider");
  return ctx;
}
