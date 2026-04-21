import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

export function SystemSection() {
  return (
    <SectionWrapper>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <h2 className="text-4xl leading-[1.05] text-[#111d15] md:text-5xl">
              All of life.
              <br />
              One system.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#24352b]/92 md:text-lg">
              Notes, tasks, events, goals, habits — organized in one deliberate space so you can move through your day
              with clarity.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-[620px] rounded-[2rem] border border-[#122619]/20 bg-[#fffdf8]/90 p-6 shadow-[0_34px_72px_-50px_rgba(13,26,18,0.68)]">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#3c5746]">iPad · Planning View</p>
              <div className="rounded-[1.4rem] bg-[#edf1e8] p-5">
                <div className="h-2 w-40 rounded-full bg-[#1f3d2b]/70" />
                <div className="mt-2 h-2 w-24 rounded-full bg-[#1f3d2b]/25" />
                <div className="mt-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-2 rounded-xl bg-white/92 p-4">
                    <div className="h-2 w-4/5 rounded-full bg-[#1f3d2b]/35" />
                    <div className="h-2 w-3/5 rounded-full bg-[#1f3d2b]/20" />
                    <div className="h-20 rounded-lg bg-[#f2f5ef]" />
                  </div>
                  <div className="space-y-2 rounded-xl bg-[#f8faf6] p-4">
                    <div className="h-2 w-3/4 rounded-full bg-[#1f3d2b]/35" />
                    <div className="h-2 w-2/5 rounded-full bg-[#1f3d2b]/20" />
                    <div className="h-20 rounded-lg bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </SectionWrapper>
  );
}
