import type { DigestTemplate } from "@/lib/digests";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplateCardProps {
  template: DigestTemplate;
  category: string;
  recommendedUseCase: string;
  moduleTags: string[];
  suggestedSchedule: string;
  onPreview: (template: DigestTemplate) => void;
  onCustomize: (template: DigestTemplate) => void;
  onUseTemplate: (template: DigestTemplate) => void;
  isSubmitting?: boolean;
}

export function TemplateCard({
  template,
  category,
  recommendedUseCase,
  moduleTags,
  suggestedSchedule,
  onPreview,
  onCustomize,
  onUseTemplate,
  isSubmitting
}: TemplateCardProps) {
  return (
    <Card className="group h-full border-border/70 bg-gradient-to-b from-paper via-paper to-ivory-100/60 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.45)]" surface="paper">
      <CardHeader className="space-y-4 pb-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.64rem] uppercase text-muted-foreground/90" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
            {category}
          </p>
          <span className="rounded-full border border-border/70 bg-white/85 px-3 py-1 text-[0.65rem] text-muted-foreground">
            {suggestedSchedule}
          </span>
        </div>

        <div className="space-y-2.5">
          <CardTitle className="text-[1.62rem] leading-tight tracking-tight">{template.display_name}</CardTitle>
          <CardDescription className="text-sm leading-7 text-foreground/78">{template.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-5 pt-0">
        <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
          <p className="text-[0.7rem] uppercase text-muted-foreground/90" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
            Best for
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground/90">{recommendedUseCase}</p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/50 pt-4">
          {moduleTags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/70 bg-paper/85 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button onClick={() => onUseTemplate(template)} disabled={isSubmitting}>
            {isSubmitting ? "Preparing…" : "Begin with this brief"}
          </Button>
          <Button variant="quiet" onClick={() => onPreview(template)}>
            Open preview
          </Button>
          <Button variant="ghost" onClick={() => onCustomize(template)}>
            Refine
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
