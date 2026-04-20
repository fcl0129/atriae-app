import Link from "next/link";
import { ArrowRight, BookMarked, CalendarHeart, Compass, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Learning journeys",
    description: "Shape thoughtful study arcs and keep your ideas connected as your curiosity evolves.",
    icon: BookMarked
  },
  {
    title: "Ritual layers",
    description: "Build rhythms that regulate your attention and support your emotional climate.",
    icon: CalendarHeart
  },
  {
    title: "Intentional planning",
    description: "See the week with gentle clarity without turning life into a spreadsheet.",
    icon: Compass
  }
];

export default function HomePage() {
  return (
    <PageContainer>
      <PageHero
        eyebrow="Personal OS"
        title="A calm editorial home for learning, rituals, and life organization"
        description="Atriaé gives your inner and practical life the same elegant space: serene surfaces, gentle structure, and reflective clarity."
        cta="Enter dashboard"
      />

      <section className="space-y-4" style={{ paddingTop: "var(--space-section)" }}>
        <SectionHeader
          eyebrow="Signature"
          title="Built for private daily practice"
          description="Every surface is designed to feel like opening a well-kept notebook, never an admin dashboard."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} surface="paper">
                <CardHeader>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-matcha-100 text-matcha-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <CardTitle className="pt-4 text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card surface="tinted">
          <CardHeader>
            <CardTitle className="text-2xl">Daily Focus Card</CardTitle>
            <CardDescription>
              Keep one meaningful intention in view and let it guide your learning and rituals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-xl border border-matcha-300/50 bg-paper/80 p-4 text-sm text-muted-foreground">
              “Move at a humane pace. Depth over urgency.”
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="quiet">
              <Link href="/dashboard">
                Open today <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card surface="glass">
          <CardHeader>
            <CardTitle className="text-2xl">Elegant Empty States</CardTitle>
            <CardDescription>
              Even before data fills in, the product feels composed, warm, and intentional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-dashed border-border bg-paper/80 p-4 text-sm text-muted-foreground">
              No rituals yet. Begin with a two-minute breath + planning reset.
            </div>
            <div className="rounded-xl border border-dashed border-border bg-paper/80 p-4 text-sm text-muted-foreground">
              No learning topics yet. Start with one question you want to live with this week.
            </div>
          </CardContent>
          <CardFooter>
            <Sparkles className="h-4 w-4 text-blush-700" />
            <p className="text-xs uppercase text-muted-foreground">calm by default</p>
          </CardFooter>
        </Card>
      </section>
    </PageContainer>
  );
}
