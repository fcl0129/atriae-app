import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <PageHero
        eyebrow="Preferences"
        title="Settings"
        description="Adjust account details, appearance, integrations, and personal defaults as Atriaé evolves."
        cta="Configure"
      />
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder: profile, theme controls, notifications, and connected services.
        </CardContent>
      </Card>
    </section>
  );
}
