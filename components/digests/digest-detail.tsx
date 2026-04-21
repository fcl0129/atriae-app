"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Copy, Mail, Pencil, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigestRun, UserDigestProfile } from "@/lib/digests";
import { isValidEmail } from "@/lib/digests/validation";
import { supabase } from "@/lib/supabase";

type DigestDetailProps = {
  digestId: string;
  initialRunId?: string;
};

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

export function DigestDetail({ digestId, initialRunId }: DigestDetailProps) {
  const router = useRouter();
  const client = useMemo(() => supabase, []);
  const [profile, setProfile] = useState<UserDigestProfile | null>(null);
  const [runs, setRuns] = useState<DigestRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(initialRunId ?? null);
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    async function load() {
      if (!client) {
        setMessage("Supabase is not configured.");
        setState("error");
        return;
      }

      const [{ data: profileData, error: profileError }, { data: runData, error: runError }] = await Promise.all([
        client.from("user_digest_profiles").select("*").eq("id", digestId).maybeSingle(),
        client.from("digest_runs").select("*").eq("profile_id", digestId).order("scheduled_for", { ascending: false }).limit(30)
      ]);

      if (profileError || runError) {
        setMessage(profileError?.message ?? runError?.message ?? "Unable to load digest detail.");
        setState("error");
        return;
      }

      setProfile((profileData as UserDigestProfile | null) ?? null);
      const runItems = (runData ?? []) as DigestRun[];
      setRuns(runItems);
      setSelectedRunId((current) => current ?? runItems[0]?.id ?? null);
      setState("ready");
    }

    void load();
  }, [client, digestId]);

  const selectedRun = runs.find((run) => run.id === selectedRunId) ?? null;
  const renderHtml = (selectedRun?.render_payload?.html as string | undefined) ?? "";

  async function updateStatus(status: "active" | "paused" | "archived") {
    if (!client || !profile) return;
    const { error } = await client.from("user_digest_profiles").update({ status }).eq("id", profile.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setProfile({ ...profile, status });
  }

  async function duplicateProfile() {
    if (!client || !profile) return;
    const { data: authData } = await client.auth.getUser();
    if (!authData.user) {
      setMessage("Please sign in again before duplicating.");
      return;
    }

    const { data, error } = await client
      .from("user_digest_profiles")
      .insert({
        user_id: authData.user.id,
        template_id: profile.template_id,
        title: `${profile.title} Copy ${new Date().toLocaleDateString("en-US")}`,
        status: "paused",
        timezone: profile.timezone,
        scheduling_config: profile.scheduling_config,
        digest_config: profile.digest_config,
        module_config: profile.module_config
      })
      .select("id")
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push(`/digests/${data.id}`);
  }

  async function sendTest() {
    if (!client || !profile) return;
    const { data: sessionData } = await client.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setMessage("Please sign in before sending test email.");
      return;
    }
    if (!isValidEmail(testEmail)) {
      setMessage("Please provide a valid recipient email.");
      return;
    }

    const response = await fetch(`/api/digests/${profile.id}/send-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ to: testEmail })
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string; messageId?: string };
    if (!response.ok) {
      setMessage(payload.error ?? "Could not send test email.");
      return;
    }

    setMessage(`Test email sent successfully (${payload.messageId ?? "queued"}).`);
  }

  async function deleteProfile() {
    if (!client || !profile) return;
    const { error } = await client.from("user_digest_profiles").delete().eq("id", profile.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/digests");
  }

  return (
    <PageContainer className="space-y-8 pb-16">
      <SectionHeader
        eyebrow="Curated digests"
        title={profile?.title ?? "Digest detail"}
        description="Review past issues, open historical previews, and manage this ritual with precision."
        action={
          <Button variant="quiet" asChild>
            <Link href="/digests/history">Dispatch history</Link>
          </Button>
        }
      />

      {state === "loading" ? (
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 w-48 rounded bg-muted" />
          </CardHeader>
        </Card>
      ) : null}

      {message ? (
        <Card className="border-border/70 bg-paper/75">
          <CardContent className="py-4 text-sm">{message}</CardContent>
        </Card>
      ) : null}

      {state !== "loading" ? <Card surface="paper" className="border-border/80">
        <CardHeader>
          <CardTitle className="text-2xl">Ritual controls</CardTitle>
          <CardDescription>Pause, resume, duplicate, test, edit, or archive with one-step control.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {profile?.status === "active" ? (
            <Button variant="ghost" size="sm" onClick={() => void updateStatus("paused")}>
              <PauseCircle className="mr-2 h-4 w-4" />Pause
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => void updateStatus("active")}>
              <PlayCircle className="mr-2 h-4 w-4" />Resume
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => void duplicateProfile()}>
            <Copy className="mr-2 h-4 w-4" />Duplicate
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/digests/${digestId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />Edit
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void updateStatus("archived")}>
            <Archive className="mr-2 h-4 w-4" />Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void deleteProfile()}>
            <Trash2 className="mr-2 h-4 w-4" />Delete
          </Button>
        </CardContent>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
              placeholder="name@example.com"
              className="h-10 rounded-full border border-border/60 bg-background px-4 text-sm"
            />
            <Button variant="quiet" size="sm" onClick={() => void sendTest()}>
              <Mail className="mr-2 h-4 w-4" />Test send
            </Button>
          </div>
        </CardContent>
      </Card> : null}

      {state !== "loading" ? <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card surface="tinted" className="border-border/70">
          <CardHeader>
            <CardTitle className="text-xl">Published issues</CardTitle>
            <CardDescription>Open any issue to view the exact rendered email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {runs.length === 0 ? <p className="text-sm text-muted-foreground">No issues yet for this digest.</p> : null}
            {runs.map((run) => (
              <button
                key={run.id}
                type="button"
                onClick={() => setSelectedRunId(run.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedRunId === run.id ? "border-foreground/30 bg-paper/80" : "border-border/60 bg-paper/50"
                }`}
              >
                <p className="text-sm text-foreground/90">{run.subject_line ?? "(No subject captured)"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {run.status} · scheduled {formatDate(run.scheduled_for)} · sent {formatDate(run.completed_at)}
                </p>
                {run.status === "failed" && run.error_message ? <p className="mt-1 text-xs text-red-700">{run.error_message}</p> : null}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card surface="glass" className="border-border/70">
          <CardHeader>
            <CardTitle className="text-xl">Issue preview</CardTitle>
            <CardDescription>Rendered output from the selected issue.</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRun && renderHtml ? (
              <div className="max-h-[70vh] overflow-auto rounded-2xl border border-border/60 bg-white p-4">
                <div dangerouslySetInnerHTML={{ __html: renderHtml }} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a run with rendered content to preview.</p>
            )}
          </CardContent>
        </Card>
      </div> : null}
    </PageContainer>
  );
}
