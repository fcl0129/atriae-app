import type { ReactNode } from "react";

export function PageBadge({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[0.68rem] font-medium uppercase text-muted-foreground/90"
      style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}
    >
      {children}
    </p>
  );
}
