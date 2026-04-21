import { redirect } from "next/navigation";

import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profileResult, topicsResult, ritualsResult, checkinsResult] = await Promise.all([
    supabase.from("profiles").select("display_name,email,morning_ritual_reminder").eq("id", user.id).maybeSingle(),
    supabase.from("learning_topics").select("id,name,progress").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("rituals").select("id,title,cadence").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("ritual_checkins").select("ritual_id,completed_at").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(5)
  ]);

  const profile = profileResult.data;
  const topics = topicsResult.data ?? [];
  const rituals = ritualsResult.data ?? [];
  const recentCheckins = checkinsResult.data ?? [];

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(now);
  const todayKey = now.toISOString().slice(0, 10);
  const completedToday = recentCheckins.some((item: { completed_at: string }) => item.completed_at.slice(0, 10) === todayKey);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-12 px-1 pb-16 md:space-y-14">
      <header className="space-y-3 pt-2">
        <p className="text-xs uppercase text-muted-foreground/80" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
          Atriae dashboard
        </p>
        <h1 className="text-[clamp(2.1rem,4vw,3.1rem)] leading-[0.95]">{greeting}{profile?.display_name ? `, ${profile.display_name}` : ""}</h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </header>

      <IntelligencePanel />

      <section className="space-y-5" aria-labelledby="overview">
        <h2 id="overview" className="text-2xl md:text-[2rem]">
          Overview
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>{topics.length} learning topic{topics.length === 1 ? "" : "s"}</li>
          <li>{rituals.length} ritual{rituals.length === 1 ? "" : "s"}</li>
          <li>{completedToday ? "At least one ritual completed today" : "No ritual completion yet today"}</li>
          {profile?.morning_ritual_reminder ? <li>Morning reminder: {profile.morning_ritual_reminder}</li> : null}
        </ul>
      </section>

      <section className="space-y-5" aria-labelledby="learning-threads">
        <h2 id="learning-threads" className="text-2xl md:text-[2rem]">
          Learning threads
        </h2>
        {topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics yet. Begin one thread in Learn.</p>
        ) : (
          <ul className="space-y-3">
            {topics.slice(0, 4).map((topic: { id: string; name: string; progress: number }) => (
              <li key={topic.id} className="space-y-1">
                <p className="text-lg leading-7">{topic.name}</p>
                <p className="text-sm text-muted-foreground">{topic.progress}% progressed</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-5" aria-labelledby="ritual-status">
        <h2 id="ritual-status" className="text-2xl md:text-[2rem]">
          Ritual rhythm
        </h2>
        {rituals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rituals yet. Craft one gentle anchor in Rituals.</p>
        ) : (
          <ul className="space-y-3">
            {rituals.slice(0, 4).map((ritual: { id: string; title: string; cadence: string | null }) => (
              <li key={ritual.id} className="space-y-1">
                <p className="text-lg leading-7">{ritual.title}</p>
                <p className="text-sm text-muted-foreground">{ritual.cadence ?? "Cadence not set"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
