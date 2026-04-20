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

export function PageHero({ eyebrow, title, description, cta = "Enter your space" }: PageHeroProps) {
  const titleLines = title.split("\n");

  return (
    <Card surface="glass" className="overflow-hidden">
      <CardHeader className="section-gap pb-3">
        <PageBadge>{eyebrow}</PageBadge>
        <CardTitle className="editorial-balance max-w-3xl text-[2.35rem] leading-[0.9] md:text-[4.25rem]">
          {titleLines.map((line, index) => (
            <span className="block" key={`${line}-${index}`}>
              {line}
            </span>
          ))}
        </CardTitle>
        <p className="max-w-xl text-[1.02rem] leading-8 text-muted-foreground md:text-lg">
          {description}
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3 pt-4">
        <Button variant="primary" size="default">
          {cta}
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground/85">Private by default · editorial by nature</p>
      </CardContent>
    </Card>
  );
}
