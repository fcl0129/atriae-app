import Link from "next/link";

import { Reveal } from "@/components/landing/reveal";
import { PublicSiteNavbar } from "@/components/sections/public-site-navbar";

type Step = {
  id: string;
  title: string;
  copy: string;
};

const systemSteps: Step[] = [
  {
    id: "01",
    title: "Empty",
    copy: "Unload mental tabs, unresolved loops, and ambient pressure into a deliberate space."
  },
  {
    id: "02",
    title: "Structure",
    copy: "Separate signal from noise, identify what matters, and shape a clear decision path."
  },
  {
    id: "03",
    title: "Move",
    copy: "Leave with one precise direction and the next meaningful action already in motion."
  }
];

const pressurePoints = [
  "Too many thoughts competing for priority.",
  "Too many open loops creating hidden friction.",
  "Too much effort spent deciding what deserves attention."
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden pb-20 pt-4 md:pb-28 md:pt-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48rem_32rem_at_88%_6%,rgba(212,166,177,0.24),transparent_70%),radial-gradient(42rem_28rem_at_8%_22%,rgba(160,188,148,0.22),transparent_76%),radial-gradient(52rem_34rem_at_50%_84%,rgba(243,232,214,0.65),transparent_74%)]" />

      <PublicSiteNavbar />

      <main className="relative mx-auto flex w-full max-w-[1160px] flex-col px-4 md:px-8">
        <section className="relative overflow-hidden border-b border-[#223228]/12 pb-20 pt-16 md:pb-24 md:pt-24">
          <div className="pointer-events-none absolute -left-24 top-10 h-60 w-60 rounded-[40%] border border-[#2f4638]/15 bg-[#f5ebe2]/70 blur-[2px]" />
          <div className="pointer-events-none absolute right-2 top-24 h-40 w-40 rounded-[46%] border border-[#2f4638]/15 bg-[#dce8d6]/75" />
          <div className="pointer-events-none absolute bottom-8 right-28 h-28 w-56 rounded-[42%] border border-[#2f4638]/14 bg-[#efd0d3]/55" />

          <Reveal className="relative max-w-4xl space-y-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#294336]/74">Atriae — a system for thinking clearly</p>
            <h1 className="max-w-5xl text-[clamp(3rem,8vw,6.8rem)] leading-[0.9] text-[#102118]">
              Clarity is not a personality trait.
              <br />
              It is a practiced system.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#1f3529]/86 md:text-[1.35rem] md:leading-9">
              Atriae helps you turn mental clutter into clear direction. No feed, no noise, no performance — just a
              deliberate space to think, decide, and move with intention.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#16281f] bg-[#14271d] px-7 text-sm font-medium tracking-[0.07em] text-[#f6f6ef] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#0f2018]"
              >
                Request access
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#24362b]/24 bg-[#f9f5ef]/68 px-7 text-sm tracking-[0.06em] text-[#193025] backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#f7f3ec]"
              >
                Learn more
              </Link>
            </div>
          </Reveal>
        </section>

        <section className="grid gap-10 border-b border-[#223228]/12 py-20 md:grid-cols-[1.2fr_0.8fr] md:gap-14 md:py-24">
          <Reveal className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#2c4438]/70">What Atriae is</p>
            <h2 className="text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[0.96] text-[#112219]">A calm architecture for clear decisions.</h2>
            <p className="max-w-xl text-lg leading-8 text-[#203429]/84">
              Atriae is a private thinking environment for people who care about precision. It helps you gather
              everything in your head, shape it into signal, and choose what deserves your energy now.
            </p>
          </Reveal>

          <Reveal className="relative overflow-hidden rounded-[2rem] border border-[#213227]/16 bg-[#fcf7f0]/78 p-8 backdrop-blur-md" delay={120}>
            <p className="text-xs uppercase tracking-[0.26em] text-[#30473b]/66">Manifesto</p>
            <p className="pt-5 text-3xl leading-tight text-[#15271f] md:text-[2.15rem]">
              “Most people are not short on ambition.
              <br />
              They are short on inner space.”
            </p>
          </Reveal>
        </section>

        <section className="border-b border-[#223228]/12 py-20 md:py-24">
          <Reveal className="max-w-2xl space-y-6 pb-10 md:pb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#2c4438]/70">The system</p>
            <h2 className="text-[clamp(2.1rem,5.4vw,4rem)] leading-[0.96] text-[#102118]">From mental noise to intentional action.</h2>
          </Reveal>

          <div className="space-y-5">
            {systemSteps.map((step, index) => (
              <Reveal key={step.id} delay={index * 120}>
                <article className="grid gap-4 rounded-[1.8rem] border border-[#24362b]/14 bg-[linear-gradient(145deg,rgba(255,250,244,0.84),rgba(235,243,231,0.64))] px-6 py-7 md:grid-cols-[180px_1fr] md:items-start md:px-8 md:py-9">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#2e473a]/70">{step.id}</p>
                  <div className="space-y-3">
                    <h3 className="text-[1.8rem] leading-tight text-[#162821] md:text-[2.2rem]">{step.title}</h3>
                    <p className="max-w-2xl text-base leading-8 text-[#20352a]/84 md:text-lg">{step.copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="grid gap-12 border-b border-[#223228]/12 py-20 md:grid-cols-[0.95fr_1.05fr] md:gap-14 md:py-24">
          <Reveal className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#2c4438]/70">Why it matters</p>
            <h2 className="text-[clamp(2.1rem,5vw,3.8rem)] leading-[0.96] text-[#112219]">Your life does not need more inputs. It needs cleaner choices.</h2>
          </Reveal>

          <Reveal className="space-y-5" delay={90}>
            {pressurePoints.map((point) => (
              <div key={point} className="rounded-[1.4rem] border border-[#24362b]/14 bg-[#f8f1e9]/66 px-6 py-5">
                <p className="text-lg leading-8 text-[#1f3429]/87">{point}</p>
              </div>
            ))}
            <p className="pt-2 text-base leading-8 text-[#1f3429]/82">
              Atriae reduces the drag between reflection and execution, so momentum comes from clarity — not pressure.
            </p>
          </Reveal>
        </section>

        <section className="grid gap-8 border-b border-[#223228]/12 py-20 md:grid-cols-[1fr_1fr] md:gap-14 md:py-24">
          <Reveal className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#2c4438]/70">About Atriae</p>
            <h2 className="text-[clamp(2.1rem,4.8vw,3.9rem)] leading-[0.98] text-[#112219]">Designed for people who want to live with intention.</h2>
          </Reveal>

          <Reveal className="space-y-5 text-lg leading-8 text-[#21362a]/84" delay={120}>
            <p>
              Atriae was built for the quiet work behind meaningful lives: making better decisions, honoring attention,
              and moving in alignment with what actually matters.
            </p>
            <p>
              This is not another dashboard or habit tracker. It is a composed environment for thinking clearly when
              your mind is full and your standards are high.
            </p>
          </Reveal>
        </section>

        <section className="py-20 md:py-28">
          <Reveal className="relative overflow-hidden rounded-[2.2rem] border border-[#1f3126]/16 bg-[linear-gradient(140deg,rgba(245,237,227,0.92),rgba(225,236,219,0.84))] px-8 py-12 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-[42%] border border-[#1f3126]/14 bg-[#ecccd2]/45" />
            <p className="text-xs uppercase tracking-[0.26em] text-[#2b4337]/72">Final invitation</p>
            <h2 className="max-w-3xl pt-5 text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.94] text-[#12231a]">
              Enter a calmer way of thinking.
              <br />
              Request access to Atriae.
            </h2>
            <p className="max-w-2xl pt-6 text-lg leading-8 text-[#20352a]/82">
              Join people designing a quieter, sharper inner operating system for their work and life.
            </p>
            <div className="pt-8">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#16281f] bg-[#15271e] px-8 text-sm font-medium tracking-[0.08em] text-[#f6f6ef] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#102018]"
              >
                Request access
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
