import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export default function LearnPage() {
  return (
    <section className="space-y-6">
      <PageHero
        eyebrow="Learning"
        title="Curate what you are learning"
        description="Track topics, save resources, and build gentle learning pathways without noise."
        cta="Add topics"
      />
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder: topic map, learning queues, and progress journaling.
        </CardContent>
      </Card>
    </section>
  );
}
