import { DashboardSuggestion, DashboardView } from "@/lib/dashboard/types";

export function buildSuggestions(view: DashboardView): DashboardSuggestion[] {
  const widgetTypes = new Set(view.widgets.map((widget) => widget.widgetType));
  const suggestions: DashboardSuggestion[] = [];

  if (view.name.toLowerCase().includes("morning") && !widgetTypes.has("weather")) {
    suggestions.push({
      id: "morning-weather",
      title: "Complete your morning brief",
      body: "Add Weather for context before planning your day.",
      widgetType: "weather"
    });
  }

  if (view.name.toLowerCase().includes("weekend") && !widgetTypes.has("sunday-reset")) {
    suggestions.push({
      id: "weekend-reset",
      title: "Add Sunday Reset",
      body: "A guided weekly checklist keeps your weekend restorative.",
      widgetType: "sunday-reset"
    });
  }

  if (view.templateKey === "deep-work" && !widgetTypes.has("focus")) {
    suggestions.push({
      id: "deep-focus",
      title: "Stay in flow",
      body: "Focus Session works well with Deep Work view.",
      widgetType: "focus"
    });
  }

  return suggestions;
}
