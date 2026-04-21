import { digestModuleRegistry, type ModuleConfig } from "@/lib/digests";
import type { DigestModuleKey, UserDigestProfile } from "@/lib/digests/types";
import type { DigestRenderContext, NormalizedDigestModule, ResolvedModule } from "@/lib/digests/rendering/types";

type ModulePayload = Record<string, unknown>;
type ModuleRenderer = (payload: ModulePayload, context: DigestRenderContext, config: ModuleConfig) => NormalizedDigestModule;

const DEFAULT_QUOTE = {
  text: "The quality of your attention determines the quality of your days.",
  author: "Unknown",
};

const MOCK_FETCHERS: Record<DigestModuleKey, (config: ModuleConfig) => ModulePayload> = {
  top_headlines: () => ({
    headlines: [
      "AI infrastructure spending rises as enterprise adoption accelerates.",
      "Global markets open mixed while energy prices stabilize.",
      "Cities expand low-emission transport zones this quarter.",
    ],
    outlet: "Atriae Wire",
  }),
  weather: () => ({ condition: "Partly cloudy", high: 68, low: 54, precipChance: 15 }),
  what_to_wear: () => ({ direction: "Layer a breathable knit with a light structured jacket." }),
  calendar_summary: () => ({ meetings: 4, firstMeeting: "9:30 AM", openWindow: "2:00-3:00 PM" }),
  focus_block: () => ({ task: "Draft the strategy memo before noon.", duration: "90 minutes" }),
  learn_something: () => ({ idea: "Use decision journals to improve strategic pattern recognition." }),
  culture_pick: () => ({ title: "A profile on quiet leadership", format: "Long read" }),
  series_tip: () => ({ title: "Ripley", why: "Elegant pacing and meticulous character tension." }),
  film_tip: () => ({ title: "Past Lives", why: "Subtle, emotionally intelligent storytelling." }),
  book_tip: () => ({ title: "The Comfort Crisis", author: "Michael Easter" }),
  music_pick: () => ({ title: "Late Night Tales", artist: "Khruangbin" }),
  podcast_pick: () => ({ title: "The Knowledge Project", episode: "Decision quality under pressure" }),
  sunday_reset_checklist: () => ({ items: ["Clear inbox triage", "Prep Monday top three", "Reset workspace"] }),
  meal_prep_tip: () => ({ tip: "Batch a protein base and two flexible sides for quick weekday bowls." }),
  social_nudge: () => ({ prompt: "Send one thoughtful check-in to someone you have not spoken to lately." }),
  quote_reflection: () => DEFAULT_QUOTE,
  event_reminder: () => ({ event: "Quarterly planning review", when: "Tomorrow at 10:00 AM" }),
  free_text_custom_block: (config) => ({
    headline: String(config.settings?.headline ?? "Custom Note"),
    body: String(config.settings?.body ?? config.settings?.customText ?? "Add your custom editorial note."),
  }),
};

const MODULE_RENDERERS: Record<DigestModuleKey, ModuleRenderer> = {
  top_headlines: (payload) => ({
    key: "top_headlines",
    title: "Top headlines",
    kicker: "Signal",
    summary: "A concise read on what is moving today.",
    bullets: (payload.headlines as string[]) ?? [],
    sourcePayload: { sourceType: "news_mock", sourceLabel: String(payload.outlet ?? "Atriae Wire"), payload },
  }),
  weather: (payload) => ({
    key: "weather",
    title: "Weather",
    summary: `${payload.condition}, ${payload.high}°/${payload.low}° with ${payload.precipChance}% rain risk.`,
    bullets: ["Built for a smooth day plan."],
    sourcePayload: { sourceType: "weather_mock", sourceLabel: "Atriae Forecast", payload },
  }),
  what_to_wear: (payload) => ({
    key: "what_to_wear",
    title: "What to wear",
    summary: String(payload.direction),
    bullets: ["Comfortable, structured, weather-aware."],
    sourcePayload: { sourceType: "wardrobe_mock", sourceLabel: "Style Assistant", payload },
  }),
  calendar_summary: (payload) => ({
    key: "calendar_summary",
    title: "Calendar summary",
    summary: `${payload.meetings} meetings. First at ${payload.firstMeeting}.`,
    bullets: [`Open window: ${payload.openWindow}`],
    sourcePayload: { sourceType: "calendar_mock", sourceLabel: "Calendar Snapshot", payload },
  }),
  focus_block: (payload) => ({
    key: "focus_block",
    title: "Focus block",
    kicker: "Momentum",
    summary: String(payload.task),
    bullets: [`Protect ${payload.duration} of uninterrupted work.`],
    sourcePayload: { sourceType: "focus_mock", sourceLabel: "Focus Engine", payload },
  }),
  learn_something: (payload) => ({
    key: "learn_something",
    title: "Learn something",
    summary: String(payload.idea),
    bullets: ["Small insight, compounding returns."],
    sourcePayload: { sourceType: "learning_mock", sourceLabel: "Learning Curator", payload },
  }),
  culture_pick: (payload) => ({
    key: "culture_pick",
    title: "Culture pick",
    summary: `${payload.title} (${payload.format}).`,
    bullets: ["Thoughtful, modern, worth twenty minutes."],
    sourcePayload: { sourceType: "culture_mock", sourceLabel: "Culture Desk", payload },
  }),
  series_tip: (payload) => ({
    key: "series_tip",
    title: "Series tip",
    summary: String(payload.title),
    bullets: [String(payload.why)],
    sourcePayload: { sourceType: "series_mock", sourceLabel: "Screening Notes", payload },
  }),
  film_tip: (payload) => ({
    key: "film_tip",
    title: "Film tip",
    summary: String(payload.title),
    bullets: [String(payload.why)],
    sourcePayload: { sourceType: "film_mock", sourceLabel: "Film Notes", payload },
  }),
  book_tip: (payload) => ({
    key: "book_tip",
    title: "Book tip",
    summary: `${payload.title} — ${payload.author}`,
    bullets: ["Readable in short sessions, rich in ideas."],
    sourcePayload: { sourceType: "books_mock", sourceLabel: "Reading Desk", payload },
  }),
  music_pick: (payload) => ({
    key: "music_pick",
    title: "Music pick",
    summary: `${payload.title} by ${payload.artist}`,
    bullets: ["A calm but energizing backdrop."],
    sourcePayload: { sourceType: "music_mock", sourceLabel: "Audio Curation", payload },
  }),
  podcast_pick: (payload) => ({
    key: "podcast_pick",
    title: "Podcast pick",
    summary: `${payload.title}: ${payload.episode}`,
    bullets: ["Strong signal in under 20 minutes."],
    sourcePayload: { sourceType: "podcast_mock", sourceLabel: "Podcast Desk", payload },
  }),
  sunday_reset_checklist: (payload) => ({
    key: "sunday_reset_checklist",
    title: "Sunday reset checklist",
    summary: "A gentle sequence to lower Monday friction.",
    bullets: (payload.items as string[]) ?? [],
    sourcePayload: { sourceType: "reset_mock", sourceLabel: "Reset Routine", payload },
  }),
  meal_prep_tip: (payload) => ({
    key: "meal_prep_tip",
    title: "Meal prep tip",
    summary: String(payload.tip),
    bullets: ["Nourishing and realistic for a busy week."],
    sourcePayload: { sourceType: "meal_mock", sourceLabel: "Kitchen Brief", payload },
  }),
  social_nudge: (payload) => ({
    key: "social_nudge",
    title: "Social nudge",
    summary: String(payload.prompt),
    bullets: ["Connection is part of wellbeing."],
    sourcePayload: { sourceType: "social_mock", sourceLabel: "Social Prompt", payload },
  }),
  quote_reflection: (payload) => ({
    key: "quote_reflection",
    title: "Quote reflection",
    summary: `“${payload.text}” — ${payload.author}`,
    bullets: ["Carry this line into one decision today."],
    sourcePayload: { sourceType: "quote_mock", sourceLabel: "Reflection Library", payload },
  }),
  event_reminder: (payload) => ({
    key: "event_reminder",
    title: "Event reminder",
    summary: `${payload.event}: ${payload.when}`,
    bullets: ["Prepare one talking point in advance."],
    sourcePayload: { sourceType: "event_mock", sourceLabel: "Event Assistant", payload },
  }),
  free_text_custom_block: (payload) => ({
    key: "free_text_custom_block",
    title: String(payload.headline ?? "Custom note"),
    summary: String(payload.body ?? ""),
    bullets: [],
    sourcePayload: { sourceType: "custom", sourceLabel: "User Custom Block", payload },
  }),
};

export function resolveEnabledModules(profile: UserDigestProfile): ResolvedModule[] {
  return profile.module_config
    .filter((module) => module.enabled !== false)
    .map((module) => digestModuleRegistry.resolveConfig(module))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((config) => ({ key: config.module, config }));
}

export function renderModules(
  modules: ResolvedModule[],
  context: DigestRenderContext,
  overrides: Partial<Record<DigestModuleKey, Record<string, unknown>>> = {},
): NormalizedDigestModule[] {
  return modules.map(({ key, config }) => {
    const payload = {
      ...MOCK_FETCHERS[key](config),
      ...(overrides[key] ?? {}),
    };

    return MODULE_RENDERERS[key](payload, context, config);
  });
}
