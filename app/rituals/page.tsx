import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { RitualsClient } from "@/components/rituals/rituals-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RitualsPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/login?error=config");
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [ritualsResult, checkinsResult] = await Promise.all([
    supabase.from("rituals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("ritual_checkins").select("ritual_id,completed_at").eq("user_id", user.id)
  ]);

  const rituals = ritualsResult.data ?? [];
  const checkins = checkinsResult.data ?? [];
  const todayKey = new Date().toISOString().slice(0, 10);

  const statuses = rituals.reduce<Record<string, { completedToday: boolean; total: number; lastCompletedAt: string | null }>>((acc: Record<string, { completedToday: boolean; total: number; lastCompletedAt: string | null }>, ritual: { id: string }) => {
    const own = checkins.filter((c: { ritual_id: string; completed_at: string }) => c.ritual_id === ritual.id);
    const lastCompletedAt = own.length > 0 ? own.map((c: { completed_at: string }) => c.completed_at).sort().at(-1) ?? null : null;

    acc[ritual.id] = {
      total: own.length,
      completedToday: own.some((c: { completed_at: string }) => c.completed_at.slice(0, 10) === todayKey),
      lastCompletedAt
    };

    return acc;
  }, {});

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Rituals"
        title="Routines that protect clarity"
        description="Shape light practices that reset attention and support emotional continuity."
      />
      <RitualsClient rituals={rituals} statuses={statuses} />
    </PageContainer>
  );
}
