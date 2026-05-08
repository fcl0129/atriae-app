import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { MemoryClient } from "@/components/memory/memory-client";
import type { MemoryBlock, MemoryDailySummary } from "@/lib/memory/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getTodayBounds() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const start = new Date(`${todayKey}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { todayKey, start: start.toISOString(), end: end.toISOString() };
}

export default async function MemoryPage() {
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

  const { todayKey, start, end } = getTodayBounds();

  const [{ data: blocks }, { data: summary }] = await Promise.all([
    supabase
      .from("memory_blocks")
      .select("*")
      .eq("user_id", user.id)
      .gte("occurred_at", start)
      .lt("occurred_at", end)
      .order("created_at", { ascending: false }),
    supabase.from("memory_daily_summaries").select("*").eq("user_id", user.id).eq("summary_date", todayKey).maybeSingle()
  ]);

  return (
    <PageContainer className="max-w-6xl">
      <SectionHeader
        eyebrow="Memory"
        title="Memory"
        description="A private day memory for notes, voice-derived thoughts, meetings, and the gentle thread of what deserves to be remembered."
      />
      <MemoryClient initialBlocks={(blocks ?? []) as MemoryBlock[]} initialSummary={(summary as MemoryDailySummary | null) ?? null} todayKey={todayKey} />
    </PageContainer>
  );
}
