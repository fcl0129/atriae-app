export type WidgetCategory =
  | "Planning"
  | "Focus"
  | "Briefing"
  | "Lifestyle"
  | "Learning"
  | "Media"
  | "Admin"
  | "Rituals";

export type WidgetSize = "small" | "medium" | "large" | "full";

export type DashboardTemplateKey =
  | "morning-brief"
  | "deep-work"
  | "life-admin"
  | "sunday-reset"
  | "social-culture"
  | "executive-view";

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  defaultSize: WidgetSize;
  supportedSizes: WidgetSize[];
  icon: string;
  defaultSettings: Record<string, unknown>;
  settings: Array<{ key: string; label: string; type: "select" | "toggle" | "text"; options?: string[] }>;
}

export interface DashboardWidget {
  id: string;
  dashboardViewId: string;
  widgetType: string;
  title: string | null;
  size: WidgetSize;
  position: number;
  settings: Record<string, unknown>;
  isHidden: boolean;
}

export interface DashboardView {
  id: string;
  userId: string;
  name: string;
  slug: string;
  templateKey: DashboardTemplateKey | null;
  isDefault: boolean;
  sortOrder: number;
  widgets: DashboardWidget[];
}

export interface DashboardTemplate {
  key: DashboardTemplateKey;
  name: string;
  description: string;
  icon: string;
  widgets: Array<{ widgetType: string; size?: WidgetSize; settings?: Record<string, unknown>; isHidden?: boolean }>;
}

export interface DashboardSuggestion {
  id: string;
  title: string;
  body: string;
  widgetType?: string;
  templateKey?: DashboardTemplateKey;
}
