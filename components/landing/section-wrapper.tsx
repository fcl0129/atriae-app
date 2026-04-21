import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  surface?: "none" | "soft";
};

export function SectionWrapper({ children, className, surface = "none" }: SectionWrapperProps) {
  return (
    <section
      className={cn(
        "rounded-[1.9rem] py-12 md:py-16",
        surface === "soft" && "border border-foreground/10 bg-[#fffdf8]/84 shadow-[0_24px_64px_-50px_rgba(17,24,18,0.62)]",
        className
      )}
    >
      {children}
    </section>
  );
}
