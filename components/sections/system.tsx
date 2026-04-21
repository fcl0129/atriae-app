import { Container } from "@/components/landing/container";
import { Reveal } from "@/components/landing/reveal";
import { SectionWrapper } from "@/components/landing/section-wrapper";

const tabs = ["Learn", "Plan", "Focus", "Organize"];

const prompts = [
  "Clarify what matters most today",
  "Help me think this through",
  "Simplify this into next steps",
  "Take this note and plan it out"
];

export function SystemSection() {
  return (
    <SectionWrapper className="py-14 md:py-20" surface="soft">
      <Container><div id="quiet-peek">
        <Reveal>
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] text-[#2a4636]/80">A QUIET PEEK INTO THE SYSTEM</p>
            <h2 className="max-w-[18ch] text-[2.2rem] leading-[0.98] text-[#111d15] md:text-[3.2rem]">
              Think clearly. Choose well. Move with intention.
            </h2>
            <p className="max-w-[60ch] text-base leading-8 text-[#24352b]/90 md:text-lg">
              Atriae turns open-ended thoughts into structured reasoning, helping you see what matters, shape better
              options, and act from a calmer center.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90} className="mt-8 md:mt-10">
          <div className="rounded-[2.1rem] border border-[#122619]/15 bg-[linear-gradient(145deg,rgba(255,252,246,0.92),rgba(238,244,236,0.84))] p-6 shadow-[0_34px_72px_-52px_rgba(13,26,18,0.62)] md:p-8">
            <p className="text-sm font-medium tracking-[0.01em] text-[#1b3024]">What should we shape together right now?</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`rounded-full border px-4 py-1.5 text-xs tracking-[0.08em] ${
                    index === 0
                      ? "border-[#193324]/25 bg-[#1c3727] text-[#f3f6f0]"
                      : "border-[#1d3929]/20 bg-white/60 text-[#244031]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#1d3929]/15 bg-white/72 p-4 text-sm text-[#2a4335] md:text-base">
              Turn a thought into a clear path.
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-xl border border-[#1d3929]/15 bg-[#fefcf7]/90 px-3.5 py-2 text-left text-xs text-[#264132] transition hover:bg-white md:text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div></Container>
    </SectionWrapper>
  );
}
