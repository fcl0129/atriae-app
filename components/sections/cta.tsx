import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function CtaSection() {
  return (
    <SectionWrapper className="pb-16 pt-12 md:pb-20 md:pt-14" surface="soft">
      <Container className="text-center">
        <Reveal>
          <p className="mx-auto max-w-[20ch] text-[2rem] leading-[1.03] text-[#111f16] md:text-[3rem]">Request access.</p>
          <p className="mx-auto mt-4 max-w-[48ch] text-base leading-8 text-[#1c2f23]/90 md:text-lg">
            Private access. Thoughtfully built for people who value clarity. No feeds. No distractions. No noise.
          </p>
          <CtaButton className="mt-9">Request access</CtaButton>
        </Reveal>
      </Container>
    </SectionWrapper>
  );
}
