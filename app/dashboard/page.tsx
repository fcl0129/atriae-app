import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Overview"
      title="Dashboard"
      description="Your daily snapshot will live here: priorities, reflections, and momentum signals."
      cta="Design blocks"
      columns={2}
      blocks={[
        {
          title: "Today's focus",
          description: "Placeholder for top priorities and energy level."
        },
        {
          title: "Rhythm score",
          description: "Placeholder for consistency across rituals and learning."
        }
      ]}
    />
  );
}
