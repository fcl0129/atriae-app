import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const liquidGlassCardVariants = cva(
  "liquid-glass-card rounded-[var(--radius)] border p-5 text-sm text-foreground shadow-soft transition-transform duration-500 ease-out",
  {
    variants: {
      tone: {
        neutral: "liquid-glass-card--neutral",
        warm: "liquid-glass-card--warm"
      },
      padding: {
        default: "p-5",
        compact: "p-4"
      }
    },
    defaultVariants: {
      tone: "neutral",
      padding: "default"
    }
  }
);

type LiquidGlassCardProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof liquidGlassCardVariants> & {
    draggable?: boolean;
  };

function LiquidGlassCard({ className, tone, padding, draggable = false, ...props }: LiquidGlassCardProps) {
  return <div className={cn(liquidGlassCardVariants({ tone, padding }), className)} draggable={draggable} {...props} />;
}

export { LiquidGlassCard, type LiquidGlassCardProps };
