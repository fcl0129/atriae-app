import Image from "next/image";

import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function DevicesSection() {
  return (
    <SectionWrapper className="py-12 md:py-16" surface="soft">
      <Container>
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] text-center text-[2rem] leading-[1.02] text-[#111f16] md:text-[3.1rem]">
            One intelligence layer, across every device.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-center text-base leading-8 text-[#213429]/90 md:text-lg">
            Review on iPad, act on iPhone, and stay grounded with quiet watch prompts when context matters most.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10 md:mt-12">
          <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#1f3d2b]/14 bg-[#fffdf9]/88 p-4 shadow-[0_30px_68px_-44px_rgba(13,24,17,0.62)] md:p-6">
            <Image
              src="/mockups/devices-set.svg"
              alt="Atriae on Apple Watch, iPad, and iPhone"
              width={1600}
              height={900}
              className="h-auto w-full rounded-[1.4rem]"
            />
          </div>
        </Reveal>
      </Container>
    </SectionWrapper>
  );
}
