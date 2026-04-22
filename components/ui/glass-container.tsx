import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type GlassContainerProps = ComponentPropsWithoutRef<"div">;

export function GlassContainer({ className, children, ...props }: GlassContainerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/45 bg-white/28 backdrop-blur-xl",
        "shadow-[0_28px_80px_-48px_rgba(24,39,30,0.62),inset_0_1px_0_rgba(255,255,255,0.7)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(120%_80%_at_8%_0%,rgba(238,160,173,0.2),transparent_62%),radial-gradient(110%_88%_at_92%_100%,rgba(174,201,160,0.22),transparent_68%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:opacity-30 after:[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='%236a5943' fill-opacity='0.07'%3E%3Ccircle cx='12' cy='16' r='1'/%3E%3Ccircle cx='74' cy='48' r='1'/%3E%3Ccircle cx='134' cy='86' r='1'/%3E%3Ccircle cx='44' cy='126' r='1'/%3E%3Ccircle cx='156' cy='152' r='1'/%3E%3C/g%3E%3C/svg%3E\")]",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
