import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <section className="space-y-6">
      <PageHero
        eyebrow="Access"
        title="Sign in to Atriaé"
        description="Authentication will be powered by Supabase. This screen is ready for secure login methods in the next phase."
        cta="Auth setup"
      />
      <Card>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder: email magic link, OAuth providers, and onboarding preferences.
        </CardContent>
      </Card>
    </section>
  );
}
