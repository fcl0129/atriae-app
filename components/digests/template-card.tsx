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
    <Card className="group h-full border-border/80 bg-gradient-to-b from-paper via-paper to-ivory-100/70" surface="paper">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.64rem] uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
            {category}
          </p>
          <span className="rounded-full border border-border/80 bg-white/80 px-3 py-1 text-[0.65rem] text-muted-foreground">
            {suggestedSchedule}
          </span>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-2xl leading-tight">{template.display_name}</CardTitle>
          <CardDescription className="text-sm leading-7">{template.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-5 pt-0">
        <div className="rounded-2xl border border-border/70 bg-white/65 p-4">
          <p className="text-[0.7rem] uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
            Recommended use case
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground/90">{recommendedUseCase}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {moduleTags.map((tag) => (
            <span key={tag} className="rounded-full border border-border/70 bg-paper/80 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button onClick={() => onUseTemplate(template)} disabled={isSubmitting}>
            {isSubmitting ? "Activating..." : "Use template"}
          </Button>
          <Button variant="quiet" onClick={() => onPreview(template)}>
            Preview
          </Button>
          <Button variant="ghost" onClick={() => onCustomize(template)}>
            Customize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
