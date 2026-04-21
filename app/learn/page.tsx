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
        title="A focused learning space"
        description="Keep only what sharpens your thinking, then convert it into practical understanding."
        action={<Button variant="secondary">Add topic</Button>}
      />

      <Card surface="glass">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          <Input placeholder="Search notes, resources, and ideas" aria-label="Search learning content" />
          <Button variant="quiet">
            <Library className="mr-2 h-4 w-4" />
            Open library
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.name} surface="paper" className="bg-card/70">
            <CardHeader>
              <p className="text-xs uppercase text-muted-foreground" style={{ letterSpacing: "var(--text-eyebrow-tracking)" }}>
                Learning thread
              </p>
              <CardTitle className="pt-3 text-2xl">{topic.name}</CardTitle>
              <CardDescription>{topic.resources} references in this thread.</CardDescription>
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
              <div className="h-1.5 rounded-full bg-muted/85">
                <div className="h-full rounded-full bg-matcha-500" style={{ width: `${topic.progress}%` }} />
              </div>
              <Button variant="ghost" className="w-full justify-between rounded-xl bg-paper/70">
                Continue
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
