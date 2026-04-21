import Image from "next/image";

import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function SystemSection() {
  return (
    <SectionWrapper className="py-14 md:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[2.3rem] leading-[0.98] text-[#111d15] md:text-[3.3rem]">
              All of life.
              <br />
              One system.
            </h2>
            <p className="mt-6 max-w-[42ch] text-base leading-8 text-[#24352b]/90 md:text-lg">
              Notes, tasks, events, goals, and rituals — organized in one deliberate space.
            </p>
            <p className="mt-4 max-w-[42ch] text-base leading-8 text-[#24352b]/90 md:text-lg">
              Atriae surfaces patterns in how you plan and decide, then teaches you how to think with more clarity over
              time.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-[2.1rem] border border-[#122619]/20 bg-[#fffdf8]/90 p-4 shadow-[0_34px_72px_-50px_rgba(13,26,18,0.68)] md:p-6">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#3c5746]">System view · iPad</p>
              <Image
                src="/mockups/system-ipad.svg"
                alt="Atriae planning and learning system on iPad"
                width={1440}
                height={980}
                className="h-auto w-full rounded-[1.5rem]"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
