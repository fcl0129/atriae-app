import { Flame, Leaf, Target } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const progress = [
  { label: "Learning", value: 62, tone: "bg-matcha-500" },
  { label: "Ritual consistency", value: 74, tone: "bg-blush-500" },
  { label: "Energy alignment", value: 48, tone: "bg-matcha-300" }
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Overview"
        title="Daily calm overview"
        description="A soft, high-signal view of what matters today, with gentle momentum indicators."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card surface="paper">
          <CardHeader>
            <CardTitle className="text-2xl">Hero Card · Today&apos;s Focus</CardTitle>
            <CardDescription>One meaningful priority for your best attention window.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border bg-ivory-100/70 p-4">
              <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                Focus thread
              </p>
              <h3 className="pt-2 text-2xl">Map your next 5 learning modules with margin notes.</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Deep work", value: "90 min", icon: Target },
                { label: "Ritual streak", value: "12 days", icon: Flame },
                { label: "Mood", value: "Grounded", icon: Leaf }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="surface-glass p-3">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {item.label}
                    </p>
                    <p className="pt-1 text-base font-medium">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card surface="tinted">
          <CardHeader>
            <CardTitle className="text-2xl">Progress Indicator</CardTitle>
            <CardDescription>Balanced pace over perfection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-paper/80">
                  <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
