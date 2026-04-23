import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

const pathways = [
  { title: "More clarity", href: "/about" },
  { title: "Better rituals", href: "/rituals" },
  { title: "Deeper learning", href: "/learn" },
  { title: "Calmer focus", href: "/how-it-works" }
];

export function AboutSection() {
  return (
    <SectionFrame className="border-y border-[#D9D0C5]/80">
      <LandingContainer>
        <Reveal className="space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#5D735D]">Soft pathway into the product</p>
          <h2 className="max-w-[16ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
            Start with what you want more of
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pathways.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <Link
                href={item.href}
                className="group block rounded-2xl border border-[#D9D0C5]/75 bg-[#E8EFE4]/45 p-5 transition-colors duration-300 hover:border-[#5D735D]/40 hover:bg-[#E8EFE4]/70"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#5D735D]">Path</p>
                <p className="pt-3 font-serif text-[29px] leading-[1.08] text-[#1F2A24]">{item.title}</p>
                <p className="pt-5 text-[0.68rem] uppercase tracking-[0.19em] text-[#516159] transition-colors duration-300 group-hover:text-[#1F2A24]">
                  Continue
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </LandingContainer>
    </SectionFrame>
  );
}
