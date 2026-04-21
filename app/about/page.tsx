import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";

export default function AboutPage() {
  return (
    <div className="pb-16 pt-4 md:pt-6">
      <PublicSiteNavbar />
      <main className="mt-10">
        <SectionWrapper>
          <Container className="max-w-4xl">
            <Reveal>
              <p className="text-xs tracking-[0.22em] text-[#274837]">ABOUT ATRIAE</p>
              <h1 className="mt-4 max-w-[16ch] text-4xl leading-[1.02] text-[#101d14] md:text-6xl">
                A calm system for thoughtful people.
              </h1>
              <p className="mt-7 max-w-[52ch] text-lg leading-8 text-[#213429]/90">
                Atriae brings thinking, planning, learning, and reflection into one deliberate workspace.
              </p>
            </Reveal>

            <Reveal delay={90} className="mt-12 space-y-8 text-[#1f3126]/90">
              <div>
                <h2 className="text-[1.9rem] text-[#111f16]">Why it exists</h2>
                <p className="mt-3 max-w-[60ch] leading-8">
                  Most software competes for your attention. Atriae is designed to protect it — with clear structure,
                  quiet interfaces, and tools that help you decide better.
                </p>
              </div>
              <div>
                <h2 className="text-[1.9rem] text-[#111f16]">Principles</h2>
                <ul className="mt-3 space-y-2 leading-8">
                  <li>Clarity over volume.</li>
                  <li>Understanding over urgency.</li>
                  <li>Intentional systems over engagement loops.</li>
                </ul>
              </div>
            </Reveal>
          </Container>
        </SectionWrapper>
      </main>
    </div>
  );
}
