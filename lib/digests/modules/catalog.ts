import type { DigestModuleDefinition } from "@/lib/digests/modules/registry";
import { DigestModuleRegistry } from "@/lib/digests/modules/registry";

const SYSTEM_DIGEST_MODULES: DigestModuleDefinition[] = [
  { key: "top_headlines", title: "Top Headlines", description: "Priority stories in a concise editorial wrap.", category: "context" },
  { key: "weather", title: "Weather", description: "Elegant local forecast with practical framing.", category: "context" },
  { key: "what_to_wear", title: "What to Wear", description: "Simple wardrobe direction based on the day ahead.", category: "lifestyle" },
  { key: "calendar_summary", title: "Calendar Summary", description: "Your day at a glance with meaningful context.", category: "planning" },
  { key: "focus_block", title: "Focus Block", description: "One intentional focus recommendation for momentum.", category: "planning" },
  { key: "learn_something", title: "Learn Something", description: "A curated idea to expand your perspective.", category: "culture" },
  { key: "culture_pick", title: "Culture Pick", description: "A refined cultural recommendation worth your time.", category: "culture" },
  { key: "series_tip", title: "Series Tip", description: "A thoughtful episodic recommendation.", category: "culture" },
  { key: "film_tip", title: "Film Tip", description: "A cinematic pick for this week.", category: "culture" },
  { key: "book_tip", title: "Book Tip", description: "A compelling read selected with intent.", category: "culture" },
  { key: "music_pick", title: "Music Pick", description: "A listening suggestion tuned to your mood.", category: "culture" },
  { key: "podcast_pick", title: "Podcast Pick", description: "A podcast episode or series chosen for signal.", category: "culture" },
  { key: "sunday_reset_checklist", title: "Sunday Reset Checklist", description: "A reset framework to prepare your week.", category: "planning" },
  { key: "meal_prep_tip", title: "Meal Prep Tip", description: "A practical prep idea for nourishing days.", category: "lifestyle" },
  { key: "social_nudge", title: "Social Nudge", description: "A gentle invitation to connect with intention.", category: "lifestyle" },
  { key: "quote_reflection", title: "Quote Reflection", description: "A short reflection prompt with literary texture.", category: "culture" },
  { key: "event_reminder", title: "Event Reminder", description: "Proactive reminders for upcoming commitments.", category: "planning" },
  {
    key: "free_text_custom_block",
    title: "Custom Block",
    description: "A flexible editorial section for bespoke content.",
    category: "custom",
    defaultSettings: { headline: "Custom Note", body: "" },
  },
];

export function createDigestModuleRegistry() {
  return new DigestModuleRegistry().registerMany(SYSTEM_DIGEST_MODULES);
}

export const digestModuleRegistry = createDigestModuleRegistry();
