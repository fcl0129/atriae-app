import { CheckCircle2, MoonStar, SunMedium } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rituals = [
  {
    title: "Morning Tuning",
    cadence: "Daily · 12 min",
    prompt: "Tea, breath, and one handwritten intention before notifications.",
    icon: SunMedium
  },
  {
    title: "Midday Reset",
    cadence: "Weekdays · 7 min",
    prompt: "Step away from screens, move your body, and choose one next step.",
    icon: CheckCircle2
  },
  {
    title: "Evening Closing",
    cadence: "Daily · 10 min",
    prompt: "Review what mattered, release open loops, and soften into rest.",
    icon: MoonStar
  }
];

export default function RitualsPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Rituals"
        title="Gentle routines and resets"
        description="Design daily practices that protect your attention and create emotional continuity."
        action={<Button>Craft ritual</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rituals.map((ritual) => {
          const Icon = ritual.icon;

          return (
            <Card key={ritual.title} surface="tinted">
              <CardHeader>
                <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                  Ritual Card
                </p>
                <CardTitle className="pt-3 text-2xl">{ritual.title}</CardTitle>
                <CardDescription>{ritual.cadence}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/80 bg-paper/80 p-4 text-sm text-muted-foreground">
                  {ritual.prompt}
                </div>
                <Button variant="quiet" className="w-full justify-start">
                  <Icon className="mr-2 h-4 w-4" />
                  Begin ritual
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card surface="glass">
        <CardHeader>
          <CardTitle className="text-xl">Beautiful empty state</CardTitle>
          <CardDescription>
            No custom rituals yet. Start with one two-minute check-in to set a gentle rhythm.
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
