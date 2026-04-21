import { Bell, Lock, Palette, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SendTestEmailCard } from "@/components/settings/send-test-email-card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("display_name,morning_ritual_reminder").eq("id", user.id).maybeSingle();

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Settings"
        title="Quiet, personal defaults"
        description="Tune Atriae to your rhythm without adding noise to the experience."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card surface="paper" className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-2xl">Profile and cadence</CardTitle>
            <CardDescription>Personal defaults for how Atriae supports your day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileSettingsForm
              displayName={profile?.display_name ?? user.email?.split("@")[0] ?? ""}
              morningRitualReminder={profile?.morning_ritual_reminder ?? "08:00"}
            />
          </CardContent>
        </Card>

        <Card surface="glass">
          <CardHeader>
            <CardTitle className="text-2xl">System spaces</CardTitle>
            <CardDescription>Core controls, intentionally compact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Appearance", icon: Palette },
              { label: "Account", icon: UserRound },
              { label: "Privacy", icon: Lock },
              { label: "Notifications", icon: Bell }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  className="flex w-full items-center justify-between rounded-xl bg-paper/70 px-3 py-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <span>→</span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:max-w-2xl">
        <SendTestEmailCard />
      </div>
    </PageContainer>
  );
}
