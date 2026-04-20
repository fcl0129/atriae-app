import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p
            className="text-[0.68rem] font-medium uppercase text-muted-foreground/90"
            style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl leading-[0.96] md:text-[2.4rem]">{title}</h2>
        {description ? <p className="max-w-2xl text-base leading-8 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="pt-2 sm:pt-0">{action}</div> : null}
    </div>
  );
}
