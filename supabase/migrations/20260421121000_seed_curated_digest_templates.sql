insert into public.digest_templates (
  slug,
  display_name,
  strapline,
  description,
  ritual_type,
  is_system,
  scheduling_defaults,
  config,
  modules
)
values
  (
    'morning-brief',
    'Morning Brief',
    'A calm editorial opening to your day.',
    'A premium morning ritual that blends headlines, weather, and focused planning.',
    'brief',
    true,
    '{"timezone":"America/New_York","cadence":"daily","time":"07:00","days":[1,2,3,4,5]}'::jsonb,
    '{"voice":"elegant","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"top_headlines"},{"module":"weather"},{"module":"what_to_wear"},{"module":"calendar_summary"},{"module":"focus_block"}]'::jsonb
  ),
  (
    'executive-morning',
    'Executive Morning',
    'Signal over noise, before first meeting.',
    'A high-signal morning brief with priorities, schedule framing, and selective learning.',
    'brief',
    true,
    '{"timezone":"America/New_York","cadence":"daily","time":"06:30","days":[1,2,3,4,5]}'::jsonb,
    '{"voice":"editorial","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"top_headlines"},{"module":"calendar_summary"},{"module":"focus_block"},{"module":"learn_something"},{"module":"event_reminder"}]'::jsonb
  ),
  (
    'sunday-reset',
    'Sunday Reset',
    'A ritual to reset your week with intention.',
    'A weekly reset digest centered on planning, preparation, and reflection.',
    'ritual',
    true,
    '{"timezone":"America/New_York","cadence":"weekly","time":"09:00","days":[0]}'::jsonb,
    '{"voice":"warm","length":"standard","delivery":"email"}'::jsonb,
    '[{"module":"sunday_reset_checklist"},{"module":"meal_prep_tip"},{"module":"social_nudge"},{"module":"quote_reflection"}]'::jsonb
  ),
  (
    'culture-edit',
    'Culture Edit',
    'A tasteful curation for curious minds.',
    'A curated culture ritual that surfaces reading, watching, and listening picks.',
    'digest',
    true,
    '{"timezone":"America/New_York","cadence":"weekly","time":"18:00","days":[4]}'::jsonb,
    '{"voice":"polished","length":"standard","delivery":"email"}'::jsonb,
    '[{"module":"culture_pick"},{"module":"film_tip"},{"module":"book_tip"},{"module":"music_pick"},{"module":"podcast_pick"}]'::jsonb
  ),
  (
    'soft-life-evening',
    'Soft Life Evening',
    'Wind down gently, with style.',
    'An evening ritual for lighter reflection and graceful unwinding.',
    'ritual',
    true,
    '{"timezone":"America/New_York","cadence":"daily","time":"20:30","days":[0,1,2,3,4,5,6]}'::jsonb,
    '{"voice":"gentle","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"what_to_wear"},{"module":"music_pick"},{"module":"quote_reflection"},{"module":"free_text_custom_block"}]'::jsonb
  ),
  (
    'host-mode',
    'Host Mode',
    'Confident preparation before guests arrive.',
    'A host preparation digest with planning reminders and social prompts.',
    'ritual',
    true,
    '{"timezone":"America/New_York","cadence":"weekly","time":"15:00","days":[5]}'::jsonb,
    '{"voice":"uplifted","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"event_reminder"},{"module":"meal_prep_tip"},{"module":"social_nudge"},{"module":"series_tip"}]'::jsonb
  ),
  (
    'learning-drop',
    'Learning Drop',
    'One meaningful thing to learn, consistently.',
    'A focused learning digest for continuous intellectual momentum.',
    'digest',
    true,
    '{"timezone":"America/New_York","cadence":"weekly","time":"08:15","days":[2]}'::jsonb,
    '{"voice":"clear","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"learn_something"},{"module":"book_tip"},{"module":"podcast_pick"},{"module":"free_text_custom_block"}]'::jsonb
  ),
  (
    'commute-capsule',
    'Commute Capsule',
    'A compact companion for the ride ahead.',
    'A brief commute digest for headlines, audio, and timely reminders.',
    'brief',
    true,
    '{"timezone":"America/New_York","cadence":"daily","time":"07:45","days":[1,2,3,4,5]}'::jsonb,
    '{"voice":"smart","length":"concise","delivery":"email"}'::jsonb,
    '[{"module":"top_headlines"},{"module":"podcast_pick"},{"module":"music_pick"},{"module":"event_reminder"}]'::jsonb
  )
on conflict (slug) do update
set
  display_name = excluded.display_name,
  strapline = excluded.strapline,
  description = excluded.description,
  ritual_type = excluded.ritual_type,
  is_system = true,
  scheduling_defaults = excluded.scheduling_defaults,
  config = excluded.config,
  modules = excluded.modules,
  updated_at = now();
