import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function HomePage() {
  return (
    <PlaceholderPage
      eyebrow="Personal OS"
      title="Welcome to your calm command center"
      description="Atriaé is your personal home for learning, rituals, and thoughtful organization. This foundation is intentionally simple so the product can grow with care."
      cta="Begin"
      columns={3}
      blocks={[
        {
          title: "Learning Compass",
          description: "Collect ideas, create study arcs, and keep your curiosity organized in one soft space."
        },
        {
          title: "Daily Ritual Layer",
          description: "Shape grounding routines with room for intention, reflection, and renewal."
        },
        {
          title: "Life Dashboard",
          description: "A clear pulse of what matters now — personal projects, focus, and emotional weather."
        }
      ]}
    />
  );
}
