-- Supabase schema compatibility repair for Atriae dashboard, profiles, learning, rituals, and digests.
-- Idempotent and safe: creates missing objects, adds missing columns, refreshes RLS policies,
-- avoids destructive operations, and preserves existing data.

create extension if not exists pgcrypto;

-- Shared updated_at trigger function.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Ensure new auth users get a profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists morning_ritual_reminder text;

-- Dashboard
create table if not exists public.dashboard_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  template_key text,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_views_slug_unique_per_user unique (user_id, slug)
);

alter table public.dashboard_views
  add column if not exists template_key text,
  add column if not exists is_default boolean not null default false,
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  dashboard_view_id uuid not null references public.dashboard_views(id) on delete cascade,
  widget_type text not null,
  title text,
  size text not null default 'medium',
  position integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dashboard_widgets
  add column if not exists title text,
  add column if not exists size text not null default 'medium',
  add column if not exists position integer not null default 0,
  add column if not exists settings jsonb not null default '{}'::jsonb,
  add column if not exists is_hidden boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

-- Learning
create table if not exists public.learning_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  resources_count integer not null default 0,
  pace text,
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  constraint learning_topics_progress_range check (progress >= 0 and progress <= 100),
  constraint learning_topics_resources_non_negative check (resources_count >= 0)
);

alter table public.learning_topics
  add column if not exists resources_count integer not null default 0,
  add column if not exists pace text,
  add column if not exists progress integer not null default 0;

create table if not exists public.learning_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.learning_topics(id) on delete cascade,
  mode text not null,
  title text not null,
  summary text not null,
  sections jsonb not null default '[]'::jsonb,
  next_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.learning_briefs
  add column if not exists sections jsonb not null default '[]'::jsonb,
  add column if not exists next_steps jsonb not null default '[]'::jsonb;

-- Rituals
create table if not exists public.rituals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  cadence text,
  prompt text,
  created_at timestamptz not null default now()
);

alter table public.rituals
  add column if not exists cadence text,
  add column if not exists prompt text;

create table if not exists public.ritual_checkins (
  id uuid primary key default gen_random_uuid(),
  ritual_id uuid not null references public.rituals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now()
);

-- Digests
create table if not exists public.digest_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  strapline text,
  description text,
  ritual_type text not null default 'brief',
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  scheduling_defaults jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  modules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digest_templates_ritual_type_check check (ritual_type in ('ritual', 'brief', 'digest')),
  constraint digest_templates_modules_is_array check (jsonb_typeof(modules) = 'array'),
  constraint digest_templates_config_is_object check (jsonb_typeof(config) = 'object'),
  constraint digest_templates_sched_defaults_is_object check (jsonb_typeof(scheduling_defaults) = 'object')
);

alter table public.digest_templates
  add column if not exists strapline text,
  add column if not exists description text,
  add column if not exists ritual_type text not null default 'brief',
  add column if not exists is_system boolean not null default false,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists scheduling_defaults jsonb not null default '{}'::jsonb,
  add column if not exists config jsonb not null default '{}'::jsonb,
  add column if not exists modules jsonb not null default '[]'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_digest_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.digest_templates(id) on delete set null,
  title text not null,
  status text not null default 'active',
  timezone text not null default 'UTC',
  scheduling_config jsonb not null default '{}'::jsonb,
  digest_config jsonb not null default '{}'::jsonb,
  module_config jsonb not null default '[]'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_digest_profiles_status_check check (status in ('active', 'paused', 'archived')),
  constraint user_digest_profiles_sched_is_object check (jsonb_typeof(scheduling_config) = 'object'),
  constraint user_digest_profiles_digest_is_object check (jsonb_typeof(digest_config) = 'object'),
  constraint user_digest_profiles_module_is_array check (jsonb_typeof(module_config) = 'array')
);

alter table public.user_digest_profiles
  add column if not exists status text not null default 'active',
  add column if not exists timezone text not null default 'UTC',
  add column if not exists scheduling_config jsonb not null default '{}'::jsonb,
  add column if not exists digest_config jsonb not null default '{}'::jsonb,
  add column if not exists module_config jsonb not null default '[]'::jsonb,
  add column if not exists last_run_at timestamptz,
  add column if not exists next_run_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.digest_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.user_digest_profiles(id) on delete cascade,
  source_type text not null,
  source_label text not null,
  source_ref text,
  settings jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digest_sources_settings_is_object check (jsonb_typeof(settings) = 'object')
);

alter table public.digest_sources
  add column if not exists source_ref text,
  add column if not exists settings jsonb not null default '{}'::jsonb,
  add column if not exists is_active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'digest_run_status'
      and n.nspname = 'public'
  ) then
    create type public.digest_run_status as enum ('queued', 'composing', 'sent', 'failed', 'skipped');
  end if;
end;
$$;

create table if not exists public.digest_runs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.user_digest_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.digest_run_status not null default 'queued',
  scheduled_for timestamptz not null,
  started_at timestamptz,
  completed_at timestamptz,
  subject_line text,
  preview_line text,
  render_payload jsonb not null default '{}'::jsonb,
  delivery_meta jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint digest_runs_render_payload_is_object check (jsonb_typeof(render_payload) = 'object'),
  constraint digest_runs_delivery_meta_is_object check (jsonb_typeof(delivery_meta) = 'object')
);

alter table public.digest_runs
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists subject_line text,
  add column if not exists preview_line text,
  add column if not exists render_payload jsonb not null default '{}'::jsonb,
  add column if not exists delivery_meta jsonb not null default '{}'::jsonb,
  add column if not exists error_message text,
  add column if not exists updated_at timestamptz not null default now();

-- Indexes
create index if not exists dashboard_views_user_id_idx on public.dashboard_views(user_id);
create index if not exists dashboard_views_user_default_idx on public.dashboard_views(user_id, is_default);
create index if not exists dashboard_widgets_view_position_idx on public.dashboard_widgets(dashboard_view_id, position);
create index if not exists dashboard_widgets_type_idx on public.dashboard_widgets(widget_type);

create index if not exists learning_topics_user_id_idx on public.learning_topics(user_id);
create index if not exists learning_briefs_user_created_idx on public.learning_briefs(user_id, created_at desc);
create index if not exists learning_briefs_topic_created_idx on public.learning_briefs(topic_id, created_at desc);

create index if not exists rituals_user_id_idx on public.rituals(user_id);
create index if not exists ritual_checkins_user_id_idx on public.ritual_checkins(user_id);
create index if not exists ritual_checkins_ritual_id_idx on public.ritual_checkins(ritual_id);

create index if not exists digest_templates_system_active_idx on public.digest_templates(is_system, is_active);
create index if not exists digest_templates_created_by_idx on public.digest_templates(created_by);
create index if not exists user_digest_profiles_user_status_idx on public.user_digest_profiles(user_id, status);
create unique index if not exists user_digest_profiles_user_title_unique on public.user_digest_profiles(user_id, title);
create index if not exists user_digest_profiles_next_run_idx on public.user_digest_profiles(next_run_at) where next_run_at is not null;
create index if not exists digest_sources_user_type_idx on public.digest_sources(user_id, source_type);
create index if not exists digest_sources_profile_idx on public.digest_sources(profile_id) where profile_id is not null;
create index if not exists digest_runs_profile_status_scheduled_idx on public.digest_runs(profile_id, status, scheduled_for desc);
create index if not exists digest_runs_user_scheduled_idx on public.digest_runs(user_id, scheduled_for desc);

-- updated_at triggers

drop trigger if exists dashboard_views_touch_updated_at on public.dashboard_views;
create trigger dashboard_views_touch_updated_at
before update on public.dashboard_views
for each row execute function public.touch_updated_at();

drop trigger if exists dashboard_widgets_touch_updated_at on public.dashboard_widgets;
create trigger dashboard_widgets_touch_updated_at
before update on public.dashboard_widgets
for each row execute function public.touch_updated_at();

drop trigger if exists digest_templates_touch_updated_at on public.digest_templates;
create trigger digest_templates_touch_updated_at
before update on public.digest_templates
for each row execute function public.touch_updated_at();

drop trigger if exists user_digest_profiles_touch_updated_at on public.user_digest_profiles;
create trigger user_digest_profiles_touch_updated_at
before update on public.user_digest_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists digest_sources_touch_updated_at on public.digest_sources;
create trigger digest_sources_touch_updated_at
before update on public.digest_sources
for each row execute function public.touch_updated_at();

drop trigger if exists digest_runs_touch_updated_at on public.digest_runs;
create trigger digest_runs_touch_updated_at
before update on public.digest_runs
for each row execute function public.touch_updated_at();

-- RLS enablement
alter table public.profiles enable row level security;
alter table public.dashboard_views enable row level security;
alter table public.dashboard_widgets enable row level security;
alter table public.learning_topics enable row level security;
alter table public.learning_briefs enable row level security;
alter table public.rituals enable row level security;
alter table public.ritual_checkins enable row level security;
alter table public.digest_templates enable row level security;
alter table public.user_digest_profiles enable row level security;
alter table public.digest_sources enable row level security;
alter table public.digest_runs enable row level security;

-- RLS policies (drop then create)

-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- dashboard views
drop policy if exists "Users can view own dashboard views" on public.dashboard_views;
create policy "Users can view own dashboard views"
on public.dashboard_views
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own dashboard views" on public.dashboard_views;
create policy "Users can insert own dashboard views"
on public.dashboard_views
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own dashboard views" on public.dashboard_views;
create policy "Users can update own dashboard views"
on public.dashboard_views
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own dashboard views" on public.dashboard_views;
create policy "Users can delete own dashboard views"
on public.dashboard_views
for delete
using (auth.uid() = user_id);

-- dashboard widgets (no self-recursive policy)
drop policy if exists "Users can view own dashboard widgets" on public.dashboard_widgets;
create policy "Users can view own dashboard widgets"
on public.dashboard_widgets
for select
using (
  exists (
    select 1
    from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id
      and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own dashboard widgets" on public.dashboard_widgets;
create policy "Users can insert own dashboard widgets"
on public.dashboard_widgets
for insert
with check (
  exists (
    select 1
    from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id
      and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own dashboard widgets" on public.dashboard_widgets;
create policy "Users can update own dashboard widgets"
on public.dashboard_widgets
for update
using (
  exists (
    select 1
    from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id
      and dv.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id
      and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own dashboard widgets" on public.dashboard_widgets;
create policy "Users can delete own dashboard widgets"
on public.dashboard_widgets
for delete
using (
  exists (
    select 1
    from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id
      and dv.user_id = auth.uid()
  )
);

-- learning topics
drop policy if exists "Users can view own learning topics" on public.learning_topics;
create policy "Users can view own learning topics"
on public.learning_topics
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own learning topics" on public.learning_topics;
create policy "Users can insert own learning topics"
on public.learning_topics
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own learning topics" on public.learning_topics;
create policy "Users can update own learning topics"
on public.learning_topics
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own learning topics" on public.learning_topics;
create policy "Users can delete own learning topics"
on public.learning_topics
for delete
using (auth.uid() = user_id);

-- learning briefs
drop policy if exists "Users can view own learning briefs" on public.learning_briefs;
create policy "Users can view own learning briefs"
on public.learning_briefs
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own learning briefs" on public.learning_briefs;
create policy "Users can insert own learning briefs"
on public.learning_briefs
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own learning briefs" on public.learning_briefs;
create policy "Users can update own learning briefs"
on public.learning_briefs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own learning briefs" on public.learning_briefs;
create policy "Users can delete own learning briefs"
on public.learning_briefs
for delete
using (auth.uid() = user_id);

-- rituals
drop policy if exists "Users can view own rituals" on public.rituals;
create policy "Users can view own rituals"
on public.rituals
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own rituals" on public.rituals;
create policy "Users can insert own rituals"
on public.rituals
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own rituals" on public.rituals;
create policy "Users can update own rituals"
on public.rituals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own rituals" on public.rituals;
create policy "Users can delete own rituals"
on public.rituals
for delete
using (auth.uid() = user_id);

-- ritual checkins
drop policy if exists "Users can view own ritual checkins" on public.ritual_checkins;
create policy "Users can view own ritual checkins"
on public.ritual_checkins
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own ritual checkins" on public.ritual_checkins;
create policy "Users can insert own ritual checkins"
on public.ritual_checkins
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own ritual checkins" on public.ritual_checkins;
create policy "Users can update own ritual checkins"
on public.ritual_checkins
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own ritual checkins" on public.ritual_checkins;
create policy "Users can delete own ritual checkins"
on public.ritual_checkins
for delete
using (auth.uid() = user_id);

-- digest templates
drop policy if exists "templates_readable_for_authenticated" on public.digest_templates;
create policy "templates_readable_for_authenticated"
on public.digest_templates
for select
to authenticated
using (is_system = true or created_by = auth.uid());

drop policy if exists "templates_creatable_by_owner_only" on public.digest_templates;
create policy "templates_creatable_by_owner_only"
on public.digest_templates
for insert
to authenticated
with check (created_by = auth.uid() and is_system = false);

drop policy if exists "templates_updatable_by_owner_only" on public.digest_templates;
create policy "templates_updatable_by_owner_only"
on public.digest_templates
for update
to authenticated
using (created_by = auth.uid() and is_system = false)
with check (created_by = auth.uid() and is_system = false);

drop policy if exists "templates_deletable_by_owner_only" on public.digest_templates;
create policy "templates_deletable_by_owner_only"
on public.digest_templates
for delete
to authenticated
using (created_by = auth.uid() and is_system = false);

-- user digest profiles
drop policy if exists "profiles_select_own" on public.user_digest_profiles;
create policy "profiles_select_own"
on public.user_digest_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "profiles_insert_own" on public.user_digest_profiles;
create policy "profiles_insert_own"
on public.user_digest_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.user_digest_profiles;
create policy "profiles_update_own"
on public.user_digest_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "profiles_delete_own" on public.user_digest_profiles;
create policy "profiles_delete_own"
on public.user_digest_profiles
for delete
to authenticated
using (user_id = auth.uid());

-- digest sources
drop policy if exists "sources_select_own" on public.digest_sources;
create policy "sources_select_own"
on public.digest_sources
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "sources_insert_own" on public.digest_sources;
create policy "sources_insert_own"
on public.digest_sources
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "sources_update_own" on public.digest_sources;
create policy "sources_update_own"
on public.digest_sources
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "sources_delete_own" on public.digest_sources;
create policy "sources_delete_own"
on public.digest_sources
for delete
to authenticated
using (user_id = auth.uid());

-- digest runs
drop policy if exists "runs_select_own" on public.digest_runs;
create policy "runs_select_own"
on public.digest_runs
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "runs_insert_own" on public.digest_runs;
create policy "runs_insert_own"
on public.digest_runs
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "runs_update_own" on public.digest_runs;
create policy "runs_update_own"
on public.digest_runs
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "runs_delete_own" on public.digest_runs;
create policy "runs_delete_own"
on public.digest_runs
for delete
to authenticated
using (user_id = auth.uid());
