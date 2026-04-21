import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { IntelligenceInput } from "@/components/ui/intelligence-input";

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

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-12 px-1 pb-16 md:space-y-14">
      <header className="space-y-3 pt-2">
        <p className="text-xs uppercase text-muted-foreground/80" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
          Atriae dashboard
        </p>
        <h1 className="text-[clamp(2.1rem,4vw,3.1rem)] leading-[0.95]">{greeting}</h1>
        <p className="text-sm text-muted-foreground">{today}</p>
        <p className="text-xs text-muted-foreground">{profile?.email}</p>
      </header>

      <IntelligenceInput
        heading="What deserves your clearest attention right now?"
        placeholder="Capture a thought, a decision, or a question"
      />

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
          Learning threads
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

      <section className="space-y-2 pt-2" aria-labelledby="reflection">
        <h2 id="reflection" className="text-lg">
          Reflection
        </h2>
        <p className="text-sm text-muted-foreground">What deserves your calmest attention before the day closes?</p>
      </section>
    </section>
  );
}
