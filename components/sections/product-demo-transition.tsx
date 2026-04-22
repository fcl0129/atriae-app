"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const DEMO_DELAY = 3200;

export function ProductDemoTransition() {
  const [showStructuredView, setShowStructuredView] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowStructuredView((current) => !current);
    }, DEMO_DELAY);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[18rem] overflow-hidden rounded-[1.5rem] border border-[#1f3027]/12 bg-white/28 p-8 sm:p-10">
      <div
        className={cn(
          "absolute inset-0 flex items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          showStructuredView ? "translate-x-[-6%] opacity-0" : "translate-x-0 opacity-100"
        )}
        aria-hidden={showStructuredView}
      >
        <p className="max-w-lg text-2xl leading-[1.35] text-[#132219] sm:text-3xl">
          “I have too many things in my head. I don’t know what matters.”
        </p>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          showStructuredView ? "translate-x-0 opacity-100" : "translate-x-[6%] opacity-0"
        )}
        aria-hidden={!showStructuredView}
      >
        <ol className="space-y-5 text-xl leading-[1.35] text-[#102116] sm:text-2xl">
          <li>1. Define your priority</li>
          <li>2. Remove what doesn’t matter</li>
          <li>3. Take the next clear step</li>
        </ol>
      </div>

      <div className="absolute bottom-4 right-5 text-xs uppercase tracking-[0.2em] text-[#203429]/55">live clarity flow</div>
    </div>
  );
}
