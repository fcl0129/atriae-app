"use client";

import { useEffect, useMemo, useState } from "react";

import { IntelligenceInput, SubmissionPayload } from "@/components/ui/intelligence-input";
import { LearningBlock } from "@/components/ui/learning-block";
import { ThoughtCaptureLayer } from "@/components/ui/thought-capture-layer";
import { StructuredOutput, exampleTransformations, transformIntentToOutput } from "@/lib/intent-transform";

const rotatingPrompts = [
  "What do you want to understand today?",
  "Where do you need more clarity?",
  "Turn a thought into a clear path",
  "Refine something in your life"
];

const refinementSuggestions = ["Make this lighter", "Make this more concrete"];

const subtleSuggestions = ["Revisit what still feels unresolved", "Capture one thought before you switch context"];

export function AtriaeHomeExperienceSection() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [outputs, setOutputs] = useState<StructuredOutput[]>([]);
  const [latestIntent, setLatestIntent] = useState<SubmissionPayload | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((previous) => (previous + 1) % rotatingPrompts.length);
    }, 3800);

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
          onSubmit={handleSubmitIntent}
        />
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Output</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Clarity flow</h2>
        </div>

        <div className="space-y-7 md:space-y-8">
          {outputs.length > 0 ? (
            outputs.map((output) => <LearningBlock key={output.id} output={output} />)
          ) : (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              Submit an intent above to generate a concise breakdown, clearer structure, and next steps you can act on now.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Refinement</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Adjust the response</h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {refinementSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleRefinement(suggestion)}
              className="rounded-full bg-background/70 px-4 py-2 text-xs tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {!latestIntent ? <p className="text-sm text-muted-foreground">Create one output first, then refine it.</p> : null}
      </section>

      <ThoughtCaptureLayer />

      <section className="space-y-7">
        <div className="space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Examples</p>
          <h2 className="text-2xl leading-tight md:text-[2rem]">Reference transformations</h2>
        </div>
        <div className="space-y-7 md:space-y-8">
          {exampleOutputs.map((output) => (
            <LearningBlock key={output.id} output={output} />
          ))}
        </div>
      </section>

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
