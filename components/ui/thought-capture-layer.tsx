"use client";

import { FormEvent, useState } from "react";

type ThoughtCaptureLayerProps = {
  onCapture?: (entry: string) => void;
};

export function ThoughtCaptureLayer({ onCapture }: ThoughtCaptureLayerProps) {
  const [value, setValue] = useState("");
  const [captured, setCaptured] = useState<string[]>([]);

  const handleCapture = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = value.trim();
    if (!normalized) return;

    setCaptured((current) => [normalized, ...current].slice(0, 4));
    onCapture?.(normalized);
    setValue("");
  };

  return (
    <section className="space-y-4 rounded-3xl bg-card/55 p-5 md:p-6">
      <div className="space-y-2">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">Thought capture</p>
        <h2 className="text-2xl leading-tight md:text-[2rem]">Catch a thought before it disappears</h2>
      </div>

      <form onSubmit={handleCapture} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Add an idea or reflection"
          className="w-full rounded-full bg-background/72 px-4 py-2.5 text-sm outline-none transition focus:bg-background/90 focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="submit"
          className="rounded-full bg-background/78 px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Capture
        </button>
      </form>

      {captured.length > 0 ? (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {captured.map((item) => (
            <li key={item} className="leading-7">
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Quick captures stay light and ready for structuring later.</p>
      )}
    </section>
  );
}
