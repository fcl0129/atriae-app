"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Save, Trash2, TriangleAlert } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { digestModuleRegistry, type DigestModuleKey, type ModuleConfig, type UserDigestProfile } from "@/lib/digests";
import { userDigestProfileSchema } from "@/lib/digests/schemas";
import { supabase } from "@/lib/supabase";

type BuilderStep =
  | "starting_point"
  | "schedule"
  | "tone_style"
  | "modules"
  | "arrange"
  | "preview"
  | "save";

type ToastTone = "success" | "error";

interface ToastState {
  tone: ToastTone;
  message: string;
}

type Frequency = "daily" | "weekly" | "custom";
type FallbackBehavior = "skip" | "use_previous" | "insert_placeholder";

type BuilderModuleConfig = ModuleConfig & {
  settings: {
    itemCount: number;
    fallbackBehavior: FallbackBehavior;
    customText?: string;
  };
};

interface BuilderState {
  digestName: string;
  internalLabel: string;
  state: "active" | "paused";
  frequency: Frequency;
  dayOfWeek: number;
  customDays: number[];
  sendTime: string;
  timezone: string;
  language: string;
  tone: "elegant" | "editorial" | "warm" | "polished" | "gentle" | "uplifted" | "clear" | "smart";
  layoutStyle: "newspaper" | "minimal" | "letter";
  modules: BuilderModuleConfig[];
  startFrom: "template" | "scratch";
}

const STEPS: { key: BuilderStep; label: string }[] = [
  { key: "starting_point", label: "1. Starting point" },
  { key: "schedule", label: "2. Schedule" },
  { key: "tone_style", label: "3. Tone & style" },
  { key: "modules", label: "4. Modules" },
  { key: "arrange", label: "5. Arrange" },
  { key: "preview", label: "6. Live preview" },
  { key: "save", label: "7. Save & activate" },
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_TIMEZONE = "America/New_York";
const SUPPORTED_LANGUAGES = ["en-US", "en-GB", "es-ES", "fr-FR", "de-DE"];

function buildDefaultModules(): BuilderModuleConfig[] {
  return digestModuleRegistry.list().map((definition, index) => ({
    module: definition.key,
    enabled: ["top_headlines", "weather", "focus_block", "calendar_summary"].includes(definition.key),
    order: index,
    settings: {
      itemCount: definition.key === "top_headlines" ? 5 : 1,
      fallbackBehavior: "use_previous",
      ...(definition.key === "free_text_custom_block" ? { customText: "Write your ritual note here." } : {}),
    },
  }));
}

function buildDefaultState(): BuilderState {
  return {
    digestName: "Morning Ritual",
    internalLabel: "executive-ritual-v1",
    state: "paused",
    frequency: "daily",
    dayOfWeek: 1,
    customDays: [1, 3, 5],
    sendTime: "07:30",
    timezone: DEFAULT_TIMEZONE,
    language: "en-US",
    tone: "editorial",
    layoutStyle: "newspaper",
    modules: buildDefaultModules(),
    startFrom: "template",
  };
}

function mapProfileToBuilder(profile: UserDigestProfile): BuilderState {
  const personalization = (profile.digest_config.personalization ?? {}) as Record<string, unknown>;
  const moduleConfig = (profile.module_config || []).map((moduleEntry, index) => ({
    ...moduleEntry,
    settings: {
      itemCount: Number((moduleEntry.settings as Record<string, unknown>)?.itemCount ?? 1),
      fallbackBehavior: ((moduleEntry.settings as Record<string, unknown>)?.fallbackBehavior as FallbackBehavior) ?? "use_previous",
      customText: (moduleEntry.settings as Record<string, unknown>)?.customText as string | undefined,
    },
    order: moduleEntry.order ?? index,
  }));

  return {
    digestName: profile.title,
    internalLabel: String(personalization.internalLabel ?? ""),
    state: profile.status === "active" ? "active" : "paused",
    frequency: profile.scheduling_config.cadence === "weekly" ? "weekly" : profile.scheduling_config.cadence === "daily" ? "daily" : "custom",
    dayOfWeek: profile.scheduling_config.days?.[0] ?? 1,
    customDays: profile.scheduling_config.days ?? [1, 3, 5],
    sendTime: profile.scheduling_config.time,
    timezone: profile.timezone,
    language: profile.digest_config.locale ?? "en-US",
    tone: profile.digest_config.voice,
    layoutStyle: (personalization.layoutStyle as BuilderState["layoutStyle"]) ?? "newspaper",
    modules: moduleConfig,
    startFrom: "scratch",
  };
}

function builderToPayload(builder: BuilderState) {
  const cadence = builder.frequency === "custom" ? "monthly" : builder.frequency;

  return {
    title: builder.digestName,
    status: builder.state,
    timezone: builder.timezone,
    scheduling_config: {
      timezone: builder.timezone,
      cadence,
      time: builder.sendTime,
      days: builder.frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : builder.frequency === "weekly" ? [builder.dayOfWeek] : builder.customDays,
    },
    digest_config: {
      voice: builder.tone,
      length: "standard" as const,
      delivery: "email" as const,
      locale: builder.language,
      personalization: {
        internalLabel: builder.internalLabel,
        layoutStyle: builder.layoutStyle,
      },
    },
    module_config: builder.modules
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((moduleEntry, index) => ({
        module: moduleEntry.module,
        enabled: moduleEntry.enabled,
        order: index,
        settings: moduleEntry.settings,
      })),
  };
}

function validateBuilder(builder: BuilderState) {
  const issues: string[] = [];

  if (!builder.digestName.trim()) issues.push("Digest name is required.");
  if (!builder.internalLabel.trim()) issues.push("Internal label is required to help you organize variants.");
  if (builder.frequency === "weekly" && (builder.dayOfWeek < 0 || builder.dayOfWeek > 6)) issues.push("Pick a valid day of week for weekly schedule.");
  if (builder.frequency === "custom" && builder.customDays.length === 0) issues.push("Choose at least one day for custom frequency.");
  if (builder.modules.filter((m) => m.enabled).length === 0) issues.push("Enable at least one module for the digest.");

  for (const moduleEntry of builder.modules) {
    if (moduleEntry.settings.itemCount < 1 || moduleEntry.settings.itemCount > 12) {
      issues.push(`Item count for ${moduleEntry.module.replaceAll("_", " ")} must be between 1 and 12.`);
    }
  }

  return issues;
}

interface DigestBuilderProps {
  mode: "create" | "edit";
  digestId?: string;
}

export function DigestBuilder({ mode, digestId }: DigestBuilderProps) {
  const router = useRouter();
  const client = useMemo(() => supabase, []);

  const [step, setStep] = useState<BuilderStep>("starting_point");
  const [builder, setBuilder] = useState<BuilderState>(buildDefaultState);
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [errors, setErrors] = useState<string[]>([]);

  const sortedModules = useMemo(() => builder.modules.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [builder.modules]);
  const isDirty = initialSnapshot !== JSON.stringify(builder);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (mode !== "edit" || !digestId || !client) {
      const defaults = buildDefaultState();
      setBuilder(defaults);
      setInitialSnapshot(JSON.stringify(defaults));
      setLoading(false);
      return;
    }

    async function loadProfile() {
      const db = client;
      if (!db) return;
      setLoading(true);
      const { data, error } = await db.from("user_digest_profiles").select("*").eq("id", digestId).single();

      if (error || !data) {
        setToast({ tone: "error", message: error?.message ?? "Digest not found." });
        setLoading(false);
        return;
      }

      const nextBuilder = mapProfileToBuilder(data as UserDigestProfile);
      setBuilder(nextBuilder);
      setInitialSnapshot(JSON.stringify(nextBuilder));
      setLoading(false);
    }

    void loadProfile();
  }, [client, digestId, mode]);

  function patchBuilder(patch: Partial<BuilderState>) {
    setBuilder((prev) => ({ ...prev, ...patch }));
  }

  function patchModule(moduleKey: DigestModuleKey, patch: Partial<BuilderModuleConfig>) {
    setBuilder((prev) => ({
      ...prev,
      modules: prev.modules.map((item) => (item.module === moduleKey ? { ...item, ...patch } : item)),
    }));
  }

  function moveModule(moduleKey: DigestModuleKey, direction: "up" | "down") {
    setBuilder((prev) => {
      const sorted = prev.modules.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const index = sorted.findIndex((item) => item.module === moduleKey);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= sorted.length) return prev;

      [sorted[index], sorted[target]] = [sorted[target], sorted[index]];
      return {
        ...prev,
        modules: sorted.map((item, order) => ({ ...item, order })),
      };
    });
  }

  async function persist(nextState: "active" | "paused") {
    if (!client) {
      setToast({ tone: "error", message: "Supabase is not configured." });
      return;
    }

    const issues = validateBuilder(builder);
    setErrors(issues);
    if (issues.length > 0) return;

    setSaving(true);
    setToast(null);

    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      setSaving(false);
      setToast({ tone: "error", message: "Please sign in to save your digest." });
      return;
    }

    const payload = builderToPayload({ ...builder, state: nextState });
    const parseResult = userDigestProfileSchema.safeParse(payload);

    if (!parseResult.success) {
      setSaving(false);
      setErrors(parseResult.error.issues.map((issue: { message: string }) => issue.message));
      return;
    }

    if (mode === "edit" && digestId) {
      const { error } = await client.from("user_digest_profiles").update(payload).eq("id", digestId);
      setSaving(false);
      if (error) {
        setToast({ tone: "error", message: error.message });
        return;
      }
      const snapshot = JSON.stringify({ ...builder, state: nextState });
      setBuilder((prev) => ({ ...prev, state: nextState }));
      setInitialSnapshot(snapshot);
      setToast({ tone: "success", message: nextState === "active" ? "Digest updated and activated." : "Draft saved successfully." });
      return;
    }

    const { data, error } = await client.from("user_digest_profiles").insert({ ...payload, user_id: authData.user.id }).select("id").single();
    setSaving(false);

    if (error || !data) {
      setToast({ tone: "error", message: error?.message ?? "Unable to create digest." });
      return;
    }

    const snapshot = JSON.stringify({ ...builder, state: nextState });
    setInitialSnapshot(snapshot);
    setToast({ tone: "success", message: nextState === "active" ? "Digest created and activated." : "Draft created." });
    router.push(`/digests/${data.id}`);
  }

  async function duplicateDigest() {
    if (!client || !digestId) return;

    const { data: authData } = await client.auth.getUser();
    if (!authData.user) return;

    const payload = builderToPayload({ ...builder, digestName: `${builder.digestName} (Copy)`, internalLabel: `${builder.internalLabel}-copy`, state: "paused" });
    const { data, error } = await client.from("user_digest_profiles").insert({ ...payload, user_id: authData.user.id }).select("id").single();

    if (error || !data) {
      setToast({ tone: "error", message: error?.message ?? "Could not duplicate digest." });
      return;
    }

    setToast({ tone: "success", message: "Digest duplicated." });
    router.push(`/digests/${data.id}`);
  }

  async function deleteDigest() {
    if (!client || !digestId) return;
    const confirmed = window.confirm("Delete this digest? This action cannot be undone.");
    if (!confirmed) return;

    const { error } = await client.from("user_digest_profiles").delete().eq("id", digestId);
    if (error) {
      setToast({ tone: "error", message: error.message });
      return;
    }

    setToast({ tone: "success", message: "Digest deleted." });
    router.push("/digests/new");
  }

  if (loading) {
    return (
      <PageContainer className="py-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 w-40 rounded bg-muted" />
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 pb-12 pt-4">
      <SectionHeader
        eyebrow="Digest Builder"
        title={mode === "create" ? "Compose a custom ritual" : "Refine your digest"}
        description="Premium editorial controls for schedule, voice, modules, and delivery behavior."
      />

      {toast ? (
        <Card className={toast.tone === "success" ? "border-emerald-300/60" : "border-red-300/70"} surface="paper">
          <CardContent className="flex items-center gap-3 py-4">
            {toast.tone === "success" ? <CheckCircle2 className="h-5 w-5" /> : <TriangleAlert className="h-5 w-5" />}
            <p className="text-sm">{toast.message}</p>
          </CardContent>
        </Card>
      ) : null}

      {errors.length > 0 ? (
        <Card className="border-red-300/70" surface="paper">
          <CardHeader>
            <CardTitle className="text-lg">Please address these items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card surface="glass">
            <CardHeader>
              <CardTitle className="text-lg">Builder flow</CardTitle>
              <CardDescription>Move step by step. Your preview updates instantly.</CardDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                {STEPS.map((item) => (
                  <Button key={item.key} variant={item.key === step ? "primary" : "quiet"} size="sm" onClick={() => setStep(item.key)}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">Core identity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Digest name</span>
                <Input value={builder.digestName} onChange={(event) => patchBuilder({ digestName: event.target.value })} placeholder="e.g. Morning Briefing" />
              </label>
              <label className="space-y-2 text-sm">
                <span>Internal label</span>
                <Input value={builder.internalLabel} onChange={(event) => patchBuilder({ internalLabel: event.target.value })} placeholder="internal-use-label" />
              </label>
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">1) Choose a starting point</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => patchBuilder({ startFrom: "template" })}
                className={`rounded-xl border p-4 text-left transition ${builder.startFrom === "template" ? "border-foreground/50 bg-foreground/[0.04]" : "border-border"}`}
              >
                <p className="font-medium">Start from template</p>
                <p className="mt-1 text-xs text-foreground/70">Preload premium defaults and module balance.</p>
              </button>
              <button
                type="button"
                onClick={() => patchBuilder({ startFrom: "scratch", modules: buildDefaultModules().map((moduleEntry) => ({ ...moduleEntry, enabled: false })) })}
                className={`rounded-xl border p-4 text-left transition ${builder.startFrom === "scratch" ? "border-foreground/50 bg-foreground/[0.04]" : "border-border"}`}
              >
                <p className="font-medium">Start from scratch</p>
                <p className="mt-1 text-xs text-foreground/70">Begin clean and craft every section manually.</p>
              </button>
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">2) Configure schedule</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Frequency</span>
                <select className="w-full rounded-md border bg-background px-3 py-2" value={builder.frequency} onChange={(event) => patchBuilder({ frequency: event.target.value as Frequency })}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              {builder.frequency === "weekly" ? (
                <label className="space-y-2 text-sm">
                  <span>Day of week</span>
                  <select className="w-full rounded-md border bg-background px-3 py-2" value={builder.dayOfWeek} onChange={(event) => patchBuilder({ dayOfWeek: Number(event.target.value) })}>
                    {WEEKDAYS.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {builder.frequency === "custom" ? (
                <div className="space-y-2 text-sm md:col-span-2">
                  <span>Custom days</span>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day, index) => {
                      const enabled = builder.customDays.includes(index);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            patchBuilder({
                              customDays: enabled ? builder.customDays.filter((item) => item !== index) : [...builder.customDays, index].sort((a, b) => a - b),
                            })
                          }
                          className={`rounded-full border px-3 py-1 text-xs ${enabled ? "border-foreground/70 bg-foreground/[0.06]" : "border-border"}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <label className="space-y-2 text-sm">
                <span>Send time</span>
                <Input type="time" value={builder.sendTime} onChange={(event) => patchBuilder({ sendTime: event.target.value })} />
              </label>

              <label className="space-y-2 text-sm">
                <span>Timezone</span>
                <Input value={builder.timezone} onChange={(event) => patchBuilder({ timezone: event.target.value })} placeholder="America/New_York" />
              </label>
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">3) Tone and style</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span>Language</span>
                <select className="w-full rounded-md border bg-background px-3 py-2" value={builder.language} onChange={(event) => patchBuilder({ language: event.target.value })}>
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span>Tone</span>
                <select className="w-full rounded-md border bg-background px-3 py-2" value={builder.tone} onChange={(event) => patchBuilder({ tone: event.target.value as BuilderState["tone"] })}>
                  {["elegant", "editorial", "warm", "polished", "gentle", "uplifted", "clear", "smart"].map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span>Layout style</span>
                <select className="w-full rounded-md border bg-background px-3 py-2" value={builder.layoutStyle} onChange={(event) => patchBuilder({ layoutStyle: event.target.value as BuilderState["layoutStyle"] })}>
                  <option value="newspaper">Editorial newspaper</option>
                  <option value="minimal">Minimal column</option>
                  <option value="letter">Personal letter</option>
                </select>
              </label>
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">4) Select modules</CardTitle>
              <CardDescription>Toggle modules and choose item volume with fallback behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedModules.map((moduleEntry) => {
                const definition = digestModuleRegistry.get(moduleEntry.module);
                return (
                  <div key={moduleEntry.module} className="rounded-xl border border-border/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{definition?.title ?? moduleEntry.module}</p>
                        <p className="text-xs text-foreground/70">{definition?.description}</p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={Boolean(moduleEntry.enabled)} onChange={(event) => patchModule(moduleEntry.module, { enabled: event.target.checked })} />
                        On
                      </label>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <label className="space-y-1 text-xs">
                        <span>Item count</span>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={moduleEntry.settings.itemCount}
                          onChange={(event) => patchModule(moduleEntry.module, { settings: { ...moduleEntry.settings, itemCount: Number(event.target.value) } })}
                        />
                      </label>
                      <label className="space-y-1 text-xs">
                        <span>Fallback behavior</span>
                        <select
                          className="w-full rounded-md border bg-background px-3 py-2"
                          value={moduleEntry.settings.fallbackBehavior}
                          onChange={(event) =>
                            patchModule(moduleEntry.module, {
                              settings: { ...moduleEntry.settings, fallbackBehavior: event.target.value as FallbackBehavior },
                            })
                          }
                        >
                          <option value="skip">Skip section</option>
                          <option value="use_previous">Use recent data</option>
                          <option value="insert_placeholder">Insert elegant placeholder</option>
                        </select>
                      </label>
                      {moduleEntry.module === "free_text_custom_block" ? (
                        <label className="space-y-1 text-xs md:col-span-3">
                          <span>Custom block text</span>
                          <textarea
                            className="min-h-20 w-full rounded-md border bg-background px-3 py-2"
                            value={moduleEntry.settings.customText ?? ""}
                            onChange={(event) =>
                              patchModule(moduleEntry.module, {
                                settings: {
                                  ...moduleEntry.settings,
                                  customText: event.target.value,
                                },
                              })
                            }
                          />
                        </label>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">5) Arrange modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedModules.map((moduleEntry, index) => (
                <div key={moduleEntry.module} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                  <span>{digestModuleRegistry.get(moduleEntry.module)?.title}</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="quiet" onClick={() => moveModule(moduleEntry.module, "up")} disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="quiet" onClick={() => moveModule(moduleEntry.module, "down")} disabled={index === sortedModules.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card surface="paper">
            <CardHeader>
              <CardTitle className="text-lg">7) Save and activate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button onClick={() => void persist("paused")} disabled={saving}>
                <Save className="mr-2 h-4 w-4" /> Save draft
              </Button>
              <Button onClick={() => void persist("active")} disabled={saving}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Save & activate
              </Button>
              {mode === "edit" ? (
                <>
                  <Button variant="quiet" onClick={() => void duplicateDigest()}>
                    <Copy className="mr-2 h-4 w-4" /> Duplicate digest
                  </Button>
                  <Button variant="quiet" onClick={() => void persist(builder.state === "active" ? "paused" : "active")}>
                    {builder.state === "active" ? "Pause" : "Activate"}
                  </Button>
                  <Button variant="quiet" onClick={() => void deleteDigest()}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </>
              ) : null}
              <Link className="ml-auto text-sm text-foreground/70 underline-offset-4 hover:underline" href="/digests/templates">
                Browse templates
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card surface="glass" className="sticky top-4 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">6) Live email preview</CardTitle>
            <CardDescription>A realistic editorial message shell that updates with every choice.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-border/70 bg-white p-5 text-slate-900 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Atriae digest</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{builder.digestName || "Untitled Digest"}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {builder.frequency} · {builder.sendTime} · {builder.timezone}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {builder.language} · {builder.tone} tone · {builder.layoutStyle} layout
              </p>

              <div className="mt-5 space-y-3">
                {sortedModules
                  .filter((moduleEntry) => moduleEntry.enabled)
                  .map((moduleEntry) => (
                    <div key={moduleEntry.module} className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm font-medium">{digestModuleRegistry.get(moduleEntry.module)?.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{moduleEntry.settings.itemCount} items · fallback: {moduleEntry.settings.fallbackBehavior}</p>
                      {moduleEntry.module === "free_text_custom_block" && moduleEntry.settings.customText ? (
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">{moduleEntry.settings.customText}</p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">Sample preview copy for this module appears here as it would in email.</p>
                      )}
                    </div>
                  ))}
                {sortedModules.filter((moduleEntry) => moduleEntry.enabled).length === 0 ? (
                  <p className="text-sm text-slate-500">Enable modules to generate your live preview.</p>
                ) : null}
              </div>
            </div>
            {isDirty ? <p className="mt-3 text-xs text-amber-700">You have unsaved changes.</p> : null}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
