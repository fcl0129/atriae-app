import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function HeroSection() {
  return (
    <SectionWrapper>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <p className="mb-6 text-xs font-medium tracking-[0.24em] text-[#22392a]/85">THE ATRIAE SYSTEM</p>
            <h1 className="text-4xl leading-[1.05] text-[#101a12] md:text-6xl">A system for thinking clearly.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#1f2d24]/92 md:text-xl">
              Atriae turns messy thoughts into calm, deliberate action.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <CtaButton>Request access</CtaButton>
              <Link
                href="#value"
                className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.02em] text-[#173122] transition hover:text-[#0e2318]"
              >
                Explore the system <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto h-[420px] w-full max-w-[500px]">
              <div className="absolute left-4 top-10 h-[310px] w-[82%] rounded-[2.1rem] border border-[#132318]/20 bg-[#f9f7f1]/96 p-4 shadow-[0_50px_80px_-58px_rgba(11,19,14,0.8)]">
                <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#44584a]">iPad · Dashboard</div>
                <div className="space-y-3 rounded-2xl bg-[#eef1e8] p-4">
                  <div className="h-2 w-2/3 rounded-full bg-[#1f3d2b]/65" />
                  <div className="h-2 w-1/2 rounded-full bg-[#1f3d2b]/25" />
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <div className="h-16 rounded-xl bg-white/90" />
                    <div className="h-16 rounded-xl bg-[#e2eadd]" />
                    <div className="h-16 rounded-xl bg-white/90" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 h-[190px] w-[145px] rounded-[2.2rem] border border-[#132318]/20 bg-[#fcfbf7]/95 p-3 shadow-[0_34px_55px_-34px_rgba(17,30,22,0.75)]">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#4c5f52]">Apple Watch</div>
                <div className="mt-5 rounded-2xl bg-[#eaf0e7] p-3">
                  <p className="text-[10px] tracking-[0.08em] text-[#38503f]">Focus</p>
                  <p className="mt-2 text-lg leading-none text-[#122117]">Brief</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
