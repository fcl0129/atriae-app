import type { UserDigestProfile } from "@/lib/digests/types";
import type { NormalizedDigestModule } from "@/lib/digests/rendering/types";

function pickLead(modules: NormalizedDigestModule[]) {
  const priority = ["top_headlines", "focus_block", "calendar_summary", "weather", "learn_something"] as const;
  for (const key of priority) {
    const found = modules.find((module) => module.key === key);
    if (found) return found;
  }
  return modules[0];
}

export function buildDigestSubject(profile: UserDigestProfile, modules: NormalizedDigestModule[]) {
  const lead = pickLead(modules);
  const title = profile.title.trim();
  const summary = lead?.summary.split(".")[0]?.trim() ?? "Your curated update";

  const subject = title
    ? `${title}: ${summary}`.slice(0, 120)
    : `Your Atriae digest: ${summary}`.slice(0, 120);

  const preview = modules
    .slice(0, 2)
    .map((module) => module.summary)
    .join(" • ")
    .slice(0, 170);

  return {
    subjectLine: subject,
    previewLine: preview || "Calm clarity for your next move.",
  };
}
