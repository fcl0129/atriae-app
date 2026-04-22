import { DashboardTemplate } from "@/lib/dashboard/types";

export const dashboardTemplates: DashboardTemplate[] = [
  {
    key: "morning-brief",
    name: "Morning Brief",
    description: "A calm arrival with weather, agenda, and briefing.",
    icon: "Sunrise",
    widgets: [
      { widgetType: "today-agenda", size: "large" },
      { widgetType: "weather", size: "small" },
      { widgetType: "calendar", size: "medium" },
      { widgetType: "news", size: "large", settings: { category: "general" } },
      { widgetType: "focus", size: "small" }
    ]
  },
  {
    key: "deep-work",
    name: "Deep Work",
    description: "Priorities and focus-first composition.",
    icon: "Brain",
    widgets: [
      { widgetType: "focus", size: "small" },
      { widgetType: "priorities", size: "large" },
      { widgetType: "today-agenda", size: "medium" },
      { widgetType: "inbox", size: "medium" },
      { widgetType: "insight", size: "small" }
    ]
  },
  {
    key: "life-admin",
    name: "Life Admin",
    description: "Tasks, inbox, and routines in one place.",
    icon: "Briefcase",
    widgets: [
      { widgetType: "priorities", size: "large" },
      { widgetType: "inbox", size: "large" },
      { widgetType: "calendar", size: "medium" },
      { widgetType: "habits", size: "medium" }
    ]
  },
  {
    key: "sunday-reset",
    name: "Sunday Reset",
    description: "Weekly reflection and preparation.",
    icon: "Sparkles",
    widgets: [
      { widgetType: "sunday-reset", size: "full" },
      { widgetType: "habits", size: "small" },
      { widgetType: "meal", size: "small" },
      { widgetType: "calendar", size: "medium", settings: { mode: "week" } }
    ]
  },
  {
    key: "social-culture",
    name: "Social & Culture",
    description: "Culture digest and media picks.",
    icon: "Globe",
    widgets: [
      { widgetType: "news", size: "large", settings: { category: "culture" } },
      { widgetType: "media", size: "medium" },
      { widgetType: "insight", size: "small" },
      { widgetType: "meal", size: "small" }
    ]
  },
  {
    key: "executive-view",
    name: "Executive View",
    description: "High-level command center for focused decisions.",
    icon: "ChartNoAxesCombined",
    widgets: [
      { widgetType: "today-agenda", size: "large" },
      { widgetType: "inbox", size: "medium" },
      { widgetType: "calendar", size: "medium" },
      { widgetType: "news", size: "large", settings: { category: "business" } },
      { widgetType: "focus", size: "small" }
    ]
  }
];

export const templateByKey = new Map(dashboardTemplates.map((template) => [template.key, template]));
