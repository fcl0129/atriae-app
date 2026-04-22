import { WidgetDefinition } from "@/lib/dashboard/types";

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: "today-agenda",
    name: "Today Agenda",
    description: "A concise list of the day’s priorities.",
    category: "Planning",
    defaultSize: "large",
    supportedSizes: ["medium", "large", "full"],
    icon: "Sun",
    defaultSettings: { scope: "today" },
    settings: [{ key: "scope", label: "Scope", type: "select", options: ["today", "week", "upcoming"] }]
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Upcoming events with compact and expanded modes.",
    category: "Planning",
    defaultSize: "medium",
    supportedSizes: ["small", "medium", "large"],
    icon: "CalendarDays",
    defaultSettings: { mode: "upcoming" },
    settings: [{ key: "mode", label: "Mode", type: "select", options: ["today", "week", "upcoming"] }]
  },
  { id: "weather", name: "Weather", description: "Current conditions and short forecast.", category: "Lifestyle", defaultSize: "small", supportedSizes: ["small", "medium"], icon: "CloudSun", defaultSettings: { detail: "compact" }, settings: [{ key: "detail", label: "Detail level", type: "select", options: ["compact", "detailed"] }] },
  { id: "priorities", name: "Priorities", description: "Personal to-do list for today.", category: "Planning", defaultSize: "medium", supportedSizes: ["medium", "large"], icon: "ListChecks", defaultSettings: { items: ["Clarify one key outcome", "Review calendar"] }, settings: [{ key: "title", label: "Custom title", type: "text" }] },
  { id: "news", name: "News Briefing", description: "Curated headlines and briefs.", category: "Briefing", defaultSize: "large", supportedSizes: ["medium", "large", "full"], icon: "Newspaper", defaultSettings: { category: "general" }, settings: [{ key: "category", label: "Category", type: "select", options: ["general", "business", "technology", "culture"] }] },
  { id: "insight", name: "Insight", description: "A daily learning card.", category: "Learning", defaultSize: "small", supportedSizes: ["small", "medium"], icon: "Lightbulb", defaultSettings: { source: "daily" }, settings: [{ key: "source", label: "Source", type: "select", options: ["daily", "book", "history", "science"] }] },
  { id: "focus", name: "Focus Session", description: "Start a focused block.", category: "Focus", defaultSize: "small", supportedSizes: ["small", "medium"], icon: "Timer", defaultSettings: { minutes: "50" }, settings: [{ key: "minutes", label: "Minutes", type: "select", options: ["25", "50", "90"] }] },
  { id: "habits", name: "Habits", description: "Track daily rituals and streaks.", category: "Rituals", defaultSize: "medium", supportedSizes: ["small", "medium"], icon: "Flame", defaultSettings: { mode: "streaks", checks: {} }, settings: [{ key: "mode", label: "Display", type: "select", options: ["streaks", "today"] }] },
  { id: "meal", name: "Nourish", description: "Meal inspiration and planning.", category: "Lifestyle", defaultSize: "small", supportedSizes: ["small", "medium"], icon: "Utensils", defaultSettings: { dietary: "balanced" }, settings: [{ key: "dietary", label: "Diet", type: "select", options: ["balanced", "high-protein", "vegetarian"] }] },
  { id: "media", name: "Media Picks", description: "Curated music, podcast, and series suggestion.", category: "Media", defaultSize: "small", supportedSizes: ["small", "medium"], icon: "Film", defaultSettings: { type: "mixed" }, settings: [{ key: "type", label: "Prefer", type: "select", options: ["mixed", "music", "podcasts", "films"] }] },
  { id: "inbox", name: "Inbox Summary", description: "A calm overview of inbound workload.", category: "Admin", defaultSize: "medium", supportedSizes: ["small", "medium", "large"], icon: "Inbox", defaultSettings: { provider: "summary" }, settings: [{ key: "provider", label: "Source", type: "select", options: ["summary", "gmail", "outlook"] }] },
  { id: "sunday-reset", name: "Sunday Reset", description: "Weekly review and reset ritual.", category: "Rituals", defaultSize: "large", supportedSizes: ["medium", "large", "full"], icon: "Sparkles", defaultSettings: { checklist: ["Review finances", "Plan week", "Set intentions"] }, settings: [{ key: "title", label: "Title", type: "text" }] }
];

export const widgetById = new Map(widgetRegistry.map((widget) => [widget.id, widget]));
