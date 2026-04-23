"use server";

import { revalidatePath } from "next/cache";

import { widgetById } from "@/lib/dashboard/registry";
import { createViewWithTemplate } from "@/lib/dashboard/service";
import { templateByKey } from "@/lib/dashboard/templates";
import { DashboardTemplateKey, WidgetSize } from "@/lib/dashboard/types";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error(SUPABASE_PUBLIC_ENV_ERROR);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

export async function saveDashboardLayoutAction(viewId: string, widgets: Array<{ id: string; position: number; size: WidgetSize; isHidden: boolean; settings: Record<string, unknown> }>) {
  const { supabase, user } = await requireUser();

  const { data: view } = await supabase.from("dashboard_views").select("id").eq("id", viewId).eq("user_id", user.id).maybeSingle();
  if (!view) throw new Error("Dashboard view not found");

  for (const widget of widgets) {
    const { error } = await supabase
      .from("dashboard_widgets")
      .update({ position: widget.position, size: widget.size, is_hidden: widget.isHidden, settings: widget.settings })
      .eq("id", widget.id)
      .eq("dashboard_view_id", viewId);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function addWidgetAction(viewId: string, widgetType: string) {
  const { supabase, user } = await requireUser();
  const def = widgetById.get(widgetType);
  if (!def) throw new Error("Widget not found");

  const { data: view } = await supabase.from("dashboard_views").select("id").eq("id", viewId).eq("user_id", user.id).maybeSingle();
  if (!view) throw new Error("Dashboard view not found");

  const { data: tail } = await supabase.from("dashboard_widgets").select("position").eq("dashboard_view_id", viewId).order("position", { ascending: false }).limit(1).maybeSingle();
  const nextPosition = (tail?.position ?? -1) + 1;

  const { error } = await supabase.from("dashboard_widgets").insert({
    dashboard_view_id: viewId,
    widget_type: widgetType,
    size: def.defaultSize,
    position: nextPosition,
    settings: def.defaultSettings
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteWidgetAction(widgetId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("dashboard_widgets")
    .delete()
    .eq("id", widgetId)
    .in("dashboard_view_id", (await supabase.from("dashboard_views").select("id").eq("user_id", user.id)).data?.map((view) => view.id) ?? []);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function createDashboardViewAction(name: string, templateKey: DashboardTemplateKey) {
  const { supabase, user } = await requireUser();
  await createViewWithTemplate(supabase, user.id, name, templateKey, false);
  revalidatePath("/dashboard");
}

export async function renameDashboardViewAction(viewId: string, name: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("dashboard_views").update({ name }).eq("id", viewId).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function deleteDashboardViewAction(viewId: string) {
  const { supabase, user } = await requireUser();
  const { data: views } = await supabase.from("dashboard_views").select("id").eq("user_id", user.id);
  if ((views ?? []).length <= 1) throw new Error("At least one view is required.");

  const { error } = await supabase.from("dashboard_views").delete().eq("id", viewId).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function duplicateDashboardViewAction(viewId: string) {
  const { supabase, user } = await requireUser();
  const { data: view } = await supabase.from("dashboard_views").select("name,template_key").eq("id", viewId).eq("user_id", user.id).maybeSingle();
  if (!view) throw new Error("Dashboard view not found");
  const { data: widgets } = await supabase.from("dashboard_widgets").select("widget_type,size,position,settings,is_hidden").eq("dashboard_view_id", viewId).order("position", { ascending: true });

  const { data: inserted, error } = await supabase
    .from("dashboard_views")
    .insert({ user_id: user.id, name: `${view.name} Copy`, slug: `copy-${Date.now()}`, template_key: view.template_key, is_default: false })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if ((widgets ?? []).length > 0) {
    const { error: widgetError } = await supabase.from("dashboard_widgets").insert(
      widgets!.map((widget) => ({
        dashboard_view_id: inserted.id,
        widget_type: widget.widget_type,
        size: widget.size,
        position: widget.position,
        settings: widget.settings,
        is_hidden: widget.is_hidden
      }))
    );
    if (widgetError) throw new Error(widgetError.message);
  }

  revalidatePath("/dashboard");
}

export async function applyTemplateToViewAction(viewId: string, templateKey: DashboardTemplateKey) {
  const { supabase, user } = await requireUser();
  const template = templateByKey.get(templateKey);
  if (!template) throw new Error("Template not found");

  const { data: view } = await supabase.from("dashboard_views").select("id").eq("id", viewId).eq("user_id", user.id).maybeSingle();
  if (!view) throw new Error("Dashboard view not found");

  const { error: wipeError } = await supabase.from("dashboard_widgets").delete().eq("dashboard_view_id", viewId);
  if (wipeError) throw new Error(wipeError.message);

  const { error: insertError } = await supabase.from("dashboard_widgets").insert(
    template.widgets.map((item, index) => ({
      dashboard_view_id: viewId,
      widget_type: item.widgetType,
      size: item.size ?? widgetById.get(item.widgetType)?.defaultSize ?? "medium",
      position: index,
      settings: { ...(widgetById.get(item.widgetType)?.defaultSettings ?? {}), ...(item.settings ?? {}) },
      is_hidden: item.isHidden ?? false
    }))
  );

  if (insertError) throw new Error(insertError.message);

  await supabase.from("dashboard_views").update({ template_key: templateKey }).eq("id", viewId);
  revalidatePath("/dashboard");
}


export async function createStarterDashboardAction(formData: FormData) {
  const templateKey = (formData.get("templateKey") as DashboardTemplateKey | null) ?? "morning-brief";
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase.from("dashboard_views").select("id").eq("user_id", user.id).limit(1);
  if ((existing ?? []).length === 0) {
    await createViewWithTemplate(supabase, user.id, "Morning", templateKey, true);
  }
  revalidatePath("/dashboard");
}
