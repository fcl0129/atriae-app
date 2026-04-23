import type { Route } from "next";
import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

const pathways: Array<{ title: string; href: Route }> = [
  { title: "More clarity", href: "/about" },
  { title: "Better rituals", href: "/rituals" },
  { title: "Deeper learning", href: "/learn" },
  { title: "Calmer focus", href: "/how-it-works" }
];

export function AboutSection() {
  return (
    <SectionFrame>
      <LandingContainer>
        <Reveal className="space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Soft pathway into the product</p>
          <h2 className="max-w-[16ch] text-[32px] leading-[1.03] tracking-[-0.01em] text-foreground md:text-[40px]">
            Start with what you want more of
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pathways.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <Link href={item.href} className="surface-tinted group block p-5 transition-colors duration-300 hover:border-foreground/30">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Path</p>
                <p className="pt-3 font-serif text-[29px] leading-[1.08] text-foreground">{item.title}</p>
                <p className="pt-5 text-[0.68rem] uppercase tracking-[0.19em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
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
