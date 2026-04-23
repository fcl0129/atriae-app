"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Sparkles, TriangleAlert } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { TemplateCard } from "@/components/digests/template-card";
import { TemplatePreview } from "@/components/digests/template-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigestTemplate } from "@/lib/digests";
import { SUPABASE_PUBLIC_ENV_ERROR } from "@/lib/env";
import { createOptionalBrowserSupabaseClient } from "@/lib/supabase/browser";

type AsyncState = "idle" | "loading" | "success" | "empty" | "error";

const templateCategoryBySlug: Record<string, string> = {
  "morning-brief": "Morning ritual",
  "executive-morning": "Leadership",
  "sunday-reset": "Weekly reset",
  "culture-edit": "Culture",
  "soft-life-evening": "Evening ritual",
  "host-mode": "Hosting",
  "learning-drop": "Learning",
  "commute-capsule": "Transit"
};

const recommendedUseBySlug: Record<string, string> = {
  "morning-brief": "Ideal when you want a poised morning brief before the day gets noisy.",
  "executive-morning": "Built for operators who need a clean strategic brief before first meetings.",
  "sunday-reset": "Use this ritual to close the week with intention and open Monday with clarity.",
  "culture-edit": "For curious readers who want thoughtful recommendations with discernment.",
  "soft-life-evening": "Best when your evening ritual should feel quieter, slower, and restorative.",
  "host-mode": "Designed for hosting windows where composure matters more than last-minute hustle.",
  "learning-drop": "A steady learning digest for sustained intellectual momentum.",
  "commute-capsule": "A concise commute brief when your attention is narrow and time is short."
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatSchedule(template: DigestTemplate) {
  const { cadence, time, days } = template.scheduling_defaults;
  const dayPart = Array.isArray(days) && days.length > 0 ? days.map((day) => weekdays[day] ?? "").join(" · ") : "Flexible";

  if (cadence === "daily") {
    return `Daily · ${time}`;
  }

  if (cadence === "weekly") {
    return `Weekly · ${dayPart} · ${time}`;
  }

  return `Monthly · ${time}`;
}

function formatModuleTags(template: DigestTemplate) {
  return template.modules.slice(0, 5).map((module) => module.module.replaceAll("_", " "));
}

export default function DigestTemplatesPage() {
  const client = useMemo(() => createOptionalBrowserSupabaseClient(), []);

  const [state, setState] = useState<AsyncState>("loading");
  const [templates, setTemplates] = useState<DigestTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DigestTemplate | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      setState("loading");
      setStatusMessage("");

      if (!client) {
        setState("error");
        setStatusMessage(SUPABASE_PUBLIC_ENV_ERROR);
        return;
      }

      const { data, error } = await client
        .from("digest_templates")
        .select("*")
        .eq("is_system", true)
        .eq("is_active", true)
        .order("display_name", { ascending: true });

      if (error) {
        setState("error");
        setStatusMessage(error.message);
        return;
      }

      const items = (data ?? []) as DigestTemplate[];
      if (!items.length) {
        setTemplates([]);
        setSelectedTemplate(null);
        setState("empty");
        return;
      }

      setTemplates(items);
      setSelectedTemplate(items[0]);
      setState("success");
    }

    void loadTemplates();
  }, [client]);

  async function useTemplate(template: DigestTemplate) {
    setStatusMessage("");
    setActiveTemplateId(template.id);

    if (!client) {
      setStatusMessage(SUPABASE_PUBLIC_ENV_ERROR);
      setActiveTemplateId(null);
      return;
    }

    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      setStatusMessage("Please sign in first to activate a digest template.");
      setActiveTemplateId(null);
      return;
    }

    const userId = authData.user.id;

    const { error } = await client.from("user_digest_profiles").insert({
      user_id: userId,
      template_id: template.id,
      title: `${template.display_name} · Personal`,
      status: "active",
      timezone: template.scheduling_defaults.timezone,
      scheduling_config: template.scheduling_defaults,
      digest_config: template.config,
      module_config: template.modules
    });

    if (error) {
      setStatusMessage(error.message);
      setActiveTemplateId(null);
      return;
    }

      setStatusMessage(`“${template.display_name}” is now active in your rituals.`);
    setActiveTemplateId(null);
  }

  function handleCustomize(template: DigestTemplate) {
    setSelectedTemplate(template);
    setStatusMessage(`“${template.display_name}” is selected. Activate it now, then refine cadence, tone, and modules in the builder.`);
  }

  return (
    <PageContainer className="space-y-7 pb-12 pt-3 md:space-y-9">
      <SectionHeader
        eyebrow="Curated digests"
        title="Template collection"
        description="Choose a crafted ritual, review the editorial preview, and begin with one click."
      />

      {statusMessage ? (
        <Card surface="tinted" className="border-border/80">
          <CardContent className="flex items-start gap-3 py-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-foreground/80" />
            <p className="text-sm leading-7 text-foreground/90">{statusMessage}</p>
          </CardContent>
        </Card>
      ) : null}

      {state === "loading" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse border-border/70" surface="paper">
              <CardHeader>
                <div className="h-3 w-24 rounded-full bg-muted" />
                <div className="mt-4 h-8 w-40 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-4/5 rounded bg-muted" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}

      {state === "error" ? (
        <Card className="border-red-200/80 bg-red-50/50" surface="paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TriangleAlert className="h-5 w-5" />
              Could not load the collection
            </CardTitle>
              <CardDescription>{statusMessage || "Something went wrong while loading templates."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : null}

      {state === "empty" ? (
        <Card surface="glass">
          <CardHeader>
            <CardTitle className="text-xl">No templates available yet</CardTitle>
            <CardDescription>
              Seeded templates were not found. Run the Supabase seeds, then return to browse the collection.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {state === "success" ? (
        <>
          {selectedTemplate ? <TemplatePreview template={selectedTemplate} /> : null}

          <div className="grid gap-4 lg:grid-cols-2">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                category={templateCategoryBySlug[template.slug] ?? "Curated"}
                recommendedUseCase={recommendedUseBySlug[template.slug] ?? "A premium curated digest with a balanced module mix."}
                moduleTags={formatModuleTags(template)}
                suggestedSchedule={formatSchedule(template)}
                isSubmitting={activeTemplateId === template.id}
                onUseTemplate={useTemplate}
                onPreview={setSelectedTemplate}
                onCustomize={handleCustomize}
              />
            ))}
          </div>

          <Card surface="tinted" className="border-border/70">
            <CardContent className="flex items-start gap-3 py-4">
              <Sparkles className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <p className="text-sm leading-7 text-muted-foreground">
                Eight signature templates are available today: Morning Brief, Executive Morning, Sunday Reset, Culture Edit, Soft Life Evening,
                Host Mode, Learning Drop, and Commute Capsule.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </PageContainer>
  );
}
