import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHero
        eyebrow="Overview"
        title="Dashboard"
        description="Your daily snapshot will live here: priorities, reflections, and momentum signals."
        cta="Design blocks"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s focus</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Placeholder for top priorities and energy level.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rhythm score</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Placeholder for consistency across rituals and learning.</CardContent>
        </Card>
      </div>
    </section>
  );
}
