import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-[1.05em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Saffron primary CTA — the site's "approved" energy, used with intent.
        primary:
          "bg-saffron text-ink shadow-soft hover:shadow-lift hover:brightness-[1.03] font-semibold",
        secondary:
          "bg-evergreen text-white shadow-soft hover:bg-[#0c4d40] hover:shadow-lift",
        ink: "bg-ink text-paper hover:bg-[#0a1c18]",
        outline:
          "border border-evergreen/30 bg-transparent text-evergreen hover:bg-evergreen/[0.06]",
        ghost: "bg-transparent text-slate hover:bg-ink/[0.05]",
        link: "text-evergreen underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-13 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    // Link buttons are inline text, not sized controls — reset height/padding
    // after the size variant so it can't reintroduce them (compound classes win).
    compoundVariants: [{ variant: "link", className: "h-auto p-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
