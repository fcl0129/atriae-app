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
        "rounded-[2rem] py-12 md:py-20",
        surface === "soft" && "border border-foreground/10 bg-[#fffdf8]/86 shadow-[0_28px_70px_-52px_rgba(17,24,18,0.65)]",
        className
      )}
    >
      {children}
    </section>
  );
}
