"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

export function SystemSection() {
  const [blurLevel, setBlurLevel] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setBlurLevel(Math.max(0, 1 - y / 2200));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="system-preview" className="relative py-24 md:py-32">
      <Container className="max-w-5xl">
        <Reveal className="space-y-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#273c30]/80">System preview</p>
          <h2 className="max-w-3xl text-4xl leading-[1.02] text-[#102016] md:text-6xl">A quiet peek into the system.</h2>
        </Reveal>

        <Reveal className="relative mt-14 overflow-hidden border-y border-[#183024]/20 py-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(52%_80%_at_50%_0%,rgba(255,251,243,0.58),rgba(255,251,243,0))]" />

          <div className="space-y-12 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.86),rgba(0,0,0,0.56),rgba(0,0,0,0))]">
            <div
              className={cn(
                "space-y-4 px-1 text-[#102116]/88 transition-all duration-700",
                blurLevel > 0.5 ? "blur-sm" : "blur-[2px]"
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#243a2f]/75">User system</p>
              <p className="text-2xl leading-tight md:text-3xl">Think clearly. Choose well. Move with intention.</p>
            </div>

            <div
              className={cn(
                "scale-[1.01] space-y-6 px-1 text-[#122519]/82 transition-all duration-700",
                blurLevel > 0.5 ? "blur-lg" : "blur-md"
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#243a2f]/70">Atriae intelligence</p>
              <p className="text-xl leading-relaxed md:text-2xl">What should we shape together right now?</p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[#294034]/78">
                <span>[ clarity ]</span>
                <span>[ plan ]</span>
                <span>[ focus ]</span>
                <span>[ decision ]</span>
              </div>
            </div>

            <div
              className={cn(
                "space-y-4 px-1 pb-4 text-[#13271b]/76 transition-all duration-700",
                blurLevel > 0.5 ? "blur-md" : "blur-sm"
              )}
            >
              <p className="text-lg leading-relaxed md:text-xl">Turn a thought into a clear path</p>
              <div className="space-y-2 text-base md:text-lg">
                <p>Clarity → define what matters</p>
                <p>Structure → break it into steps</p>
                <p>Action → move forward with intention</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
