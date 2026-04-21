"use client";

import { useEffect, useMemo, useState } from "react";

import { IntelligenceInput, SubmissionPayload } from "@/components/ui/intelligence-input";
import { LearningBlock } from "@/components/ui/learning-block";
import { ThoughtCaptureLayer } from "@/components/ui/thought-capture-layer";
import { StructuredOutput, exampleTransformations, transformIntentToOutput } from "@/lib/intent-transform";

const rotatingPrompts = [
  "What do you want to understand today?",
  "Plan your day with intention",
  "Turn a thought into a system",
  "Refine something in your life"
];

const refinementSuggestions = ["Make this more efficient", "Simplify this plan"];

const subtleSuggestions = ["Continue what you started yesterday", "Refine your routine"];

export function AtriaeHomeExperienceSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [outputs, setOutputs] = useState<StructuredOutput[]>([]);
  const [latestIntent, setLatestIntent] = useState<SubmissionPayload | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((previous) => (previous + 1) % rotatingPrompts.length);
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  const exampleOutputs = useMemo(
    () => exampleTransformations.map((payload) => transformIntentToOutput(payload)),
    []
  );

  const handleSubmitIntent = (payload: SubmissionPayload) => {
    setLatestIntent(payload);
    setOutputs((current) => [transformIntentToOutput(payload), ...current]);
  };

  const handleRefinement = (adjustment: string) => {
    if (!latestIntent) return;

    setOutputs((current) => [transformIntentToOutput(latestIntent, adjustment), ...current]);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-20 pb-24 pt-10 md:space-y-24 md:pt-16">
      <section className="space-y-7 md:space-y-9">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Atriae home</p>
        <IntelligenceInput
          className="mx-auto max-w-4xl p-6 md:p-8"
          heading="What should we shape together right now?"
          placeholder={rotatingPrompts[promptIndex]}
          submitLabel="Begin"
          onSubmit={handleSubmitIntent}
        />
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Intent outputs</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Structured output stack</h2>
        </div>

        <div className="space-y-7 border-l border-border/60 pl-5 md:pl-7">
          {outputs.length > 0 ? (
            outputs.map((output) => <LearningBlock key={output.id} output={output} />)
          ) : (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              Submit an intent above to generate a clean learning block with a plan, breakdown, summary, and next steps.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Refinement loop</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Re-run with adjustments</h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {refinementSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleRefinement(suggestion)}
              className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {!latestIntent ? <p className="text-sm text-muted-foreground">Create one output first, then apply refinements.</p> : null}
      </section>

      <ThoughtCaptureLayer />

      <section className="space-y-7">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Example transformations</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Reference output patterns</h2>
        </div>
        <div className="space-y-7 border-l border-border/60 pl-5 md:pl-7">
          {exampleOutputs.map((output) => (
            <LearningBlock key={output.id} output={output} />
          ))}
        </div>
      </section>

      <section className="space-y-3 pb-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Suggestions</p>
        <div className="flex flex-wrap gap-2.5">
          {subtleSuggestions.map((suggestion) => (
            <p
              key={suggestion}
              className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs tracking-[0.12em] text-muted-foreground"
            >
              {suggestion}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
