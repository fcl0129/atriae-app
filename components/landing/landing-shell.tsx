import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#F7F2EA] text-[#1F2A24]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(56rem_30rem_at_84%_11%,rgba(230,209,205,0.55),transparent_72%),radial-gradient(52rem_28rem_at_10%_20%,rgba(232,239,228,0.85),transparent_75%),radial-gradient(50rem_24rem_at_65%_84%,rgba(216,182,182,0.24),transparent_74%)]" />
      {children}
    </div>
  );
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
