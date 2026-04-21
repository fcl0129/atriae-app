"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type StackingCardsRenderMeta = {
  index: number;
  isActive: boolean;
  progress: number;
};

type StackingCardsProps<T> = {
  items: readonly T[];
  renderCard: (item: T, meta: StackingCardsRenderMeta) => ReactNode;
  className?: string;
  desktopMinSectionHeight?: string;
  stickyTopClassName?: string;
  mobileBreakpointPx?: number;
  cardGapClassName?: string;
};

type StackingCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  stepLabel?: string;
  emphasis?: string;
  className?: string;
  progress?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function StackingCard({
  eyebrow,
  title,
  description,
  stepLabel,
  emphasis,
  className,
  progress = 0
}: StackingCardProps) {
  return (
    <article
      className={cn(
        "surface-paper relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-foreground/10 p-7 shadow-soft md:min-h-[26rem] md:p-9",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-foreground/10"
      >
        <div
          className="h-full bg-primary/70 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(10, progress * 100)}%` }}
        />
      </div>

      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
          <span>{eyebrow}</span>
          <span>{stepLabel}</span>
        </div>
        <h3 className="max-w-[18ch] text-[1.9rem] leading-[0.94] md:text-[2.4rem]">{title}</h3>
      </header>

      <div className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{description}</p>
        {emphasis ? <p className="text-xs uppercase tracking-[0.18em] text-foreground/75">{emphasis}</p> : null}
      </div>
    </article>
  );
}

export function StackingCards<T>({
  items,
  renderCard,
  className,
  desktopMinSectionHeight,
  stickyTopClassName = "md:top-24",
  mobileBreakpointPx = 768,
  cardGapClassName = "-mt-48"
}: StackingCardsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpointPx - 1}px)`);

    const syncViewportMode = () => {
      setIsMobile(mediaQuery.matches);
    };

    syncViewportMode();
    mediaQuery.addEventListener("change", syncViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", syncViewportMode);
    };
  }, [mobileBreakpointPx]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || isMobile) {
      setProgress(0);
      return;
    }

    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = clamp((-rect.top) / scrollableDistance, 0, 1);

      setProgress((current) => (Math.abs(current - nextProgress) > 0.002 ? nextProgress : current));
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isMobile]);

  const activeIndex = useMemo(() => {
    if (items.length <= 1) {
      return 0;
    }

    return Math.round(progress * (items.length - 1));
  }, [items.length, progress]);

  if (items.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        {items.map((item, index) => (
          <div key={index}>{renderCard(item, { index, isActive: index === 0, progress: 0 })}</div>
        ))}
      </div>
    );
  }

  const sectionStyle = {
    minHeight: desktopMinSectionHeight ?? `${Math.max(items.length * 76, 320)}vh`
  } as CSSProperties;

  return (
    <div ref={containerRef} className={cn("relative hidden md:block", className)} style={sectionStyle}>
      <div className={cn("sticky h-[74svh]", stickyTopClassName)}>
        {items.map((item, index) => {
          const cardProgress = clamp(progress * items.length - index, 0, 1);

          return (
            <div
              key={index}
              className={cn(
                "sticky transition-transform duration-500 ease-out",
                stickyTopClassName,
                index === 0 ? "mt-0" : cardGapClassName
              )}
              style={{ zIndex: index + 10 }}
            >
              <div className={cn("transition-opacity duration-500", activeIndex >= index ? "opacity-100" : "opacity-95")}>
                {renderCard(item, { index, isActive: activeIndex === index, progress: cardProgress })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
