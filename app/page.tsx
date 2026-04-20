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
        title={"A calm editorial home\nfor learning, rituals,\nand life organization"}
        description="Atriaé gives your inner and practical life the same elegant space: serene surfaces, gentle structure, and reflective clarity."
        cta="Begin your day"
      />

      <section className="space-y-4" style={{ paddingTop: "var(--space-section)" }}>
        <SectionHeader
          eyebrow="Signature"
          title="Built for private daily practice"
          description="Every surface is designed to feel like opening a well-kept notebook, never an admin dashboard."
        />
        <div className="grid gap-4 md:grid-cols-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const colSpan = index === 1 ? "md:col-span-5 md:translate-y-5" : "md:col-span-3";
            return (
              <Card key={pillar.title} surface="paper" className={colSpan}>
                <CardHeader>
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/85">Pillar 0{index + 1}</p>
                  <span className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-matcha-100 text-matcha-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <CardTitle className="pt-4 text-[1.62rem] leading-tight">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
          <Card surface="glass" className="md:col-span-4 md:translate-y-2">
            <CardHeader>
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/85">Perspective</p>
              <CardTitle className="pt-4 text-[1.62rem] leading-tight">A living index of your inner life</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track what matters without flattening your day into tasks. Clarity, warmth, and agency stay in balance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card surface="tinted" className="md:translate-y-4">
          <CardHeader>
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/85">Daily Focus</p>
            <CardTitle className="pt-4 text-2xl md:text-[2.05rem]">Daily Focus Card</CardTitle>
            <CardDescription>
              Keep one meaningful intention in view and let it guide your learning and rituals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-xl border border-matcha-300/50 bg-paper/80 p-4 text-sm leading-7 text-muted-foreground">
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
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/85">System State</p>
            <CardTitle className="pt-4 text-2xl md:text-[2.05rem]">Elegant Empty States</CardTitle>
            <CardDescription>
              Even before data fills in, the product feels composed, warm, and intentional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-dashed border-border bg-paper/80 p-4 text-sm leading-7 text-muted-foreground">
              No rituals yet. Begin with a two-minute breath + planning reset.
            </div>
            <div className="rounded-xl border border-dashed border-border bg-paper/80 p-4 text-sm leading-7 text-muted-foreground">
              No learning topics yet. Start with one question you want to live with this week.
            </div>
          </CardContent>
          <CardFooter>
            <Sparkles className="h-4 w-4 text-blush-700" />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Calm by default</p>
          </CardFooter>
        </Card>
      </section>
    </PageContainer>
  );
}
