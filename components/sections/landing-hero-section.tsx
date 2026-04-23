import Link from "next/link";

const focusLabels = ["Rituals", "Learning", "Reflection", "Focus"];

export function LandingHeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl py-20 md:py-28 xl:py-36">
      <div className="max-w-5xl space-y-8">
        <p className="text-[0.66rem] font-medium uppercase tracking-[0.24em] text-[#5D735D]">A system for clarity</p>

        <h1 className="type-display text-[2.75rem] leading-[0.98] tracking-[-0.02em] text-[#1F2A24] sm:text-6xl md:text-7xl">
          Think clearly.
          <br />
          Live intentionally.
        </h1>

        <p className="max-w-3xl text-[1.06rem] leading-[1.72] text-[#425149] md:text-[1.18rem]">
          Atriae is a calm system for organizing your thoughts, rituals, learning, and attention — designed to help
          you create inner structure without adding more noise.
        </p>

        <p className="max-w-3xl text-[0.95rem] leading-[1.8] text-[#4F6159] md:text-[1rem]">
          Hold reflection close, keep personal systems grounded, and return to focused action with a steadier pace.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/login" className="editorial-cta text-foreground">
            Enter Atriae
          </Link>
          <Link href="/about" className="editorial-cta text-foreground">
            Explore the philosophy
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
