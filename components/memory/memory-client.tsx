"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Layers3, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MemoryBlock, MemoryDailySummary, MemorySourceType } from "@/lib/memory/types";
import { cn } from "@/lib/utils";

type Props = {
  initialBlocks: MemoryBlock[];
  initialSummary: MemoryDailySummary | null;
  todayKey: string;
};

type MemoryIngestApiResponse = {
  blocks?: MemoryBlock[];
  error?: { message?: string };
};

type DailySummaryApiResponse = {
  summary?: MemoryDailySummary | null;
  empty?: boolean;
  message?: string;
  error?: { message?: string };
};

const sourceOptions: { value: MemorySourceType; label: string }[] = [
  { value: "manual_note", label: "Manual note" },
  { value: "voice_note", label: "Voice note" },
  { value: "meeting", label: "Meeting" },
  { value: "email", label: "Email" },
  { value: "calendar", label: "Calendar" },
  { value: "import", label: "Import" }
];

const blockLabels: Record<string, string> = {
  summary: "Summaries",
  decision: "Decisions",
  task: "Tasks",
  person: "People",
  meeting: "Meetings",
  idea: "Ideas",
  question: "Questions",
  follow_up: "Follow-ups",
  reference: "References"
};

function normalizeList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

export function MemoryClient({ initialBlocks, initialSummary, todayKey }: Props) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initialBlocks);
  const [summary, setSummary] = useState(initialSummary);
  const [sourceType, setSourceType] = useState<MemorySourceType>("manual_note");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [summaryMessage, setSummaryMessage] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const groupedBlocks = useMemo(() => {
    return blocks.reduce<Record<string, MemoryBlock[]>>((acc, block) => {
      if (!acc[block.block_type]) acc[block.block_type] = [];
      acc[block.block_type].push(block);
      return acc;
    }, {});
  }, [blocks]);

  async function captureMemory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCaptureError(null);
    setCaptureMessage(null);

    if (!text.trim()) {
      setCaptureError("Add a note first. Atriae will keep it private and shape only what you share.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/memory/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_type: sourceType, title: title.trim() || undefined, text: text.trim() })
      });
      const data = (await res.json()) as MemoryIngestApiResponse;

      if (!res.ok) {
        setCaptureError(data.error?.message ?? "Atriae couldn’t save this memory yet.");
        return;
      }

      const nextBlocks = data.blocks ?? [];
      setBlocks((current) => [...nextBlocks, ...current]);
      setText("");
      setTitle("");
      setCaptureMessage(`Saved ${nextBlocks.length} private memory ${nextBlocks.length === 1 ? "block" : "blocks"}.`);
      router.refresh();
    } catch {
      setCaptureError("Atriae couldn’t reach Memory. Please check your session and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function generateSummary() {
    setSummaryError(null);
    setSummaryMessage(null);
    setIsSummarizing(true);

    try {
      const res = await fetch("/api/memory/summarize-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayKey })
      });
      const data = (await res.json()) as DailySummaryApiResponse;

      if (!res.ok) {
        setSummaryError(data.error?.message ?? "Atriae couldn’t summarize this day yet.");
        return;
      }

      if (data.empty) {
        setSummaryMessage(data.message ?? "No blocks are saved for this day yet.");
        return;
      }

      if (data.summary) {
        setSummary(data.summary);
        setSummaryMessage("Daily summary refreshed.");
        router.refresh();
      }
    } catch {
      setSummaryError("Atriae couldn’t reach Memory summaries. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  }

  const summaryDecisions = normalizeList(summary?.decisions);
  const summaryOpenLoops = normalizeList(summary?.open_loops);
  const summaryPeople = normalizeList(summary?.people);
  const summaryFollowUps = normalizeList(summary?.follow_ups);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="space-y-5">
        <Card surface="glass" className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Capture
            </div>
            <CardTitle>Save a note into Memory</CardTitle>
            <CardDescription>
              Paste a meeting note, voice transcript, or loose thought. Atriae will structure it into private blocks you can return to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={captureMemory} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr]">
                <label className="space-y-2 text-sm text-muted-foreground">
                  Title <span className="text-muted-foreground/70">optional</span>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project check-in, Tuesday notes…" />
                </label>
                <label className="space-y-2 text-sm text-muted-foreground">
                  Source
                  <select
                    value={sourceType}
                    onChange={(event) => setSourceType(event.target.value as MemorySourceType)}
                    className="h-10 w-full rounded-xl bg-paper/80 px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                  >
                    {sourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="space-y-2 text-sm text-muted-foreground">
                Note
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="What happened, what was decided, what needs a return…"
                  className="min-h-44 w-full resize-y rounded-2xl bg-paper/80 px-4 py-3 text-sm leading-7 text-foreground placeholder:text-muted-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? "Structuring…" : "Save to Memory"}
                </Button>
                <p className="text-xs text-muted-foreground">Stored under your signed-in Supabase user only.</p>
              </div>
              {captureMessage ? <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary">{captureMessage}</p> : null}
              {captureError ? <p className="rounded-2xl bg-blush-100/80 px-4 py-3 text-sm text-foreground">{captureError}</p> : null}
            </form>
          </CardContent>
        </Card>

        <Card surface="tinted">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Daily summary
            </div>
            <CardTitle>{summary?.title ?? "A quiet synthesis for the day"}</CardTitle>
            <CardDescription>
              {summary?.narrative ?? "Generate a daily memory summary after you have saved a few blocks. Atriae will keep it concise and factual."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="secondary" onClick={generateSummary} disabled={isSummarizing || blocks.length === 0}>
              {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {summary ? "Regenerate summary" : "Generate summary"}
            </Button>
            {blocks.length === 0 ? <p className="text-sm text-muted-foreground">Capture a note first, then Atriae can gather the day.</p> : null}
            {summaryMessage ? <p className="text-sm text-primary">{summaryMessage}</p> : null}
            {summaryError ? <p className="text-sm text-foreground">{summaryError}</p> : null}
            {summary ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryList title="Decisions" items={summaryDecisions} />
                <SummaryList title="Open loops" items={summaryOpenLoops} />
                <SummaryList title="People" items={summaryPeople} />
                <SummaryList title="Follow-ups" items={summaryFollowUps} />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card surface="paper" className="min-h-[34rem]">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Layers3 className="h-3.5 w-3.5" /> Today’s blocks
          </div>
          <CardTitle>What Atriae is holding</CardTitle>
          <CardDescription>Memory blocks are structured fragments from your saved notes, grouped by type for fast return.</CardDescription>
        </CardHeader>
        <CardContent>
          {blocks.length === 0 ? (
            <div className="rounded-[var(--radius)] border border-dashed border-border/70 bg-paper/45 p-6">
              <p className="text-base text-foreground">Nothing saved for today yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Start with one honest paragraph. Atriae will turn it into a few quiet, searchable pieces.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedBlocks).map(([type, typeBlocks]) => (
                <section key={type} className="space-y-3">
                  <h3 className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{blockLabels[type] ?? type}</h3>
                  <div className="space-y-3">
                    {typeBlocks.map((block) => (
                      <article key={block.id} className="rounded-2xl border border-border/55 bg-card/56 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg leading-tight">{block.title}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">{block.summary}</p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{block.importance}/5</span>
                        </div>
                        {block.content ? <p className="mt-3 text-sm leading-7 text-foreground/80">{block.content}</p> : null}
                        {block.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {block.tags.map((tag) => (
                              <span key={`${block.id}-${tag}`} className="rounded-full bg-blush-100/70 px-2.5 py-1 text-xs text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-paper/45 p-4", items.length === 0 ? "opacity-70" : "")}> 
      <p className="text-sm font-medium text-foreground">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Nothing explicit yet.</p>
      )}
    </div>
  );
}
