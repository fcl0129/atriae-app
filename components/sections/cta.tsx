import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function CtaSection() {
  return (
    <SectionWrapper className="pb-16 pt-12 md:pb-20 md:pt-14" surface="soft">
      <Container className="text-center">
        <Reveal>
          <p className="mx-auto max-w-[20ch] text-[2rem] leading-[1.03] text-[#111f16] md:text-[3rem]">
            No feeds. No noise. Just clear momentum.
          </p>
          <p className="mx-auto mt-4 max-w-[48ch] text-base leading-8 text-[#1c2f23]/90 md:text-lg">
            Request access to Atriae and build a calmer, more intelligent way to think and act.
          </p>
          <CtaButton className="mt-9">Request access</CtaButton>
        </Reveal>
      </Container>
    </SectionWrapper>
  );
}
