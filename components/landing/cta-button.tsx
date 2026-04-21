import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonProps = {
  href?: ComponentProps<typeof Link>["href"];
  children: ReactNode;
} & Omit<ComponentProps<typeof Button>, "children">;

export function CtaButton({ href = "/login", children, className, ...props }: CtaButtonProps) {
  return (
    <Button
      asChild
      className={cn(
        "h-11 rounded-[0.85rem] bg-[#7ea86d] px-6 text-sm font-medium tracking-[0.01em] text-[#f8f8f2] shadow-[0_18px_36px_-24px_rgba(38,67,43,0.7)] transition duration-300 hover:scale-[1.015] hover:bg-[#6f9760]",
        className
      )}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
