import { cn } from "@/lib/utils";
import { StructuredOutput } from "@/lib/intent-transform";

type LearningBlockProps = {
  output: StructuredOutput;
  className?: string;
};

export function LearningBlock({ output, className }: LearningBlockProps) {
  return (
    <article className={cn("space-y-6 rounded-3xl bg-card/65 p-5 md:p-6", className)}>
      <header className="space-y-2">
        <p className="text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">{output.mode} flow</p>
        <h3 className="text-xl leading-snug md:text-2xl">{output.source}</h3>
        {output.refinementNote ? <p className="text-xs text-muted-foreground">Refined with: {output.refinementNote}</p> : null}
      </header>

      <div className="space-y-5">
        {output.sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h4 className="text-sm font-medium uppercase tracking-[0.14em] text-foreground/80">{section.title}</h4>
            <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground md:text-base">
              {section.points.map((point) => (
                <li key={point} className="list-inside list-disc marker:text-foreground/30">
                  {point}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
