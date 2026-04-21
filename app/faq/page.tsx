import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";

export default function FaqPage() {
  return (
    <div className="pb-16 pt-4 md:pt-6">
      <PublicSiteNavbar />
      <main className="mt-10">
        <SectionWrapper>
          <Container className="max-w-4xl">
            <Reveal>
              <p className="text-xs tracking-[0.22em] text-[#274837]">FAQ</p>
              <h1 className="mt-4 text-4xl text-[#101d14] md:text-6xl">Questions, answered clearly.</h1>
            </Reveal>
            <Reveal delay={80} className="mt-10">
              <FaqAccordion />
            </Reveal>
          </Container>
        </SectionWrapper>
      </main>
    </div>
  );
}
