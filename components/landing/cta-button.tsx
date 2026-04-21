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
        "rounded-full bg-[#739b64] px-7 text-sm font-medium tracking-[0.04em] text-[#f7f9f3] transition duration-300 hover:scale-[1.02] hover:bg-[#668a59]",
        className
      )}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
