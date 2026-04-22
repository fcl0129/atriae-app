import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { LearnClient } from "@/components/learn/learn-client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LearnPage() {
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

  const { data: topics } = await supabase.from("learning_topics").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Learn"
        title="A focused learning space"
        description="Keep only what sharpens your thinking, then convert it into practical understanding."
      />
      <LearnClient topics={topics ?? []} />
    </PageContainer>
  );
}
