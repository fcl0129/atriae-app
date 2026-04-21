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
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal>
            <p className="mb-6 text-xs font-medium tracking-[0.24em] text-[#22392a]/85">THE ATRIAE SYSTEM</p>
            <h1 className="max-w-[16ch] text-[2.5rem] leading-[0.98] text-[#101a12] md:text-[4.15rem]">
              A system for thinking clearly.
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-8 text-[#1f2d24]/90 md:text-lg">
              Atriae is a personal platform for clarity, continuous learning, and deliberate action — with AI as a
              thinking partner that helps you understand, decide, and move forward with intention.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <CtaButton>Request access</CtaButton>
              <Link
                href="#quiet-peek"
                className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.02em] text-[#173122] transition hover:text-[#0e2318]"
              >
                Explore the system <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-[2rem] border border-[#122619]/14 bg-[#fffdf8]/85 p-6 shadow-[0_30px_70px_-50px_rgba(15,29,21,0.56)] md:p-8">
              <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[#2c4737]/85">Platform principles</p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-[#1e3126]/90 md:text-[0.98rem]">
                <li>• Structured reflection over reactive productivity.</li>
                <li>• Clear next steps over endless information.</li>
                <li>• Better judgment built through consistent learning loops.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
