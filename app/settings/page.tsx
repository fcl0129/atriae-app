import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Preferences"
      title="Settings"
      description="Adjust account details, appearance, integrations, and personal defaults as Atriaé evolves."
      cta="Configure"
      blocks={[
        {
          description: "Placeholder: profile, theme controls, notifications, and connected services."
        }
      ]}
    />
  );
}
