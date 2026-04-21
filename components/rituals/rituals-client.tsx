"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";

import { completeRitualAction, createRitualAction } from "@/app/rituals/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Ritual } from "@/lib/atriae/types";

type RitualStatus = {
  completedToday: boolean;
  total: number;
  lastCompletedAt: string | null;
};

type Props = {
  rituals: Ritual[];
  statuses: Record<string, RitualStatus>;
};

export function RitualsClient({ rituals, statuses }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate((v) => !v)}>{showCreate ? "Close" : "Craft ritual"}</Button>
      </div>

      {showCreate ? (
        <Card surface="paper" className="bg-card/70">
          <CardHeader>
            <CardTitle className="text-xl">Craft ritual</CardTitle>
            <CardDescription>Define one repeatable practice that protects clarity.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3"
              action={(formData) =>
                startTransition(async () => {
                  await createRitualAction(formData);
                  setShowCreate(false);
                })
              }
            >
              <Input name="title" placeholder="Title" required />
              <Input name="cadence" placeholder="Cadence (e.g., Daily · 10 min)" />
              <textarea
                name="prompt"
                placeholder="Prompt"
                rows={3}
                className="min-h-24 w-full resize-y rounded-2xl bg-background/72 px-4 py-3 text-[0.96rem] text-foreground outline-none transition focus:bg-background/90 focus:ring-2 focus:ring-ring/25"
              />
              <Button disabled={isPending} type="submit">
                {isPending ? "Saving…" : "Save ritual"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {rituals.length === 0 ? (
        <Card surface="glass">
          <CardHeader>
            <CardTitle className="text-xl">No rituals yet</CardTitle>
            <CardDescription>Start with one gentle check-in you can keep consistently.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rituals.map((ritual) => {
            const status = statuses[ritual.id] ?? { completedToday: false, total: 0, lastCompletedAt: null };
            return (
              <Card key={ritual.id} surface="tinted">
                <CardHeader>
                  <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                    Ritual
                  </p>
                  <CardTitle className="pt-3 text-2xl">{ritual.title}</CardTitle>
                  <CardDescription>{ritual.cadence ?? "Cadence not set"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-paper/70 p-4 text-sm text-muted-foreground">{ritual.prompt || "No ritual prompt yet."}</div>
                  <p className="text-xs text-muted-foreground">
                    {status.completedToday ? "Completed today" : "Not completed today"} · {status.total} completions
                    {status.lastCompletedAt ? ` · Last ${new Date(status.lastCompletedAt).toLocaleDateString()}` : ""}
                  </p>
                  <form
                    action={(formData) =>
                      startTransition(async () => {
                        await completeRitualAction(formData);
                      })
                    }
                  >
                    <input type="hidden" name="ritual_id" value={ritual.id} />
                    <Button variant="quiet" className="w-full justify-start" disabled={isPending}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Begin ritual
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
