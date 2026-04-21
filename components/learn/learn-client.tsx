"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowUpRight, Bookmark, Clock3, Search } from "lucide-react";

import { createLearningTopicAction, updateLearningTopicAction } from "@/app/learn/actions";
import type { LearningTopic } from "@/lib/atriae/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = { topics: LearningTopic[] };

export function LearnClient({ topics }: Props) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((topic) => [topic.name, topic.pace ?? ""].join(" ").toLowerCase().includes(q));
  }, [query, topics]);

  return (
    <>
      <Card surface="glass">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search learning threads"
              aria-label="Search learning threads"
              className="pl-9"
            />
          </div>
          <Button variant="secondary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Add topic"}
          </Button>
        </CardContent>
      </Card>

      {showCreate ? (
        <Card surface="paper" className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-xl">Add learning topic</CardTitle>
            <CardDescription>Capture a thread worth steady attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 md:grid-cols-2"
              action={(formData) =>
                startTransition(async () => {
                  await createLearningTopicAction(formData);
                  setShowCreate(false);
                })
              }
            >
              <Input name="name" placeholder="Topic name" required />
              <Input name="pace" placeholder="Pace (optional)" />
              <Input name="resources_count" type="number" min={0} placeholder="Resources count" />
              <Input name="progress" type="number" min={0} max={100} placeholder="Progress (0-100)" />
              <Button type="submit" disabled={isPending} className="md:col-span-2">
                {isPending ? "Saving…" : "Save topic"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {filtered.length === 0 ? (
        <Card surface="paper" className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-xl">No learning topics yet</CardTitle>
            <CardDescription>Start with one thread you want to understand more deeply.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((topic) => (
            <Card key={topic.id} surface="paper" className="bg-card/70">
              <CardHeader>
                <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                  Learning thread
                </p>
                <CardTitle className="pt-3 text-2xl">{topic.name}</CardTitle>
                <CardDescription>{topic.resources_count} references in this thread.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form
                  className="space-y-3"
                  action={(formData) =>
                    startTransition(async () => {
                      await updateLearningTopicAction(formData);
                    })
                  }
                >
                  <input type="hidden" name="id" value={topic.id} />
                  <label className="flex items-center justify-between text-sm gap-2">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock3 className="h-4 w-4" /> Pace
                    </span>
                    <Input name="pace" defaultValue={topic.pace ?? ""} className="h-8 w-36" />
                  </label>
                  <label className="flex items-center justify-between text-sm gap-2">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Bookmark className="h-4 w-4" /> Resources
                    </span>
                    <Input name="resources_count" type="number" min={0} defaultValue={topic.resources_count} className="h-8 w-20" />
                  </label>
                  <label className="flex items-center justify-between text-sm gap-2">
                    <span className="text-muted-foreground">Progress</span>
                    <Input name="progress" type="number" min={0} max={100} defaultValue={topic.progress} className="h-8 w-20" />
                  </label>
                  <div className="h-1.5 rounded-full bg-muted/85">
                    <div className="h-full rounded-full bg-matcha-500" style={{ width: `${topic.progress}%` }} />
                  </div>
                  <Button type="submit" variant="ghost" className="w-full justify-between rounded-xl bg-paper/70" disabled={isPending}>
                    Update
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
