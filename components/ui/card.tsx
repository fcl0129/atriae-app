import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[var(--radius)] border transition-all duration-500", {
  variants: {
    surface: {
      paper: "surface-paper",
      tinted: "surface-tinted",
      glass: "surface-glass"
    }
  },
  defaultVariants: {
    surface: "paper"
  }
});

function Card({
  className,
  surface,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ surface }), "hover-lift hover:shadow-lift", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pb-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-xl leading-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm leading-7 text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-3", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 p-6 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
