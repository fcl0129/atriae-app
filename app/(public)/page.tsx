import Link from "next/link";
import type { ComponentProps } from "react";

import { Reveal } from "@/components/landing/reveal";
import { ProductDemoTransition } from "@/components/sections/product-demo-transition";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";
import { GlassContainer } from "@/components/ui/glass-container";

type LinkHref = ComponentProps<typeof Link>["href"];

function PrimaryButton({ href, label }: { href: LinkHref; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-full border border-[#22392d]/15 bg-[#163127] px-7 text-sm font-medium tracking-[0.04em] text-[#f7faf4] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#11271f]"
    >
      {label}
    </Link>
  );
}

function SecondaryButton({ href, label }: { href: LinkHref; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-full border border-[#203227]/20 bg-white/30 px-7 text-sm tracking-[0.04em] text-[#183126] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/45"
    >
      {label}
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden pb-24 pt-4 md:pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_48%_at_14%_10%,rgba(236,158,173,0.22),transparent_78%),radial-gradient(56%_46%_at_88%_20%,rgba(177,204,162,0.24),transparent_74%)]" />

      <PublicSiteNavbar />

      <main className="relative mx-auto flex w-full max-w-[1100px] flex-col px-4 md:px-8">
        <section className="py-24">
          <Reveal className="max-w-3xl space-y-8 text-left">
            <h1 className="text-[clamp(3rem,8vw,6.4rem)] leading-[0.9] text-[#0f1f16]">
              Think clearly.
              <br />
              Move with intention.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#203529]/85 md:text-xl">
              A system that turns scattered thoughts into clear direction.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton href="/login" label="Start thinking clearly" />
              <SecondaryButton href="/login" label="Request access" />
            </div>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal className="max-w-3xl space-y-6">
            <h2 className="text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.95] text-[#102017]">
              Clarity isn’t a trait.
              <br />
              It’s a system.
            </h2>
            <p className="text-lg leading-8 text-[#213629]/84">
              Most people don’t struggle with ideas — they struggle with knowing what to do next. Atriae gives you a
              structured way to think, decide, and move forward.
            </p>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal>
            <GlassContainer className="p-5 sm:p-8">
              <ProductDemoTransition />
              <p className="pt-6 text-sm tracking-[0.08em] text-[#203429]/75">
                Atriae structures your thinking in seconds.
              </p>
            </GlassContainer>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal className="max-w-3xl space-y-6">
            <h2 className="text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.95] text-[#102017]">Stop overthinking. Start moving.</h2>
            <p className="text-lg leading-8 text-[#213629]/84">
              Atriae removes the friction between thinking and doing — so you can move forward with confidence, not
              hesitation.
            </p>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal>
            <div className="grid gap-10 border-y border-[#1b3024]/14 py-12 md:grid-cols-3 md:gap-8">
              {[
                ["01 — EMPTY", "Clear your mind from noise and mental clutter."],
                ["02 — STRUCTURE", "See what actually matters."],
                ["03 — MOVE", "Act with clarity and precision."]
              ].map(([title, copy]) => (
                <div key={title} className="space-y-4 md:pr-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#1f3429]/68">{title}</p>
                  <p className="text-xl leading-8 text-[#102017]/90">{copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal className="max-w-3xl space-y-6">
            <h2 className="text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.95] text-[#102017]">Not another productivity tool.</h2>
            <p className="text-lg leading-8 text-[#213629]/84">
              Atriae isn’t about doing more.
              <br />
              It’s about doing what matters — clearly.
            </p>
          </Reveal>
        </section>

        <section className="py-24">
          <Reveal className="space-y-8 border-t border-[#1b3024]/14 pt-12">
            <h2 className="max-w-3xl text-[clamp(2.4rem,6.4vw,5rem)] leading-[0.94] text-[#0f2016]">
              Built for people who want clarity.
            </h2>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton href="/login" label="Start thinking clearly" />
              <SecondaryButton href="/login" label="Request access" />
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
