import { randomUUID } from "crypto";

import { widgetById } from "@/lib/dashboard/registry";
import { templateByKey } from "@/lib/dashboard/templates";
import { DashboardTemplateKey, DashboardView, DashboardWidget } from "@/lib/dashboard/types";

type SupabaseClient = Awaited<ReturnType<typeof import("@/lib/supabase/server").createServerSupabaseClient>>;

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 40) || "view";
}

async function createViewWithTemplate(supabase: NonNullable<SupabaseClient>, userId: string, name: string, templateKey: DashboardTemplateKey, isDefault = false) {
  const slug = `${slugify(name)}-${randomUUID().slice(0, 6)}`;
  const { data: view, error: viewError } = await supabase
    .from("dashboard_views")
    .insert({ user_id: userId, name, slug, template_key: templateKey, is_default: isDefault })
    .select("id")
    .single();

  if (viewError || !view) {
    throw new Error(viewError?.message ?? "Failed to create dashboard view.");
  }

  const template = templateByKey.get(templateKey);
  if (!template) {
    throw new Error("Template not found.");
  }

  const payload = template.widgets.map((item, index) => {
    const definition = widgetById.get(item.widgetType);
    return {
      dashboard_view_id: view.id,
      widget_type: item.widgetType,
      size: item.size ?? definition?.defaultSize ?? "medium",
      position: index,
      settings: {
        ...(definition?.defaultSettings ?? {}),
        ...(item.settings ?? {})
      },
      is_hidden: item.isHidden ?? false
    };
  });

  const { error: widgetsError } = await supabase.from("dashboard_widgets").insert(payload);
  if (widgetsError) {
    throw new Error(widgetsError.message);
  }

  return view.id;
}

export async function ensureDashboardForUser(supabase: NonNullable<SupabaseClient>, userId: string, template: DashboardTemplateKey = "morning-brief") {
  const { data: existing } = await supabase.from("dashboard_views").select("id").eq("user_id", userId).limit(1);
  if ((existing ?? []).length > 0) {
    return;
  }

  await createViewWithTemplate(supabase, userId, "Morning", template, true);
}

export async function fetchDashboardViews(supabase: NonNullable<SupabaseClient>, userId: string): Promise<DashboardView[]> {
  const { data: views, error } = await supabase
    .from("dashboard_views")
    .select("id,user_id,name,slug,template_key,is_default,sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const { data: widgets, error: widgetError } = await supabase
    .from("dashboard_widgets")
    .select("id,dashboard_view_id,widget_type,title,size,position,settings,is_hidden")
    .in("dashboard_view_id", (views ?? []).map((view) => view.id))
    .order("position", { ascending: true });

  if (widgetError) throw new Error(widgetError.message);

  const byView = new Map<string, DashboardWidget[]>();
  for (const widget of widgets ?? []) {
    if (!byView.has(widget.dashboard_view_id)) byView.set(widget.dashboard_view_id, []);
    byView.get(widget.dashboard_view_id)?.push({
      id: widget.id,
      dashboardViewId: widget.dashboard_view_id,
      widgetType: widget.widget_type,
      title: widget.title,
      size: widget.size,
      position: widget.position,
      settings: (widget.settings as Record<string, unknown>) ?? {},
      isHidden: widget.is_hidden
    });
  }

  return (views ?? []).map((view) => ({
    id: view.id,
    userId: view.user_id,
    name: view.name,
    slug: view.slug,
    templateKey: view.template_key,
    isDefault: view.is_default,
    sortOrder: view.sort_order,
    widgets: byView.get(view.id) ?? []
  }));
}

export { createViewWithTemplate };
