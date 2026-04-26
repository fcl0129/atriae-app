-- Production schema stability repair for Atriae.
-- Non-destructive and idempotent: creates missing tables, adds missing columns,
-- and refreshes RLS policies for user-owned access patterns.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
for each row execute function public.handle_new_user();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  display_name text,
  morning_ritual_reminder text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists display_name text,
  add column if not exists morning_ritual_reminder text,
  add column if not exists created_at timestamptz not null default now();

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
  add column if not exists created_at timestamptz not null default now(),
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
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

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
  add column if not exists progress integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

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
  add column if not exists next_steps jsonb not null default '[]'::jsonb,
  add column if not exists created_at timestamptz not null default now();

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
  add column if not exists prompt text,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.ritual_checkins (
  id uuid primary key default gen_random_uuid(),
  ritual_id uuid not null references public.rituals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now()
);

alter table public.ritual_checkins
  add column if not exists completed_at timestamptz not null default now();

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sessions
  add column if not exists mode text not null default 'clarity',
  add column if not exists title text not null default 'Atriae Session',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.sessions
  alter column mode drop default,
  alter column title drop default;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  role text not null,
  content text not null,
  structured_payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.messages
  add column if not exists role text not null default 'user',
  add column if not exists content text not null default '',
  add column if not exists structured_payload jsonb,
  add column if not exists created_at timestamptz not null default now();

alter table public.messages
  alter column role drop default,
  alter column content drop default;

create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.actions
  add column if not exists completed boolean not null default false,
  add column if not exists created_at timestamptz not null default now();

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

alter type public.digest_run_status add value if not exists 'rendering';
alter type public.digest_run_status add value if not exists 'sending';

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
  updated_at timestamptz not null default now()
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
  add column if not exists created_at timestamptz not null default now(),
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
  updated_at timestamptz not null default now()
);

alter table public.user_digest_profiles
  add column if not exists status text not null default 'active',
  add column if not exists timezone text not null default 'UTC',
  add column if not exists scheduling_config jsonb not null default '{}'::jsonb,
  add column if not exists digest_config jsonb not null default '{}'::jsonb,
  add column if not exists module_config jsonb not null default '[]'::jsonb,
  add column if not exists last_run_at timestamptz,
  add column if not exists next_run_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
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
  updated_at timestamptz not null default now()
);

alter table public.digest_sources
  add column if not exists source_ref text,
  add column if not exists settings jsonb not null default '{}'::jsonb,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

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
  updated_at timestamptz not null default now()
);

alter table public.digest_runs
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists subject_line text,
  add column if not exists preview_line text,
  add column if not exists render_payload jsonb not null default '{}'::jsonb,
  add column if not exists delivery_meta jsonb not null default '{}'::jsonb,
  add column if not exists error_message text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists dashboard_views_user_id_idx on public.dashboard_views(user_id);
create index if not exists dashboard_widgets_view_position_idx on public.dashboard_widgets(dashboard_view_id, position);
create index if not exists learning_topics_user_id_idx on public.learning_topics(user_id);
create index if not exists rituals_user_id_idx on public.rituals(user_id);
create index if not exists ritual_checkins_user_id_idx on public.ritual_checkins(user_id);
create index if not exists sessions_user_created_idx on public.sessions(user_id, created_at desc);
create index if not exists messages_session_created_idx on public.messages(session_id, created_at asc);
create index if not exists actions_session_created_idx on public.actions(session_id, created_at asc);
create index if not exists digest_sources_user_type_idx on public.digest_sources(user_id, source_type);
create index if not exists digest_runs_user_scheduled_idx on public.digest_runs(user_id, scheduled_for desc);

alter table public.profiles enable row level security;
alter table public.dashboard_views enable row level security;
alter table public.dashboard_widgets enable row level security;
alter table public.learning_topics enable row level security;
alter table public.learning_briefs enable row level security;
alter table public.rituals enable row level security;
alter table public.ritual_checkins enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.actions enable row level security;
alter table public.digest_templates enable row level security;
alter table public.user_digest_profiles enable row level security;
alter table public.digest_sources enable row level security;
alter table public.digest_runs enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can view own dashboard views" on public.dashboard_views;
create policy "Users can view own dashboard views" on public.dashboard_views for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own dashboard views" on public.dashboard_views;
create policy "Users can insert own dashboard views" on public.dashboard_views for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own dashboard views" on public.dashboard_views;
create policy "Users can update own dashboard views" on public.dashboard_views for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own dashboard views" on public.dashboard_views;
create policy "Users can delete own dashboard views" on public.dashboard_views for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own dashboard widgets" on public.dashboard_widgets;
create policy "Users can view own dashboard widgets" on public.dashboard_widgets
for select using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);
drop policy if exists "Users can insert own dashboard widgets" on public.dashboard_widgets;
create policy "Users can insert own dashboard widgets" on public.dashboard_widgets
for insert with check (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);
drop policy if exists "Users can update own dashboard widgets" on public.dashboard_widgets;
create policy "Users can update own dashboard widgets" on public.dashboard_widgets
for update using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);
drop policy if exists "Users can delete own dashboard widgets" on public.dashboard_widgets;
create policy "Users can delete own dashboard widgets" on public.dashboard_widgets
for delete using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own learning topics" on public.learning_topics;
create policy "Users can view own learning topics" on public.learning_topics for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own learning topics" on public.learning_topics;
create policy "Users can insert own learning topics" on public.learning_topics for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own learning topics" on public.learning_topics;
create policy "Users can update own learning topics" on public.learning_topics for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own learning topics" on public.learning_topics;
create policy "Users can delete own learning topics" on public.learning_topics for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own learning briefs" on public.learning_briefs;
create policy "Users can view own learning briefs" on public.learning_briefs for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own learning briefs" on public.learning_briefs;
create policy "Users can insert own learning briefs" on public.learning_briefs for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own learning briefs" on public.learning_briefs;
create policy "Users can update own learning briefs" on public.learning_briefs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own learning briefs" on public.learning_briefs;
create policy "Users can delete own learning briefs" on public.learning_briefs for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own rituals" on public.rituals;
create policy "Users can view own rituals" on public.rituals for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own rituals" on public.rituals;
create policy "Users can insert own rituals" on public.rituals for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own rituals" on public.rituals;
create policy "Users can update own rituals" on public.rituals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own rituals" on public.rituals;
create policy "Users can delete own rituals" on public.rituals for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own ritual checkins" on public.ritual_checkins;
create policy "Users can view own ritual checkins" on public.ritual_checkins for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own ritual checkins" on public.ritual_checkins;
create policy "Users can insert own ritual checkins" on public.ritual_checkins for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own ritual checkins" on public.ritual_checkins;
create policy "Users can update own ritual checkins" on public.ritual_checkins for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own ritual checkins" on public.ritual_checkins;
create policy "Users can delete own ritual checkins" on public.ritual_checkins for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own sessions" on public.sessions;
create policy "Users can view own sessions" on public.sessions for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own sessions" on public.sessions;
create policy "Users can insert own sessions" on public.sessions for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own sessions" on public.sessions;
create policy "Users can update own sessions" on public.sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own sessions" on public.sessions;
create policy "Users can delete own sessions" on public.sessions for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own messages" on public.messages;
create policy "Users can view own messages" on public.messages
for select using (
  exists (
    select 1 from public.sessions s
    where s.id = messages.session_id and s.user_id = auth.uid()
  )
);
drop policy if exists "Users can insert own messages" on public.messages;
create policy "Users can insert own messages" on public.messages
for insert with check (
  exists (
    select 1 from public.sessions s
    where s.id = messages.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own actions" on public.actions;
create policy "Users can view own actions" on public.actions
for select using (
  exists (
    select 1 from public.sessions s
    where s.id = actions.session_id and s.user_id = auth.uid()
  )
);
drop policy if exists "Users can insert own actions" on public.actions;
create policy "Users can insert own actions" on public.actions
for insert with check (
  exists (
    select 1 from public.sessions s
    where s.id = actions.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "templates_readable_for_authenticated" on public.digest_templates;
create policy "templates_readable_for_authenticated" on public.digest_templates
for select to authenticated using (is_system = true or created_by = auth.uid());
drop policy if exists "templates_creatable_by_owner_only" on public.digest_templates;
create policy "templates_creatable_by_owner_only" on public.digest_templates
for insert to authenticated with check (created_by = auth.uid() and is_system = false);
drop policy if exists "templates_updatable_by_owner_only" on public.digest_templates;
create policy "templates_updatable_by_owner_only" on public.digest_templates
for update to authenticated using (created_by = auth.uid() and is_system = false)
with check (created_by = auth.uid() and is_system = false);
drop policy if exists "templates_deletable_by_owner_only" on public.digest_templates;
create policy "templates_deletable_by_owner_only" on public.digest_templates
for delete to authenticated using (created_by = auth.uid() and is_system = false);

drop policy if exists "profiles_select_own" on public.user_digest_profiles;
create policy "profiles_select_own" on public.user_digest_profiles
for select to authenticated using (user_id = auth.uid());
drop policy if exists "profiles_insert_own" on public.user_digest_profiles;
create policy "profiles_insert_own" on public.user_digest_profiles
for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "profiles_update_own" on public.user_digest_profiles;
create policy "profiles_update_own" on public.user_digest_profiles
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "profiles_delete_own" on public.user_digest_profiles;
create policy "profiles_delete_own" on public.user_digest_profiles
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "sources_select_own" on public.digest_sources;
create policy "sources_select_own" on public.digest_sources
for select to authenticated using (user_id = auth.uid());
drop policy if exists "sources_insert_own" on public.digest_sources;
create policy "sources_insert_own" on public.digest_sources
for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "sources_update_own" on public.digest_sources;
create policy "sources_update_own" on public.digest_sources
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "sources_delete_own" on public.digest_sources;
create policy "sources_delete_own" on public.digest_sources
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "runs_select_own" on public.digest_runs;
create policy "runs_select_own" on public.digest_runs
for select to authenticated using (user_id = auth.uid());
drop policy if exists "runs_insert_own" on public.digest_runs;
create policy "runs_insert_own" on public.digest_runs
for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "runs_update_own" on public.digest_runs;
create policy "runs_update_own" on public.digest_runs
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "runs_delete_own" on public.digest_runs;
create policy "runs_delete_own" on public.digest_runs
for delete to authenticated using (user_id = auth.uid());

drop trigger if exists sessions_touch_updated_at on public.sessions;
create trigger sessions_touch_updated_at before update on public.sessions
for each row execute function public.touch_updated_at();

drop trigger if exists dashboard_views_touch_updated_at on public.dashboard_views;
create trigger dashboard_views_touch_updated_at before update on public.dashboard_views
for each row execute function public.touch_updated_at();

drop trigger if exists dashboard_widgets_touch_updated_at on public.dashboard_widgets;
create trigger dashboard_widgets_touch_updated_at before update on public.dashboard_widgets
for each row execute function public.touch_updated_at();

drop trigger if exists digest_templates_touch_updated_at on public.digest_templates;
create trigger digest_templates_touch_updated_at before update on public.digest_templates
for each row execute function public.touch_updated_at();

drop trigger if exists user_digest_profiles_touch_updated_at on public.user_digest_profiles;
create trigger user_digest_profiles_touch_updated_at before update on public.user_digest_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists digest_sources_touch_updated_at on public.digest_sources;
create trigger digest_sources_touch_updated_at before update on public.digest_sources
for each row execute function public.touch_updated_at();

drop trigger if exists digest_runs_touch_updated_at on public.digest_runs;
create trigger digest_runs_touch_updated_at before update on public.digest_runs
for each row execute function public.touch_updated_at();
