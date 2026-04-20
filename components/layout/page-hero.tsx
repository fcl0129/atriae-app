import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  cta?: string;
}

export function PageHero({ eyebrow, title, description, cta = "Coming soon" }: PageHeroProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="section-gap">
        <p className="text-xs uppercase tracking-[0.22em] text-matcha-700">{eyebrow}</p>
        <CardTitle className="text-3xl md:text-4xl">{title}</CardTitle>
        <CardDescription className="max-w-xl text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div className="h-px flex-1 bg-gradient-to-r from-matcha-200 to-transparent" />
        <Button variant="secondary" size="sm">
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
