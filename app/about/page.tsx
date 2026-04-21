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
              <h1 className="mt-4 text-4xl text-[#101d14] md:text-6xl">A calm operating system for real life.</h1>
              <p className="mt-7 text-lg leading-8 text-[#213429]/92">
                Atriae is a focused space for organizing the full shape of your life: thinking, planning, action, and
                reflection.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-12 space-y-8 text-[#1f3126]/92">
              <div>
                <h2 className="text-2xl text-[#111f16]">Why it exists</h2>
                <p className="mt-3 leading-8">
                  Most tools optimize for engagement. Atriae is built for clarity. No feeds, no algorithmic noise, and
                  no pressure to perform productivity.
                </p>
              </div>
              <div>
                <h2 className="text-2xl text-[#111f16]">Philosophy</h2>
                <ul className="mt-3 space-y-2 leading-8">
                  <li>Clarity over volume.</li>
                  <li>Intentionality over urgency.</li>
                  <li>Quiet systems over constant notifications.</li>
                </ul>
              </div>
            </Reveal>
          </Container>
        </SectionWrapper>
      </main>
    </div>
  );
}
