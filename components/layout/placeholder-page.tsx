import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderBlock {
  title?: string;
  description: string;
}

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  blocks: PlaceholderBlock[];
  columns?: 1 | 2 | 3;
}

const columnStyles: Record<NonNullable<PlaceholderPageProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3"
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  cta,
  blocks,
  columns = 1
}: PlaceholderPageProps) {
  return (
    <section className="space-y-6">
      <PageHero eyebrow={eyebrow} title={title} description={description} cta={cta} />

      <div className={`grid gap-4 ${columnStyles[columns]}`}>
        {blocks.map((block) => (
          <Card key={block.title ?? block.description}>
            {block.title ? (
              <CardHeader>
                <CardTitle className="text-lg">{block.title}</CardTitle>
              </CardHeader>
            ) : null}
            <CardContent className="text-sm text-muted-foreground">
              {block.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
