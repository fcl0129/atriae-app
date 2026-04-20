import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LoginPage() {
  return (
    <PlaceholderPage
      eyebrow="Access"
      title="Sign in to Atriaé"
      description="Authentication will be powered by Supabase. This screen is ready for secure login methods in the next phase."
      cta="Auth setup"
      blocks={[
        {
          description: "Placeholder: email magic link, OAuth providers, and onboarding preferences."
        }
      ]}
    />
  );
}
