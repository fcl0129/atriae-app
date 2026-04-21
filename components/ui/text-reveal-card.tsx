"use client";

import { type HTMLAttributes, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TextRevealCardProps = HTMLAttributes<HTMLDivElement> & {
  baseText: string;
  revealText: string;
  hint?: string;
};

export function TextRevealCard({ baseText, revealText, hint, className, ...props }: TextRevealCardProps) {
  const [revealPercent, setRevealPercent] = useState(50);

  const clipPath = useMemo(
    () => `polygon(0 0, ${revealPercent}% 0, ${revealPercent}% 100%, 0 100%)`,
    [revealPercent]
  );

  return (
    <div
      className={cn(
        "group relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-b from-card to-background px-6 py-12 shadow-soft sm:px-10 sm:py-14",
        className
      )}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const nextPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
        setRevealPercent(Math.max(8, Math.min(92, nextPercent)));
      }}
      onMouseLeave={() => setRevealPercent(50)}
      {...props}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_50%)]" />

      <p className="relative text-center text-[clamp(1.8rem,6vw,4.1rem)] font-medium leading-[1.03] tracking-tight text-foreground/30">
        {baseText}
      </p>

      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-12 text-center text-[clamp(1.8rem,6vw,4.1rem)] font-medium leading-[1.03] tracking-tight text-foreground sm:inset-x-10 sm:top-14"
        style={{ clipPath }}
      >
        {revealText}
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 top-8 w-px bg-gradient-to-b from-transparent via-foreground/55 to-transparent transition-transform duration-200"
        style={{ left: `${revealPercent}%`, transform: "translateX(-0.5px)" }}
      />

      <p className="relative mt-10 text-center text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground/90">
        {hint ?? "Move across to reveal"}
      </p>
    </div>
  );
}
