"use client";

import { useMemo, useState, useTransition } from "react";
import { Grip, LayoutTemplate, Plus, Save, Search, Settings2, Trash2, Undo2 } from "lucide-react";

import { addWidgetAction, deleteWidgetAction, saveDashboardLayoutAction } from "@/app/dashboard/actions";
import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import { renderWidgetBody } from "@/components/dashboard/widget-content";
import { Button } from "@/components/ui/button";
import { widgetRegistry } from "@/lib/dashboard/registry";
import { DashboardSuggestion, DashboardView, DashboardWidget, WidgetSize } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
  initialViews: DashboardView[];
  initialViewId: string;
  suggestions: DashboardSuggestion[];
}

const spanClasses: Record<WidgetSize, string> = {
  small: "md:col-span-3 xl:col-span-3",
  medium: "md:col-span-3 xl:col-span-4",
  large: "md:col-span-6 xl:col-span-8",
  full: "md:col-span-6 xl:col-span-12"
};

export function DashboardClient({ initialViews, initialViewId, suggestions }: DashboardClientProps) {
  const [views, setViews] = useState(initialViews);
  const [activeViewId, setActiveViewId] = useState(initialViewId);
  const [editMode, setEditMode] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ viewId: string; type: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeView = views.find((view) => view.id === activeViewId) ?? views[0];

  const filteredWidgets = useMemo(
    () =>
      widgetRegistry.filter((widget) => {
        const queryMatch = widget.name.toLowerCase().includes(query.toLowerCase()) || widget.description.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = category === "all" || category === widget.category;
        return queryMatch && categoryMatch;
      }),
    [query, category]
  );

  function updateActiveWidgets(nextWidgets: DashboardWidget[]) {
    setViews((current) => current.map((view) => (view.id === activeView.id ? { ...view, widgets: nextWidgets } : view)));
  }

  function reorderWidgets(fromId: string, toId: string) {
    if (!activeView) return;
    const next = [...activeView.widgets];
    const fromIndex = next.findIndex((widget) => widget.id === fromId);
    const toIndex = next.findIndex((widget) => widget.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    updateActiveWidgets(next.map((widget, index) => ({ ...widget, position: index })));
  }

  function updateWidget(widgetId: string, patch: Partial<DashboardWidget>) {
    const next = activeView.widgets.map((widget) => (widget.id === widgetId ? { ...widget, ...patch } : widget));
    updateActiveWidgets(next);
  }

  function saveLayout() {
    startTransition(async () => {
      try {
        await saveDashboardLayoutAction(
          activeView.id,
          activeView.widgets.map((widget, index) => ({
            id: widget.id,
            position: index,
            size: widget.size,
            isHidden: widget.isHidden,
            settings: widget.settings
          }))
        );
        setFeedback("Layout saved.");
      } catch (error) {
        setFeedback((error as Error).message);
      }
    });
  }

  function applySuggestion(widgetType: string) {
    startTransition(async () => {
      await addWidgetAction(activeView.id, widgetType);
      location.reload();
    });
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 pb-16">
      <header className="surface-glass space-y-4 border border-white/55 px-4 py-5 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="type-label text-muted-foreground">Daily briefing</p>
            <h1 className="text-3xl">Return to what matters today.</h1>
            <p className="text-sm text-muted-foreground">A calm overview of focus, rhythm, and what deserves your attention next.</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-sm" value={activeView.id} onChange={(event) => setActiveViewId(event.target.value)}>
              {views.map((view) => (
                <option value={view.id} key={view.id}>
                  {view.name}
                </option>
              ))}
            </select>
            <Button size="sm" variant={editMode ? "primary" : "quiet"} onClick={() => setEditMode((current) => !current)}>
              {editMode ? "Done editing" : "Edit view"}
            </Button>
          </div>
        </div>

        {editMode ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/45 pt-3">
            <Button size="sm" variant="quiet" onClick={() => setShowPicker(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add module
            </Button>
            <Button size="sm" variant="quiet" onClick={() => setShowPicker(true)}>
              <LayoutTemplate className="mr-1.5 h-4 w-4" /> Browse library
            </Button>
            <Button size="sm" onClick={saveLayout} disabled={isPending}>
              <Save className="mr-1.5 h-4 w-4" /> Save
            </Button>
          </div>
        ) : null}
      </header>

      <IntelligencePanel heading="Shape today clearly" contextLabel="Dashboard daily briefing" defaultMode="plan" />

      {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}

      {suggestions.length > 0 && !editMode ? (
        <aside className="surface-paper space-y-3 border border-white/50 p-4">
          <p className="type-label text-muted-foreground">Gentle suggestions</p>
          <div className="grid gap-2 md:grid-cols-2">
            {suggestions.map((suggestion) => (
              <article key={suggestion.id} className="rounded-2xl border border-white/60 bg-white/65 p-3">
                <p className="text-sm font-medium">{suggestion.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{suggestion.body}</p>
                {suggestion.widgetType ? (
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => applySuggestion(suggestion.widgetType!)}>
                    Add to view
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        </aside>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12">
        {activeView.widgets.map((widget) => {
          if (widget.isHidden && !editMode) return null;
          const def = widgetRegistry.find((item) => item.id === widget.widgetType);
          if (!def) return null;
          return (
            <article
              key={widget.id}
              className={cn("liquid-glass-card group relative rounded-[1.3rem] border p-4 transition", spanClasses[widget.size], editMode && "ring-1 ring-foreground/10")}
              draggable={editMode}
              onDragStart={(event) => event.dataTransfer.setData("text/widget-id", widget.id)}
              onDragOver={(event) => {
                if (editMode) event.preventDefault();
              }}
              onDrop={(event) => {
                if (!editMode) return;
                const sourceId = event.dataTransfer.getData("text/widget-id");
                reorderWidgets(sourceId, widget.id);
              }}
            >
              <header className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{def.category}</p>
                  <h3 className="text-lg">{widget.title || def.name}</h3>
                </div>
                {editMode ? (
                  <div className="flex items-center gap-1">
                    <button aria-label="Drag widget" className="rounded-full p-1.5 text-muted-foreground hover:bg-white/70">
                      <Grip className="h-4 w-4" />
                    </button>
                    <button aria-label="Widget settings" className="rounded-full p-1.5 text-muted-foreground hover:bg-white/70" onClick={() => setSelectedWidget(widget)}>
                      <Settings2 className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Delete widget"
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-white/70"
                      onClick={() => {
                        setLastDeleted({ viewId: activeView.id, type: widget.widgetType });
                        updateActiveWidgets(activeView.widgets.filter((item) => item.id !== widget.id));
                        startTransition(async () => {
                          await deleteWidgetAction(widget.id);
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </header>

              {renderWidgetBody(def.id, widget, (patch) => updateWidget(widget.id, patch), editMode)}
            </article>
          );
        })}
      </div>

      {lastDeleted ? (
        <div className="surface-glass fixed bottom-5 right-5 border border-white/60 px-4 py-2 text-sm">
          Module removed.
          <button
            className="ml-3 inline-flex items-center gap-1 text-foreground"
            onClick={() => {
              startTransition(async () => {
                await addWidgetAction(lastDeleted.viewId, lastDeleted.type);
                location.reload();
              });
            }}
          >
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </button>
        </div>
      ) : null}

      {showPicker ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4">
          <div className="surface-glass w-full max-w-2xl space-y-4 border border-white/60 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Dashboard library</h3>
              <button className="text-sm text-muted-foreground" onClick={() => setShowPicker(false)}>
                Close
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full border border-white/60 bg-white/70 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input className="bg-transparent px-2 py-1.5 text-sm outline-none" placeholder="Search modules" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <select className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {[...new Set(widgetRegistry.map((widget) => widget.category))].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {filteredWidgets.map((widget) => (
                <button
                  key={widget.id}
                  className="rounded-2xl border border-white/60 bg-white/70 p-3 text-left hover:bg-white"
                  onClick={() => {
                    startTransition(async () => {
                      await addWidgetAction(activeView.id, widget.id);
                      location.reload();
                    });
                  }}
                >
                  <p className="font-medium">{widget.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{widget.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {selectedWidget ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4">
          <div className="surface-glass w-full max-w-lg space-y-4 border border-white/60 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl">Module settings</h3>
              <button className="text-sm text-muted-foreground" onClick={() => setSelectedWidget(null)}>
                Close
              </button>
            </div>
            {widgetRegistry
              .find((widget) => widget.id === selectedWidget.widgetType)
              ?.settings.map((setting) => (
                <label key={setting.key} className="block space-y-1">
                  <span className="text-sm text-muted-foreground">{setting.label}</span>
                  {setting.type === "select" ? (
                    <select
                      className="w-full rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm"
                      value={(selectedWidget.settings[setting.key] as string) ?? ""}
                      onChange={(event) => {
                        const next = { ...selectedWidget, settings: { ...selectedWidget.settings, [setting.key]: event.target.value } };
                        setSelectedWidget(next);
                        updateWidget(selectedWidget.id, { settings: next.settings });
                      }}
                    >
                      {setting.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm"
                      value={(selectedWidget.settings[setting.key] as string) ?? ""}
                      onChange={(event) => {
                        const next = { ...selectedWidget, settings: { ...selectedWidget.settings, [setting.key]: event.target.value } };
                        setSelectedWidget(next);
                        updateWidget(selectedWidget.id, { settings: next.settings });
                      }}
                    />
                  )}
                </label>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
