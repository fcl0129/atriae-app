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
        "h-11 rounded-xl bg-[#1f3d2b] px-6 text-sm font-medium tracking-[0.01em] text-[#f7f6ef] shadow-[0_20px_40px_-26px_rgba(22,41,30,0.82)] hover:-translate-y-0.5 hover:bg-[#275138]",
        className
      )}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
