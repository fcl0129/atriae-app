import { ArrowUpRight, Bookmark, Clock3, Library } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const topics = [
  { name: "Systems thinking", resources: 14, pace: "Steady", progress: 68 },
  { name: "Poetics + journaling", resources: 8, pace: "Light", progress: 41 },
  { name: "Design anthropology", resources: 11, pace: "Deep", progress: 57 }
];

export default function LearnPage() {
  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Learn"
        title="Curated learning library"
        description="Collect ideas, readings, and themes with an editorial rhythm that supports depth."
        action={<Button variant="secondary">New topic</Button>}
      />

      <Card surface="glass">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <Input placeholder="Search notes, resources, and topics" aria-label="Search learning content" />
          <Button variant="quiet">
            <Library className="mr-2 h-4 w-4" />
            Open archive
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.name} surface="paper">
            <CardHeader>
              <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                Learning Topic Card
              </p>
              <CardTitle className="pt-3 text-2xl">{topic.name}</CardTitle>
              <CardDescription>{topic.resources} curated resources in this thread.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock3 className="h-4 w-4" /> Pace
                </span>
                <span>{topic.pace}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Bookmark className="h-4 w-4" /> Progress
                </span>
                <span>{topic.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-matcha-500" style={{ width: `${topic.progress}%` }} />
              </div>
              <Button variant="ghost" className="w-full justify-between rounded-xl border border-border bg-paper">
                Continue thread
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
