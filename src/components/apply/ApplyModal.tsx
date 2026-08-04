"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ApplyForm } from "./ApplyForm";
import { useApply } from "./apply-context";

/** Global apply modal — mounted once in SiteProviders, opened from anywhere via useApply(). */
export function ApplyModal() {
  const { open, setOpen, presetCategory } = useApply();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <div className="border-b border-sand bg-white px-6 py-5">
          <DialogTitle>Apply for a loan</DialogTitle>
          <DialogDescription>
            Free, no-obligation. A LoanServ advisor calls you back — no forms to see your options.
          </DialogDescription>
        </div>
        <div className="px-6 py-6">
          <ApplyForm presetCategory={presetCategory} onSuccess={() => {}} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
