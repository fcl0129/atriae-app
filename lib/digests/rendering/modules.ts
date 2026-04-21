import { digestModuleRegistry, type ModuleConfig } from "@/lib/digests";
import { createDigestProviders } from "@/lib/digests/providers";
import type { DigestModuleKey, UserDigestProfile } from "@/lib/digests/types";
import type { DigestRenderContext, NormalizedDigestModule, ResolvedModule } from "@/lib/digests/rendering/types";

type ModulePayload = Record<string, unknown>;
type ModuleRenderer = (payload: ModulePayload, context: DigestRenderContext, config: ModuleConfig) => NormalizedDigestModule;

const DEFAULT_QUOTE = {
  text: "The quality of your attention determines the quality of your days.",
  author: "Unknown",
};

const FALLBACK_SUMMARIES: Partial<Record<DigestModuleKey, string>> = {
  top_headlines: "No live headlines right now. Your digest remains focused and calm.",
  weather: "Weather data is temporarily unavailable. Plan for flexibility today.",
  what_to_wear: "Wear comfortable layers that can adapt across the day.",
  calendar_summary: "Calendar data is unavailable. Keep one protected focus window today.",
  culture_pick: "No fresh culture pick is available right now. Revisit a saved article or essay.",
  series_tip: "No series recommendation is available at the moment.",
  music_pick: "No music recommendation is available right now.",
  podcast_pick: "No podcast recommendation is available right now.",
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

const MODULE_RENDERERS: Record<DigestModuleKey, ModuleRenderer> = {
  top_headlines: (payload) => ({
    key: "top_headlines",
    title: "Top headlines",
    kicker: "Signal",
    summary: asString(payload.summary, "A concise read on what is moving today."),
    bullets: Array.isArray(payload.headlines) && payload.headlines.length > 0 ? (payload.headlines as string[]) : [FALLBACK_SUMMARIES.top_headlines as string],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  weather: (payload) => ({
    key: "weather",
    title: "Weather",
    summary:
      typeof payload.condition === "string"
        ? `${payload.condition}, ${payload.highF ?? "--"}°/${payload.lowF ?? "--"}° with ${payload.precipChance ?? "--"}% rain risk.`
        : (FALLBACK_SUMMARIES.weather as string),
    bullets: ["Built for a smooth day plan."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  what_to_wear: (payload) => ({
    key: "what_to_wear",
    title: "What to wear",
    summary: asString(payload.direction, FALLBACK_SUMMARIES.what_to_wear as string),
    bullets: ["Comfortable, structured, weather-aware."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  calendar_summary: (payload) => ({
    key: "calendar_summary",
    title: "Calendar summary",
    summary:
      typeof payload.meetingsCount === "number"
        ? `${payload.meetingsCount} meetings. First at ${asString(payload.firstMeetingTime, "TBD")}.`
        : (FALLBACK_SUMMARIES.calendar_summary as string),
    bullets: [asString(payload.openWindow, "No open window identified yet.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  focus_block: (payload) => ({
    key: "focus_block",
    title: "Focus block",
    kicker: "Momentum",
    summary: asString(payload.task, "Choose one meaningful task and protect a short focus window."),
    bullets: [`Protect ${asString(payload.duration, "60 minutes")} of uninterrupted work.`],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  learn_something: (payload) => ({
    key: "learn_something",
    title: "Learn something",
    summary: asString(payload.idea, "Capture one insight from your current work and revisit it at week's end."),
    bullets: ["Small insight, compounding returns."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  culture_pick: (payload) => ({
    key: "culture_pick",
    title: "Culture pick",
    summary: payload.title ? `${payload.title}${payload.subtitle ? ` (${payload.subtitle})` : ""}.` : (FALLBACK_SUMMARIES.culture_pick as string),
    bullets: [asString(payload.reason, "Thoughtful, modern, worth your time.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  series_tip: (payload) => ({
    key: "series_tip",
    title: "Series tip",
    summary: asString(payload.title, FALLBACK_SUMMARIES.series_tip as string),
    bullets: [asString(payload.reason, "Choose an episode that helps you fully switch contexts.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  film_tip: (payload) => ({
    key: "film_tip",
    title: "Film tip",
    summary: asString(payload.title, "No film recommendation is available right now."),
    bullets: [asString(payload.why, "Pick a film that rewards full attention.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  book_tip: (payload) => ({
    key: "book_tip",
    title: "Book tip",
    summary: payload.title ? `${payload.title}${payload.author ? ` — ${payload.author}` : ""}` : "No book recommendation is available right now.",
    bullets: ["Readable in short sessions, rich in ideas."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  music_pick: (payload) => ({
    key: "music_pick",
    title: "Music pick",
    summary: payload.title ? `${payload.title}${payload.subtitle ? ` by ${payload.subtitle}` : ""}` : (FALLBACK_SUMMARIES.music_pick as string),
    bullets: [asString(payload.reason, "Choose a track that supports your energy for the next hour.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  podcast_pick: (payload) => ({
    key: "podcast_pick",
    title: "Podcast pick",
    summary: payload.title ? `${payload.title}${payload.subtitle ? `: ${payload.subtitle}` : ""}` : (FALLBACK_SUMMARIES.podcast_pick as string),
    bullets: [asString(payload.reason, "Pick an episode that helps you think better.")],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), sourceRef: payload.sourceRef as string | undefined, payload },
  }),
  sunday_reset_checklist: (payload) => ({
    key: "sunday_reset_checklist",
    title: "Sunday reset checklist",
    summary: "A gentle sequence to lower Monday friction.",
    bullets: (payload.items as string[]) ?? ["Clear inbox triage", "Prep Monday top three", "Reset workspace"],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  meal_prep_tip: (payload) => ({
    key: "meal_prep_tip",
    title: "Meal prep tip",
    summary: asString(payload.tip, "Batch one protein base and two flexible sides for easy weekday meals."),
    bullets: ["Nourishing and realistic for a busy week."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  social_nudge: (payload) => ({
    key: "social_nudge",
    title: "Social nudge",
    summary: asString(payload.prompt, "Reach out to someone you appreciate with one thoughtful message."),
    bullets: ["Connection is part of wellbeing."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  quote_reflection: (payload) => ({
    key: "quote_reflection",
    title: "Quote reflection",
    summary: `“${asString(payload.text, DEFAULT_QUOTE.text)}” — ${asString(payload.author, DEFAULT_QUOTE.author)}`,
    bullets: ["Carry this line into one decision today."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  event_reminder: (payload) => ({
    key: "event_reminder",
    title: "Event reminder",
    summary: payload.event ? `${payload.event}: ${asString(payload.when, "TBD")}` : "No upcoming events are available right now.",
    bullets: ["Prepare one talking point in advance."],
    sourcePayload: { sourceType: String(payload.sourceType), sourceLabel: String(payload.sourceLabel), payload },
  }),
  free_text_custom_block: (payload) => ({
    key: "free_text_custom_block",
    title: asString(payload.headline, "Custom note"),
    summary: asString(payload.body, ""),
    bullets: [],
    sourcePayload: { sourceType: "custom", sourceLabel: "User Custom Block", payload },
  }),
};

async function resolveModulePayload(module: ResolvedModule, context: DigestRenderContext): Promise<ModulePayload> {
  const providers = createDigestProviders();
  const rawLat = Number(context.profile.digest_config.personalization?.lat as number | undefined);
  const rawLon = Number(context.profile.digest_config.personalization?.lon as number | undefined);
  const providerContext = {
    locale: context.locale,
    timezone: context.profile.timezone,
    preview: context.preview,
    latitude: Number.isFinite(rawLat) ? rawLat : undefined,
    longitude: Number.isFinite(rawLon) ? rawLon : undefined,
  };

  switch (module.key) {
    case "top_headlines": {
      const result = await providers.news.getTopHeadlines(providerContext);
      return { ...result.data, sourceType: result.sourceType, sourceLabel: result.sourceLabel, sourceRef: result.sourceRef, summary: "A concise read on what is moving today." };
    }
    case "weather": {
      const result = await providers.weather.getForecast(providerContext);
      return { ...result.data, sourceType: result.sourceType, sourceLabel: result.sourceLabel, sourceRef: result.sourceRef };
    }
    case "what_to_wear": {
      const weather = await providers.weather.getForecast(providerContext);
      const direction = weather.data?.precipChance && weather.data.precipChance >= 40
        ? "Carry a light waterproof layer and closed shoes."
        : "Layer a breathable knit with a light structured jacket.";
      return { direction, sourceType: weather.sourceType, sourceLabel: weather.sourceLabel, sourceRef: weather.sourceRef };
    }
    case "calendar_summary": {
      const result = await providers.calendar.getSummary(providerContext);
      return { ...result.data, sourceType: result.sourceType, sourceLabel: result.sourceLabel, sourceRef: result.sourceRef };
    }
    case "culture_pick":
    case "series_tip":
    case "music_pick":
    case "podcast_pick": {
      const result = await providers.recommendations.getPick(module.key, providerContext);
      return { ...result.data, sourceType: result.sourceType, sourceLabel: result.sourceLabel, sourceRef: result.sourceRef };
    }
    case "free_text_custom_block":
      return {
        headline: String(module.config.settings?.headline ?? "Custom Note"),
        body: String(module.config.settings?.body ?? module.config.settings?.customText ?? "Add your custom editorial note."),
      };
    default:
      return {
        sourceType: `${module.key}_mock`,
        sourceLabel: "Atriae",
      };
  }
}

export function resolveEnabledModules(profile: UserDigestProfile): ResolvedModule[] {
  return profile.module_config
    .filter((module) => module.enabled !== false)
    .map((module) => digestModuleRegistry.resolveConfig(module))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((config) => ({ key: config.module, config }));
}

export async function renderModules(
  modules: ResolvedModule[],
  context: DigestRenderContext,
  overrides: Partial<Record<DigestModuleKey, Record<string, unknown>>> = {},
): Promise<NormalizedDigestModule[]> {
  const payloads = await Promise.all(
    modules.map(async (module) => ({
      module,
      payload: {
        ...(await resolveModulePayload(module, context)),
        ...(overrides[module.key] ?? {}),
      },
    })),
  );

  return payloads.map(({ module, payload }) => MODULE_RENDERERS[module.key](payload, context, module.config));
}
