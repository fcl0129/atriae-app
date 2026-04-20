import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-normal tracking-[0.02em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-paper hover:-translate-y-0.5 hover:shadow-lift hover:brightness-105 active:translate-y-px active:brightness-[0.98]",
        secondary: "bg-blush-100 text-foreground border border-blush-300/70 hover:bg-blush-300/70",
        ghost: "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        quiet: "border border-border bg-paper text-foreground hover:bg-ivory-100"
      },
      size: {
        default: "h-11 px-6 py-2.5 text-[0.88rem]",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
