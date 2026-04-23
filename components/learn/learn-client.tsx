"use client";

import { useMemo, useState, useTransition } from "react";
import { BookOpenText, Headphones, Search, Sparkles } from "lucide-react";

import { createLearningTopicAction, updateLearningTopicAction } from "@/app/learn/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LearningTopic } from "@/lib/atriae/types";

type Props = { topics: LearningTopic[] };
type AtriaeMode = "learn" | "plan" | "focus" | "organize";

type IntelligenceResponse = {
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  next_steps: string[];
};

type AudioLessonResponse = {
  title: string;
  duration_minutes: number;
  intro: string;
  segments: { title: string; body: string }[];
  reflection_prompt: string;
  audio_url: string | null;
  audio_available: boolean;
};

const aiActions: { label: string; prompt: string; mode: AtriaeMode }[] = [
  { label: "Explain this clearly", prompt: "Explain this topic clearly in plain language.", mode: "learn" },
  { label: "Break into a study path", prompt: "Create a study path with progressive steps for this topic.", mode: "plan" },
  { label: "Quiz me", prompt: "Create a short quiz and reflection prompts for this topic.", mode: "learn" },
  { label: "Summarize what matters", prompt: "Summarize the essential ideas and why they matter.", mode: "organize" },
  { label: "Turn into 5-minute lesson", prompt: "Turn this into a concise 5-minute lesson.", mode: "learn" }
];

export function LearnClient({ topics }: Props) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<IntelligenceResponse | null>(null);
  const [audioLesson, setAudioLesson] = useState<AudioLessonResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((topic) => [topic.name, topic.pace ?? ""].join(" ").toLowerCase().includes(q));
  }, [query, topics]);

  async function runTopicAction(topic: LearningTopic, action: (typeof aiActions)[number]) {
    setActiveTopicId(topic.id);
    setAiError(null);
    setAudioLesson(null);
    setIsLoadingAI(true);

    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: action.mode, input: `${action.prompt}\n\nTopic: ${topic.name}\nPace: ${topic.pace ?? "Not set"}` })
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data?.error?.message ?? "Unable to generate support right now.");
        return;
      }
      setAiResult(data as IntelligenceResponse);
    } catch {
      setAiError("Atriae could not reach intelligence services. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  }

  async function generateAudioLesson(topic: LearningTopic) {
    setActiveTopicId(topic.id);
    setAiError(null);
    setAiResult(null);
    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/learn/audio-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.name, pace: topic.pace ?? null })
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data?.error?.message ?? "Unable to generate audio lesson right now.");
        return;
      }
      setAudioLesson(data as AudioLessonResponse);
    } catch {
      setAiError("Audio lesson is unavailable at the moment.");
    } finally {
      setIsLoadingAI(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card surface="glass">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search learning studio" aria-label="Search learning studio" className="pl-9" />
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
            <CardDescription>Capture one subject you want to understand with depth.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 md:grid-cols-2" action={(formData) => startTransition(async () => { await createLearningTopicAction(formData); setShowCreate(false); })}>
              <Input name="name" placeholder="Topic name" required />
              <Input name="pace" placeholder="Pace (optional)" />
              <Input name="resources_count" type="number" min={0} placeholder="Resources count" />
              <Input name="progress" type="number" min={0} max={100} placeholder="Progress (0-100)" />
              <Button type="submit" disabled={isPending} className="md:col-span-2">{isPending ? "Saving…" : "Save topic"}</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {(aiResult || audioLesson || aiError || isLoadingAI) && activeTopicId ? (
        <Card surface="tinted">
          <CardHeader>
            <CardTitle className="text-xl">Atriae Learning Intelligence</CardTitle>
            <CardDescription>Understand this better with a calm, structured brief.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingAI ? <p className="text-sm text-muted-foreground">Preparing your learning brief…</p> : null}
            {aiError ? <p className="text-sm text-foreground">{aiError}</p> : null}
            {aiResult ? (
              <div className="space-y-3">
                <h3 className="text-2xl">{aiResult.title}</h3>
                <p className="text-sm text-muted-foreground">{aiResult.summary}</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {aiResult.sections.map((section) => (
                    <article key={section.heading} className="rounded-2xl border border-border/50 bg-background/60 p-3">
                      <p className="text-sm font-semibold">{section.heading}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{section.content}</p>
                    </article>
                  ))}
                </div>
                <ul className="space-y-1 text-sm">
                  {aiResult.next_steps.map((step) => (
                    <li key={step} className="rounded-xl bg-background/55 px-3 py-2">{step}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {audioLesson ? (
              <div className="space-y-3 rounded-2xl border border-border/55 bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Headphones className="h-4 w-4" /> Private lesson · {audioLesson.duration_minutes} minutes</div>
                <h3 className="text-2xl">{audioLesson.title}</h3>
                <p className="text-sm text-muted-foreground">{audioLesson.intro}</p>
                {audioLesson.audio_available && audioLesson.audio_url ? <audio controls src={audioLesson.audio_url} className="w-full" /> : <p className="text-xs text-muted-foreground">Audio playback is not available in this environment yet. Use the script below for listening workflows.</p>}
                <div className="space-y-2">
                  {audioLesson.segments.map((seg) => (
                    <article key={seg.title}>
                      <p className="font-medium">{seg.title}</p>
                      <p className="text-sm text-muted-foreground">{seg.body}</p>
                    </article>
                  ))}
                </div>
                <p className="text-sm"><span className="font-medium">Reflection:</span> {audioLesson.reflection_prompt}</p>
              </div>
            ) : null}
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
                <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>Learning studio</p>
                <CardTitle className="pt-3 text-2xl">{topic.name}</CardTitle>
                <CardDescription>{topic.resources_count} references · {topic.progress}% integrated.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form className="space-y-3" action={(formData) => startTransition(async () => { await updateLearningTopicAction(formData); })}>
                  <input type="hidden" name="id" value={topic.id} />
                  <label className="flex items-center justify-between text-sm gap-2"><span className="text-muted-foreground">Pace</span><Input name="pace" defaultValue={topic.pace ?? ""} className="h-8 w-36" /></label>
                  <label className="flex items-center justify-between text-sm gap-2"><span className="text-muted-foreground">Resources</span><Input name="resources_count" type="number" min={0} defaultValue={topic.resources_count} className="h-8 w-20" /></label>
                  <label className="flex items-center justify-between text-sm gap-2"><span className="text-muted-foreground">Progress</span><Input name="progress" type="number" min={0} max={100} defaultValue={topic.progress} className="h-8 w-20" /></label>
                  <div className="h-1.5 rounded-full bg-muted/85"><div className="h-full rounded-full bg-matcha-500" style={{ width: `${topic.progress}%` }} /></div>
                  <Button type="submit" variant="ghost" className="w-full justify-between rounded-xl bg-paper/70" disabled={isPending}>Update topic <BookOpenText className="h-4 w-4" /></Button>
                </form>

                <div className="space-y-2 border-t border-border/40 pt-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">AI support</p>
                  <div className="flex flex-wrap gap-2">
                    {aiActions.map((action) => (
                      <button key={action.label} className="rounded-full bg-background/60 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.13em] text-muted-foreground hover:text-foreground" onClick={() => runTopicAction(topic, action)}>
                        {action.label}
                      </button>
                    ))}
                    <button className="rounded-full bg-secondary/60 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.13em] text-foreground" onClick={() => generateAudioLesson(topic)}>
                      <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Audio lesson
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
