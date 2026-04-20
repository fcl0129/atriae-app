import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export default function RitualsPage() {
  return (
    <section className="space-y-6">
      <PageHero
        eyebrow="Rituals"
        title="Design your daily reset"
        description="Build small recurring rituals that help you reset, center, and move through your day with intention."
        cta="Craft ritual"
      />
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder: morning/evening flows, streaks, and reflective prompts.
        </CardContent>
      </Card>
    </section>
  );
}
