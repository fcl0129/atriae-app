const focusItems = [
  {
    title: "Write one clear paragraph for your thesis chapter",
    context: "A quiet 45-minute block before noon."
  },
  {
    title: "Refine your weekly learning map",
    context: "Keep only the next three lessons visible."
  },
  {
    title: "Take a ten-minute clarity walk",
    context: "No audio, just observation and reset."
  }
];

const learningTopics = [
  {
    title: "Cognitive Load & Study Design",
    progress: "2 of 5 notes distilled"
  },
  {
    title: "Product Narrative Writing",
    progress: "Draft in progress · 60%"
  }
];

const ritual = {
  title: "Morning Alignment",
  description: "Open your day with three breaths, one intention, and one sentence about what matters most.",
  cta: "Begin"
};

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-14 px-1 pb-16 md:space-y-16">
      <header className="space-y-3 pt-2">
        <p className="text-xs uppercase text-muted-foreground/80" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
          Atriaé
        </p>
        <h1 className="text-[clamp(2.1rem,4vw,3.1rem)] leading-[0.95]">{greeting}</h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </header>

      <section className="space-y-5" aria-labelledby="todays-focus">
        <h2 id="todays-focus" className="text-2xl md:text-[2rem]">
          Today&apos;s focus
        </h2>
        <ol className="space-y-4">
          {focusItems.map((item, index) => (
            <li key={item.title} className="group transition-all duration-300 ease-out hover:translate-x-1">
              <p className="text-[1.05rem] leading-7 text-foreground/95">
                <span className="pr-2 text-muted-foreground/70">{String(index + 1).padStart(2, "0")}</span>
                {item.title}
              </p>
              <p className="pl-7 text-sm text-muted-foreground">{item.context}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-5" aria-labelledby="continue-learning">
        <h2 id="continue-learning" className="text-2xl md:text-[2rem]">
          Continue learning
        </h2>
        <ul className="space-y-4">
          {learningTopics.map((topic) => (
            <li key={topic.title} className="space-y-1 transition-colors duration-300 hover:text-foreground">
              <p className="text-lg leading-7">{topic.title}</p>
              <p className="text-sm text-muted-foreground">{topic.progress}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="daily-ritual">
        <h2 id="daily-ritual" className="text-2xl md:text-[2rem]">
          Daily ritual
        </h2>
        <div className="space-y-2">
          <h3 className="text-xl">{ritual.title}</h3>
          <p className="text-muted-foreground">{ritual.description}</p>
          <button
            type="button"
            className="editorial-cta mt-2 text-xs font-medium text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {ritual.cta}
          </button>
        </div>
      </section>

      <section className="space-y-2 pt-4" aria-labelledby="reflection">
        <h2 id="reflection" className="text-lg">
          Reflection
        </h2>
        <p className="text-sm text-muted-foreground">What deserves your calmest attention before the day closes?</p>
      </section>
    </section>
  );
}
