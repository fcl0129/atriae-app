import Link from "next/link";

const focusLabels = ["Clarity", "Learning", "Ritual", "Gentle organization"];

export function LandingHeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl py-20 md:py-28 xl:py-36">
      <div className="max-w-5xl space-y-8">
        <p className="text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[#5D735D]">Atriaé</p>

        <h1 className="type-display text-[2.9rem] leading-[0.98] tracking-[-0.02em] text-[#1F2A24] sm:text-6xl md:text-7xl">
          A system for thinking clearly.
        </h1>

        <p className="max-w-3xl text-[1.06rem] leading-[1.72] text-[#425149] md:text-[1.18rem]">
          Atriae is a private space for clarity, learning, and reset. It helps you organize life with a steadier rhythm — without the pressure of a noisy dashboard.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/login" className="editorial-cta text-foreground">
            Enter Atriae
          </Link>
          <Link href="/how-it-works" className="editorial-cta text-foreground">
            See the daily rhythm
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-[0.7rem] uppercase tracking-[0.2em] text-[#5F7068]">
          {focusLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
