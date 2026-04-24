import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
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

  await ensureDashboardForUser(supabase, user.id);
  const views = await fetchDashboardViews(supabase, user.id);

  if (views.length === 0) {
    return (
      <section className="mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-3xl">Your dashboard is warming up</h1>
        <p className="mt-3 text-sm text-muted-foreground">Atriae is preparing your first view. Please refresh in a moment.</p>
      </section>
    );
  }

  const defaultView = views.find((view) => view.isDefault) ?? views[0];

  return <DashboardClient initialViews={views} initialViewId={defaultView.id} suggestions={buildSuggestions(defaultView)} />;
}
