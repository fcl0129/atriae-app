import { ArrowUpRight } from "lucide-react";

import { PageBadge } from "@/components/layout/page-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  cta?: string;
}

export function PageHero({ eyebrow, title, description, cta = "Open space" }: PageHeroProps) {
  return (
    <Card surface="glass" className="overflow-hidden">
      <CardHeader className="section-gap">
        <PageBadge>{eyebrow}</PageBadge>
        <CardTitle className="editorial-balance max-w-3xl text-3xl md:text-5xl">{title}</CardTitle>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3 pt-5">
        <Button variant="primary" size="default">
          {cta}
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground">Private by default. Thoughtful by design.</p>
      </CardContent>
    </Card>
  );
}
