import { Container } from "@/components/landing/container";
import { CtaButton } from "@/components/landing/cta-button";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function CtaSection() {
  return (
    <SectionWrapper className="pb-16 pt-14 md:pb-20" surface="soft">
      <Container className="text-center">
        <Reveal>
          <p className="text-2xl text-[#111f16] md:text-4xl">No feeds. No distractions. No noise.</p>
          <p className="mt-4 text-base text-[#1c2f23]/92 md:text-xl">Clarity isn&apos;t a luxury. It&apos;s a system.</p>
          <CtaButton className="mt-10">Request access</CtaButton>
        </Reveal>
      </Container>
    </SectionWrapper>
  );
}
