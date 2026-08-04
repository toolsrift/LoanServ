"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
    {...props}
  />
));
Label.displayName = "Label";

const fieldBase =
  "flex h-11 w-full rounded-xl border border-sand bg-white px-3.5 py-2 text-[0.95rem] text-slate placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:border-evergreen focus-visible:ring-2 focus-visible:ring-evergreen/20 disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "h-auto min-h-[90px] py-2.5", className)} {...props} />
));
Textarea.displayName = "Textarea";

/** Native select styled to match — reliable and accessible for long option lists. */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%232A3A35%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[right_0.9rem_center] bg-no-repeat pr-9", className)}
    {...props}
  >
    {children}
  </select>
));
NativeSelect.displayName = "NativeSelect";

export function FieldError({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
  const showHint = Boolean(hint) && !error;

  // Thread accessibility state onto the control the caller passed in, so screen
  // readers announce the error/hint and validity without extra wiring per form.
  let control = children;
  if (React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const describedBy = [
      childProps["aria-describedby"] as string | undefined,
      error ? errorId : undefined,
      showHint ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(" ");
    control = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      "aria-describedby": describedBy || undefined,
      "aria-invalid": error ? true : childProps["aria-invalid"],
      "aria-required": required ? true : childProps["aria-required"],
    });
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-saffron">*</span>}
        </Label>
      )}
      {control}
      {showHint && (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
