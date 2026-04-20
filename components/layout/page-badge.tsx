import type { ReactNode } from "react";

export function PageBadge({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
      {children}
    </p>
  );
}
