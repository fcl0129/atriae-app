import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function LandingShell({ children }: { children: ReactNode }) {
  return <div className="relative overflow-visible text-foreground">{children}</div>;
}

export function LandingContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-12",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </div>
  );
}

export function SectionFrame({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("py-16 md:py-[88px] xl:py-[120px]", className)}>
      {children}
    </section>
  );
}
