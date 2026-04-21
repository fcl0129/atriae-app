"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type MediaBetweenTextProps = {
  lead: string;
  trail: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  mediaAlt?: string;
  trigger?: "hover" | "in-view";
  aspectRatioClassName?: string;
  className?: string;
  mediaClassName?: string;
};

export function MediaBetweenText({
  lead,
  trail,
  mediaType,
  mediaSrc,
  mediaAlt = "Editorial campaign visual",
  trigger = "in-view",
  aspectRatioClassName = "aspect-[4/5]",
  className,
  mediaClassName
}: MediaBetweenTextProps) {
  const [isActive, setIsActive] = useState(trigger !== "in-view");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (trigger !== "in-view" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={cn("group flex flex-wrap items-center justify-center gap-3 md:gap-5", className)}
      onMouseEnter={trigger === "hover" ? () => setIsActive(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => setIsActive(false) : undefined}
    >
      <span className="text-[clamp(2.05rem,9vw,6.4rem)] font-serif leading-[0.9] tracking-tight text-foreground">
        {lead}
      </span>

      <div
        className={cn(
          "relative w-[min(28vw,11rem)] min-w-[5.6rem] overflow-hidden rounded-2xl border border-foreground/15 bg-card/70 shadow-soft transition-all duration-500 ease-out md:w-[min(22vw,15rem)]",
          aspectRatioClassName,
          isActive ? "scale-100 opacity-100" : "scale-95 opacity-75",
          mediaClassName
        )}
      >
        {mediaType === "video" ? (
          <video
            src={mediaSrc}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div
            role="img"
            aria-label={mediaAlt}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${mediaSrc})` }}
          />
        )}

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/15 transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-40"
          )}
        />
      </div>

      <span className="text-[clamp(2.05rem,9vw,6.4rem)] font-serif leading-[0.9] tracking-tight text-foreground">
        {trail}
      </span>
    </div>
  );
}
