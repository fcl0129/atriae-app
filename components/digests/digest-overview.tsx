"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarClock, CircleAlert, Copy, MailCheck, PauseCircle, PlayCircle } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigestRun, UserDigestProfile } from "@/lib/digests";
import { supabase } from "@/lib/supabase";

type AsyncState = "loading" | "ready" | "error";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function summarizeError(error: string | null) {
  if (!error) return "The send did not complete.";
  if (error.toLowerCase().includes("missing personalization.deliveryemail")) {
    return "Missing destination email in personalization settings. Add a delivery email, then retry.";
  }
  if (error.toLowerCase().includes("timeout")) {
    return "Delivery timed out. The system will retry automatically if allowed.";
  }
  return error;
}

export function DigestOverview() {
  const client = useMemo(() => supabase, []);
  const [state, setState] = useState<AsyncState>("loading");
  const [message, setMessage] = useState("");
  const [profiles, setProfiles] = useState<UserDigestProfile[]>([]);
  const [failedRuns, setFailedRuns] = useState<DigestRun[]>([]);

  useEffect(() => {
    async function load() {
      if (!client) {
        setMessage("Supabase is not configured.");
        setState("error");
        return;
      }

      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData.user) {
        setMessage("Please sign in to manage digests.");
        setState("error");
        return;
      }

      const userId = authData.user.id;
      const [{ data: profileData, error: profileError }, { data: runData, error: runError }] = await Promise.all([
        client.from("user_digest_profiles").select("*").eq("user_id", userId).order("next_run_at", { ascending: true }),
        client
          .from("digest_runs")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "failed")
          .order("scheduled_for", { ascending: false })
          .limit(4)
      ]);

      if (profileError || runError) {
        setMessage(profileError?.message ?? runError?.message ?? "Could not load digest workspace.");
        setState("error");
        return;
      }

      setProfiles((profileData ?? []) as UserDigestProfile[]);
      setFailedRuns((runData ?? []) as DigestRun[]);
      setState("ready");
    }

    void load();
  }, [client]);

  async function updateStatus(profileId: string, status: "active" | "paused") {
    if (!client) return;
    const { error } = await client.from("user_digest_profiles").update({ status }).eq("id", profileId);
    if (error) {
      setMessage(error.message);
      return;
    }

    setProfiles((current) => current.map((profile) => (profile.id === profileId ? { ...profile, status } : profile)));
  }

  const active = profiles.filter((profile) => profile.status === "active");
  const paused = profiles.filter((profile) => profile.status === "paused");

  const nextScheduled = active
    .map((profile) => profile.next_run_at)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;

  return (
    <PageContainer className="space-y-7 pb-16 md:space-y-8">
      <SectionHeader
        eyebrow="Curated digests"
        title="Ritual overview"
        description="A calm control room for what is live, what is paused, and what is scheduled next."
        action={
          <Button asChild>
            <Link href="/digests/new">Compose new digest</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card surface="tinted">
          <CardHeader>
            <CardDescription>Active digests</CardDescription>
            <CardTitle className="text-4xl">{active.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card surface="tinted">
          <CardHeader>
            <CardDescription>Paused digests</CardDescription>
            <CardTitle className="text-4xl">{paused.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card surface="glass">
          <CardHeader>
            <CardDescription>Next scheduled send</CardDescription>
            <CardTitle className="text-xl">{formatDate(nextScheduled)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card surface="paper" className="border-border/80">
        <CardHeader>
          <CardTitle className="text-2xl">Studio shortcuts</CardTitle>
          <CardDescription>Move between templates, history, and builder without losing context.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="quiet" asChild className="justify-between">
            <Link href="/digests/history">
              Open dispatch history
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="quiet" asChild className="justify-between">
            <Link href="/digests/templates">
              Browse templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="quiet" asChild className="justify-between">
            <Link href="/digests/new">
              Compose new digest
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="quiet" asChild className="justify-between">
            <Link href="/settings">
              Delivery settings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {state === "error" ? (
        <Card className="border-red-200/80 bg-red-50/40">
          <CardContent className="py-5 text-sm text-foreground/90">{message}</CardContent>
        </Card>
      ) : null}

      {state === "loading" ? (
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-52 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-20 rounded bg-muted/70" />
          </CardContent>
        </Card>
      ) : null}

      {state === "ready" && profiles.length === 0 ? (
        <Card surface="glass">
          <CardHeader>
            <CardTitle>Your collection is empty</CardTitle>
            <CardDescription>Begin with a template, then refine the ritual over time.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {profiles.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {profiles.map((profile) => (
            <Card key={profile.id} surface="paper" className="border-border/80">
              <CardHeader>
                <CardDescription>{profile.status === "active" ? "Active" : "Paused"}</CardDescription>
                <CardTitle className="text-2xl">{profile.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Next delivery: {formatDate(profile.next_run_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.status === "active" ? (
                  <Button variant="ghost" size="sm" onClick={() => void updateStatus(profile.id, "paused")}>
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => void updateStatus(profile.id, "active")}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/digests/${profile.id}`}>
                    <MailCheck className="mr-2 h-4 w-4" />
                    Open brief
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/digests/${profile.id}/edit`}>
                    <Copy className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {failedRuns.length > 0 ? (
        <Card surface="tinted" className="border-border/70">
          <CardHeader>
            <CardTitle className="text-xl">Recent delivery issues</CardTitle>
            <CardDescription>Clear guidance so fixes remain quick and predictable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {failedRuns.map((run) => (
              <div key={run.id} className="rounded-2xl bg-paper/80 p-4">
                <p className="flex items-start gap-2 text-sm leading-6 text-foreground/90">
                  <CircleAlert className="mt-0.5 h-4 w-4" />
                  {summarizeError(run.error_message)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Scheduled {formatDate(run.scheduled_for)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </PageContainer>
  );
}
