import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardOnboarding } from "@/components/dashboard/dashboard-onboarding";
import { buildSuggestions } from "@/lib/dashboard/suggestions";
import { ensureDashboardForUser, fetchDashboardViews } from "@/lib/dashboard/service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
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

  const { data: existingViews } = await supabase.from("dashboard_views").select("id").eq("user_id", user.id).limit(1);

  if ((existingViews ?? []).length === 0) {
    return <DashboardOnboarding />;
  }

  await ensureDashboardForUser(supabase, user.id);
  const views = await fetchDashboardViews(supabase, user.id);

  if (views.length === 0) {
    return <DashboardOnboarding />;
  }

  const defaultView = views.find((view) => view.isDefault) ?? views[0];

  return <DashboardClient initialViews={views} initialViewId={defaultView.id} suggestions={buildSuggestions(defaultView)} />;
}
