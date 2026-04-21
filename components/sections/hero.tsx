import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function HeroSection() {
  return (
    <SectionWrapper className="pt-12 md:pt-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal>
            <p className="mb-6 text-xs font-medium tracking-[0.24em] text-[#22392a]/85">THE ATRIAE SYSTEM</p>
            <h1 className="max-w-[15ch] text-[2.5rem] leading-[0.98] text-[#101a12] md:text-[4.15rem]">
              A personal system for thinking clearly.
            </h1>
            <p className="mt-6 max-w-[50ch] text-base leading-8 text-[#1f2d24]/90 md:text-lg">
              Atriae helps you learn continuously, choose with perspective, and move with intention.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <CtaButton>Request access</CtaButton>
              <Link
                href="#value"
                className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.02em] text-[#173122] transition hover:text-[#0e2318]"
              >
                Explore the system <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative mx-auto w-full max-w-[560px] pb-8">
              <div className="relative z-10 overflow-hidden rounded-[2rem] border border-[#122619]/16 bg-[#fffdf8]/92 p-3 shadow-[0_40px_80px_-48px_rgba(15,29,21,0.72)]">
                <Image
                  src="/mockups/hero-ipad.svg"
                  alt="Atriae iPad dashboard mockup"
                  width={1400}
                  height={980}
                  className="h-auto w-full rounded-[1.5rem]"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 -right-3 z-20 w-[30%] min-w-[132px] overflow-hidden rounded-[2rem] border border-[#122619]/18 bg-[#fffdf8]/94 p-2 shadow-[0_30px_55px_-36px_rgba(16,30,22,0.74)] md:-right-4">
                <Image
                  src="/mockups/hero-watch.svg"
                  alt="Atriae Apple Watch companion mockup"
                  width={560}
                  height={700}
                  className="h-auto w-full rounded-[1.3rem]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
