"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createOptionalBrowserSupabaseClient } from "@/lib/supabase/browser";

type RunRow = {
  id: string;
  status: string;
  subject_line: string | null;
  scheduled_for: string;
  completed_at: string | null;
  error_message: string | null;
  profile_id: string;
  user_digest_profiles?: { title: string } | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusStyle(status: string) {
  if (status === "sent") return "bg-emerald-100/70 text-emerald-900";
  if (status === "failed") return "bg-red-100/70 text-red-900";
  return "bg-amber-100/80 text-amber-900";
}

export function DigestHistory() {
  const client = useMemo(() => createOptionalBrowserSupabaseClient(), []);
  const [rows, setRows] = useState<RunRow[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    async function load() {
      if (!client) {
        setMessage(SUPABASE_PUBLIC_ENV_ERROR);
        setState("error");
        return;
      }

      const { data: authData } = await client.auth.getUser();
      if (!authData.user) {
        setMessage("Please sign in to view digest history.");
        setState("error");
        return;
      }

      const { data, error } = await client
        .from("digest_runs")
        .select("id, status, subject_line, scheduled_for, completed_at, error_message, profile_id, user_digest_profiles(title)")
        .eq("user_id", authData.user.id)
        .order("scheduled_for", { ascending: false })
        .limit(80);

      if (error) {
        setMessage(error.message);
        setState("error");
        return;
      }

      setRows((data ?? []) as unknown as RunRow[]);
      setState("ready");
    }

    void load();
  }, [client]);

  const sent = rows.filter((run) => run.status === "sent");
  const failed = rows.filter((run) => run.status === "failed");
  const scheduled = rows.filter((run) => ["queued", "rendering", "sending"].includes(run.status));

  return (
    <PageContainer className="space-y-7 pb-16 md:space-y-8">
      <SectionHeader
        eyebrow="Curated digests"
        title="Dispatch history"
        description="Every issue in one place — sent, failed, and queued."
        action={
          <Button variant="quiet" asChild>
            <Link href="/digests">Back to rituals</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card surface="tinted">
          <CardHeader>
            <CardDescription>Sent runs</CardDescription>
            <CardTitle className="text-3xl">{sent.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card surface="tinted">
          <CardHeader>
            <CardDescription>Failed runs</CardDescription>
            <CardTitle className="text-3xl">{failed.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card surface="glass">
          <CardHeader>
            <CardDescription>Scheduled / in-flight</CardDescription>
            <CardTitle className="text-3xl">{scheduled.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {message ? (
        <Card className="border-red-200/80 bg-red-50/40">
          <CardContent className="py-5 text-sm">{message}</CardContent>
        </Card>
      ) : null}

      {state === "loading" ? (
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-44 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-24 rounded bg-muted/70" />
          </CardContent>
        </Card>
      ) : null}

      {rows.length === 0 ? (
        <Card surface="glass">
          <CardHeader>
            <CardTitle>No dispatches yet</CardTitle>
            <CardDescription>Your first sent issue will appear here with subject and delivery state.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {rows.length > 0 ? (
        <Card surface="paper" className="overflow-hidden border-border/80">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border/70 bg-paper/60 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Ritual</th>
                    <th className="px-5 py-3">Subject line</th>
                    <th className="px-5 py-3">Scheduled</th>
                    <th className="px-5 py-3">Sent at</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((run) => (
                    <tr key={run.id} className="border-b border-border/60 last:border-b-0">
                      <td className="px-5 py-3">{run.user_digest_profiles?.title ?? "Digest"}</td>
                      <td className="px-5 py-3 text-foreground/90">{run.subject_line ?? "(Subject generated at send time)"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(run.scheduled_for)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(run.completed_at)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusStyle(run.status)}`}>{run.status}</span>
                        {run.status === "failed" && run.error_message ? (
                          <p className="mt-1 max-w-[28ch] text-xs text-red-700">{run.error_message}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/digests/${run.profile_id}?run=${run.id}`}>Open</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </PageContainer>
  );
}
