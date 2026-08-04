"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useApply } from "./apply-context";

/** Any-context "Apply" trigger that opens the global modal, optionally preselecting a category. */
export function ApplyButton({
  presetCategory,
  children = "Apply for Loan",
  ...props
}: ButtonProps & { presetCategory?: string }) {
  const { openApply } = useApply();
  return (
    <Button onClick={() => openApply(presetCategory)} {...props}>
      {children}
    </Button>
  );
}
