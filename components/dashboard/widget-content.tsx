import { DashboardWidget } from "@/lib/dashboard/types";

export function renderWidgetBody(widgetType: string, widget: DashboardWidget, onUpdate: (patch: Partial<DashboardWidget>) => void, editMode: boolean) {
  const settings = widget.settings as Record<string, unknown>;

  switch (widgetType) {
    case "today-agenda":
      return (
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Scope: {(settings.scope as string) ?? "today"}</p>
          <ul className="space-y-1">
            <li>Review priorities</li>
            <li>Confirm key meetings</li>
            <li>Protect one uninterrupted focus block</li>
          </ul>
        </div>
      );
    case "calendar":
      return <p className="text-sm text-muted-foreground">Calendar mode: {(settings.mode as string) ?? "upcoming"}. Integration-ready feed.</p>;
    case "weather":
      return <p className="text-sm text-muted-foreground">72°F, clear. Forecast provider layer connected to placeholder source.</p>;
    case "priorities": {
      const items = (settings.items as string[]) ?? [];
      return (
        <div className="space-y-2 text-sm">
          {items.length === 0 ? <p className="text-muted-foreground">No priorities yet.</p> : null}
          {items.map((item, index) => (
            <label key={`${item}-${index}`} className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>{item}</span>
            </label>
          ))}
          {editMode ? (
            <button
              className="text-xs text-muted-foreground"
              onClick={() => {
                const next = [...items, "New priority"];
                onUpdate({ settings: { ...settings, items: next } });
              }}
            >
              + Add priority item
            </button>
          ) : null}
        </div>
      );
    }
    case "news":
      return (
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Markets steady as inflation cools.</li>
          <li>• Design trend: restrained interfaces return.</li>
          <li>• Energy outlook update this afternoon.</li>
        </ul>
      );
    case "insight":
      return <p className="text-sm text-muted-foreground">Today’s concept: marginal gains compound in calm systems.</p>;
    case "focus":
      return <p className="text-sm text-muted-foreground">Suggested block: {(settings.minutes as string) ?? "50"} minutes.</p>;
    case "habits":
      return <p className="text-sm text-muted-foreground">3 rituals complete this week. Keep your streak alive.</p>;
    case "meal":
      return <p className="text-sm text-muted-foreground">Nourish pick: citrus quinoa bowl, ready in 20 minutes.</p>;
    case "media":
      return <p className="text-sm text-muted-foreground">Pick: The Daily episode + one ambient focus album.</p>;
    case "inbox":
      return <p className="text-sm text-muted-foreground">18 unread, 4 high priority, 2 waiting your approval.</p>;
    case "sunday-reset":
      return (
        <div className="space-y-2 text-sm">
          {((settings.checklist as string[]) ?? ["Review week", "Reset priorities", "Plan meals"]).map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      );
    default:
      return <p className="text-sm text-muted-foreground">Widget unavailable.</p>;
  }
}
