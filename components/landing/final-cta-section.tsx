import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { LandingContainer, SectionFrame } from "@/components/landing/landing-shell";

export function FinalCtaSection() {
  return (
    <SectionFrame>
      <LandingContainer>
        <Reveal className="mx-auto max-w-[960px] rounded-[20px] border border-[#D9D0C5]/85 bg-[#FBF7F1] px-6 py-12 text-center shadow-[0_16px_38px_-30px_rgba(31,42,36,0.35)] md:px-12 md:py-[72px]">
          <h2 className="mx-auto max-w-[18ch] text-[32px] leading-[1.03] tracking-[-0.01em] md:text-[40px]">
            Request access to a clearer way of thinking.
          </h2>
          <p className="mx-auto pt-6 text-[16px] leading-[1.55] text-[#425149] md:max-w-[640px] md:text-[18px]">
            Atriae is designed for people who want more space, more structure, and more intention in the way they
            move through life.
          </p>
          <div className="pt-8">
            <Link
              href="/login"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-[#1F2A24] bg-[#1F2A24] px-8 text-[15px] font-medium text-[#FBF7F1] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#24322B]"
            >
              Request access
            </Link>
          </div>
        </Reveal>
      </LandingContainer>
    </SectionFrame>
  );
}
