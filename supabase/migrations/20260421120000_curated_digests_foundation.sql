-- Curated Digests foundation schema

create extension if not exists pgcrypto;

create type public.digest_run_status as enum (
  'queued',
  'composing',
  'sent',
  'failed',
  'skipped'
);

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
  constraint digest_templates_ritual_type_check
    check (ritual_type in ('ritual', 'brief', 'digest')),
  constraint digest_templates_modules_is_array
    check (jsonb_typeof(modules) = 'array'),
  constraint digest_templates_config_is_object
    check (jsonb_typeof(config) = 'object'),
  constraint digest_templates_sched_defaults_is_object
    check (jsonb_typeof(scheduling_defaults) = 'object')
);

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
  constraint user_digest_profiles_status_check
    check (status in ('active', 'paused', 'archived')),
  constraint user_digest_profiles_sched_is_object
    check (jsonb_typeof(scheduling_config) = 'object'),
  constraint user_digest_profiles_digest_is_object
    check (jsonb_typeof(digest_config) = 'object'),
  constraint user_digest_profiles_module_is_array
    check (jsonb_typeof(module_config) = 'array')
);

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
  constraint digest_sources_settings_is_object
    check (jsonb_typeof(settings) = 'object')
);

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
  constraint digest_runs_render_payload_is_object
    check (jsonb_typeof(render_payload) = 'object'),
  constraint digest_runs_delivery_meta_is_object
    check (jsonb_typeof(delivery_meta) = 'object')
);

create index if not exists digest_templates_system_active_idx
  on public.digest_templates (is_system, is_active);

create index if not exists digest_templates_created_by_idx
  on public.digest_templates (created_by);

create index if not exists user_digest_profiles_user_status_idx
  on public.user_digest_profiles (user_id, status);

create unique index if not exists user_digest_profiles_user_title_unique
  on public.user_digest_profiles (user_id, title);

create index if not exists user_digest_profiles_next_run_idx
  on public.user_digest_profiles (next_run_at)
  where next_run_at is not null;

create index if not exists digest_sources_user_type_idx
  on public.digest_sources (user_id, source_type);

create index if not exists digest_sources_profile_idx
  on public.digest_sources (profile_id)
  where profile_id is not null;

create index if not exists digest_runs_profile_status_scheduled_idx
  on public.digest_runs (profile_id, status, scheduled_for desc);

create index if not exists digest_runs_user_scheduled_idx
  on public.digest_runs (user_id, scheduled_for desc);

alter table public.digest_templates enable row level security;
alter table public.user_digest_profiles enable row level security;
alter table public.digest_sources enable row level security;
alter table public.digest_runs enable row level security;

create policy "templates_readable_for_authenticated"
  on public.digest_templates
  for select
  to authenticated
  using (is_system = true or created_by = auth.uid());

create policy "templates_creatable_by_owner_only"
  on public.digest_templates
  for insert
  to authenticated
  with check (created_by = auth.uid() and is_system = false);

create policy "templates_updatable_by_owner_only"
  on public.digest_templates
  for update
  to authenticated
  using (created_by = auth.uid() and is_system = false)
  with check (created_by = auth.uid() and is_system = false);

create policy "templates_deletable_by_owner_only"
  on public.digest_templates
  for delete
  to authenticated
  using (created_by = auth.uid() and is_system = false);

create policy "profiles_select_own"
  on public.user_digest_profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "profiles_insert_own"
  on public.user_digest_profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "profiles_update_own"
  on public.user_digest_profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "profiles_delete_own"
  on public.user_digest_profiles
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "sources_select_own"
  on public.digest_sources
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "sources_insert_own"
  on public.digest_sources
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "sources_update_own"
  on public.digest_sources
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "sources_delete_own"
  on public.digest_sources
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "runs_select_own"
  on public.digest_runs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "runs_insert_own"
  on public.digest_runs
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "runs_update_own"
  on public.digest_runs
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "runs_delete_own"
  on public.digest_runs
  for delete
  to authenticated
  using (user_id = auth.uid());
