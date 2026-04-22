import { createStarterDashboardAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

const options = [
  { value: "morning-brief", label: "Start the day clearly" },
  { value: "deep-work", label: "Stay focused" },
  { value: "life-admin", label: "Organize life admin" },
  { value: "sunday-reset", label: "Build better rituals" },
  { value: "executive-view", label: "Get a curated daily brief" }
] as const;

export function DashboardOnboarding() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Personalize your command center</p>
        <h1 className="text-4xl">What should this dashboard help you do first?</h1>
      </header>
      <form action={createStarterDashboardAction} className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <button key={option.value} type="submit" name="templateKey" value={option.value} className="liquid-glass-card rounded-[1.2rem] border p-4 text-left hover:-translate-y-0.5">
            <p className="text-base">{option.label}</p>
          </button>
        ))}
      </form>
      <div className="text-center">
        <Button asChild size="sm" variant="quiet">
          <button type="submit" formAction={createStarterDashboardAction} name="templateKey" value="morning-brief">
            Skip for now
          </button>
        </Button>
      </div>
    </section>
  );
}
