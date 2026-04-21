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
import { supabase } from "@/lib/supabase";

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
  "morning-brief": "Ideal if you want a stylish daily orientation before messages take over.",
  "executive-morning": "Built for operators and leaders who need a sharp summary before meetings.",
  "sunday-reset": "Use this to close your week gently and stage Monday with less friction.",
  "culture-edit": "For curious minds who want intentional film, reading, and audio recommendations.",
  "soft-life-evening": "Best when you want evenings to feel softer, calmer, and less reactive.",
  "host-mode": "Turn this on before hosting windows to stay organized and socially prepared.",
  "learning-drop": "Designed for steady intellectual growth without overwhelming your schedule.",
  "commute-capsule": "A compact briefing for commute windows when attention is limited."
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
  const client = useMemo(() => supabase, []);

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
        setStatusMessage("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
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
      setStatusMessage("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
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

    setStatusMessage(`“${template.display_name}” is now active in your digest profiles.`);
    setActiveTemplateId(null);
  }

  function handleCustomize(template: DigestTemplate) {
    setSelectedTemplate(template);
    setStatusMessage(`Customization studio for “${template.display_name}” is next. Preview and activate, then refine modules from settings.`);
  }

  return (
    <PageContainer className="space-y-7 pb-12 pt-3 md:space-y-9">
      <SectionHeader
        eyebrow="Curated digests"
        title="Template Library"
        description="Choose a refined digest ritual, preview the voice, and activate instantly. Designed to feel editorial, calm, and quietly premium."
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
              Could not load template library
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
            <CardTitle className="text-xl">No system templates yet</CardTitle>
            <CardDescription>
              Seeded templates were not found. Run Supabase seeds, then return to explore curated digest rituals.
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
                The library currently includes eight system templates: Morning Brief, Executive Morning, Sunday Reset, Culture Edit,
                Soft Life Evening, Host Mode, Learning Drop, and Commute Capsule.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </PageContainer>
  );
}
