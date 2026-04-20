import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Learning Compass",
    text: "Collect ideas, create study arcs, and keep your curiosity organized in one soft space."
  },
  {
    title: "Daily Ritual Layer",
    text: "Shape grounding routines with room for intention, reflection, and renewal."
  },
  {
    title: "Life Dashboard",
    text: "A clear pulse of what matters now — personal projects, focus, and emotional weather."
  }
];

export default function HomePage() {
  return (
    <section className="space-y-[var(--space-section)]">
      <PageHero
        eyebrow="Personal OS"
        title="Welcome to your calm command center"
        description="Atriaé is your personal home for learning, rituals, and thoughtful organization. This foundation is intentionally simple so the product can grow with care."
        cta="Begin"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 text-sm text-muted-foreground">{section.text}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
