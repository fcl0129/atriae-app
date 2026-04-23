import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

const areas = [
  {
    title: "Rituals",
    description:
      "Support daily and weekly practices that help you reset, ground yourself, and return to what matters.",
    href: "/rituals"
  },
  {
    title: "Learning",
    description: "Keep track of ideas, subjects, and insights in a way that feels thoughtful rather than chaotic.",
    href: "/learn"
  },
  {
    title: "Reflection",
    description: "Create space to process thoughts, notice patterns, and build self-awareness over time.",
    href: "/about"
  },
  {
    title: "Focus",
    description: "Reduce internal noise and bring attention back to what deserves it.",
    href: "/how-it-works"
  }
];

export function SystemSection() {
  return (
    <SectionFrame className="border-y border-[#D9D0C5]/80">
      <LandingContainer>
        <Reveal className="max-w-[700px] space-y-5 pb-10 md:pb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">What you can use it for</p>
          <h2 className="text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
            Built for the way real clarity works
          </h2>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {areas.map((area, index) => (
            <Reveal key={area.title} delay={index * 70}>
              <article className="h-full rounded-2xl border border-[#D9D0C5]/75 bg-[#FBF7F1]/72 p-6 shadow-[0_12px_36px_-30px_rgba(31,42,36,0.34)] md:p-7">
                <h3 className="font-serif text-[30px] leading-[1.06] text-[#1F2A24]">{area.title}</h3>
                <p className="pt-3 text-[16px] leading-[1.65] text-[#425149]">{area.description}</p>
                <Link
                  href={area.href}
                  className="mt-5 inline-flex text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#516159] transition-colors duration-300 hover:text-[#1F2A24]"
                >
                  Learn more
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
