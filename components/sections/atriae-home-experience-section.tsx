"use client";

import { useEffect, useState } from "react";

import { IntelligenceInput, SubmissionPayload } from "@/components/ui/intelligence-input";
import { ThoughtCaptureLayer } from "@/components/ui/thought-capture-layer";

type GuidedMode = "clarity" | "plan" | "focus" | "decision";

type GuidedResponse = {
  sessionId: string;
  mode: GuidedMode;
  output: Record<string, unknown>;
  error?: string;
};

const rotatingPrompts = [
  "What do you want to understand today?",
  "Where do you need more clarity?",
  "Turn a thought into a clear path",
  "Refine something in your life"
];

const subtleSuggestions = ["Revisit what still feels unresolved", "Capture one thought before you switch context"];

function renderStructuredOutput(response: GuidedResponse) {
  const output = response.output as Record<string, unknown>;

  if (response.mode === "clarity") {
    return (
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">
        <p><strong>Core problem:</strong> {String(output.core_problem ?? "")}</p>
        <p><strong>What matters:</strong></p>
        <ul className="list-disc pl-5">{Array.isArray(output.what_matters) ? output.what_matters.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
        <p><strong>What doesn’t matter:</strong></p>
        <ul className="list-disc pl-5">{Array.isArray(output.what_doesnt_matter) ? output.what_doesnt_matter.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
        <p><strong>Next step:</strong> {String(output.next_step ?? "")}</p>
      </div>
    );
  }

  if (response.mode === "plan") {
    return (
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">
        <p><strong>Goal:</strong> {String(output.goal ?? "")}</p>
        <p><strong>Steps:</strong></p>
        <ul className="list-disc pl-5">{Array.isArray(output.steps) ? output.steps.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
        <p><strong>Timeline:</strong> {String(output.timeline ?? "")}</p>
        <p><strong>First action:</strong> {String(output.first_action ?? "")}</p>
      </div>
    );
  }

  if (response.mode === "focus") {
    return (
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">
        <p><strong>Focus task:</strong> {String(output.focus_task ?? "")}</p>
        <p><strong>Ignore:</strong></p>
        <ul className="list-disc pl-5">{Array.isArray(output.ignore) ? output.ignore.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
        <p><strong>Duration:</strong> {String(output.duration ?? "")}</p>
        <p><strong>Definition of done:</strong> {String(output.definition_of_done ?? "")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm leading-7 text-muted-foreground">
      <p><strong>Options:</strong></p>
      <ul className="list-disc pl-5">{Array.isArray(output.options) ? output.options.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
      <p><strong>Criteria:</strong></p>
      <ul className="list-disc pl-5">{Array.isArray(output.criteria) ? output.criteria.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
      <p><strong>Risks:</strong></p>
      <ul className="list-disc pl-5">{Array.isArray(output.risks) ? output.risks.map((item) => <li key={String(item)}>{String(item)}</li>) : null}</ul>
      <p><strong>Recommendation:</strong> {String(output.recommendation ?? "")}</p>
      <p><strong>Reasoning:</strong> {String(output.reasoning ?? "")}</p>
    </div>
  );
}

export function AtriaeHomeExperienceSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [response, setResponse] = useState<GuidedResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((previous) => (previous + 1) % rotatingPrompts.length);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitIntent = async (payload: SubmissionPayload) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError("");
      const res = await fetch("/api/atriae/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: payload.mode, input: payload.text, sessionId })
      });

      const data = (await res.json().catch(() => null)) as GuidedResponse | null;
      if (!res.ok || !data) {
        setError(data?.error ?? "Atriae could not complete this run. Please retry.");
        return;
      }

      setSessionId(data.sessionId);
      setResponse(data);
    } catch {
      setError("Atriae is unavailable right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-14 pb-20 pt-6 md:space-y-16 md:pt-10">
      <section className="space-y-7 md:space-y-9">
        <div className="space-y-3">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Atriae system</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.3rem)] leading-[0.92]">Think clearly. Choose well. Move with intention.</h1>
          <p className="text-sm text-muted-foreground md:text-base">A personal intelligence space for turning messy thoughts into calm direction.</p>
        </div>
        <IntelligenceInput
          className="mx-auto max-w-4xl"
          heading="What should we shape together right now?"
          placeholder={rotatingPrompts[promptIndex]}
          submitLabel="Begin"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitIntent}
        />
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Output</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Clarity flow</h2>
        </div>

        {isSubmitting ? <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">Generating structured output…</p> : null}

        {error ? <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{error}</p> : null}

        {response ? (
          <article className="space-y-5 rounded-3xl bg-card/65 p-5 md:p-6">
            <p className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">{response.mode} mode</p>
            {renderStructuredOutput(response)}
          </article>
        ) : (
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
            Submit an intent above to generate a concise structured output with next actions.
          </p>
        )}
      </section>

      <ThoughtCaptureLayer />

      <section className="space-y-3 pb-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Small prompts</p>
        <div className="flex flex-wrap gap-2.5">
          {subtleSuggestions.map((suggestion) => (
            <p key={suggestion} className="rounded-full bg-background/66 px-4 py-2 text-xs tracking-[0.12em] text-muted-foreground">
              {suggestion}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
