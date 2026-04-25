-- Auth/session + policy repair migration.
-- Idempotent reconciliation for Atriae core tables.

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

alter table if exists public.profiles
  add column if not exists display_name text,
  add column if not exists morning_ritual_reminder text;

create index if not exists learning_topics_user_id_idx on public.learning_topics(user_id);
create index if not exists rituals_user_id_idx on public.rituals(user_id);
create index if not exists ritual_checkins_user_id_idx on public.ritual_checkins(user_id);
create index if not exists sessions_user_created_idx on public.sessions(user_id, created_at desc);
create index if not exists messages_session_created_idx on public.messages(session_id, created_at asc);
create index if not exists actions_session_created_idx on public.actions(session_id, created_at asc);

alter table if exists public.profiles enable row level security;
alter table if exists public.learning_topics enable row level security;
alter table if exists public.learning_briefs enable row level security;
alter table if exists public.rituals enable row level security;
alter table if exists public.ritual_checkins enable row level security;
alter table if exists public.dashboard_views enable row level security;
alter table if exists public.dashboard_widgets enable row level security;
alter table if exists public.sessions enable row level security;
alter table if exists public.messages enable row level security;
alter table if exists public.actions enable row level security;

do $$
begin
  -- profiles
  drop policy if exists "Users can view own profile" on public.profiles;
  drop policy if exists "Users can update own profile" on public.profiles;
  drop policy if exists "Users can insert own profile" on public.profiles;

  create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);
  create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);
  create policy "Users can insert own profile" on public.profiles
    for insert with check (auth.uid() = id);

  -- learning topics
  if to_regclass('public.learning_topics') is not null then
    drop policy if exists "Users can view own learning topics" on public.learning_topics;
    drop policy if exists "Users can insert own learning topics" on public.learning_topics;
    drop policy if exists "Users can update own learning topics" on public.learning_topics;
    drop policy if exists "Users can delete own learning topics" on public.learning_topics;

    create policy "Users can view own learning topics" on public.learning_topics
      for select using (auth.uid() = user_id);
    create policy "Users can insert own learning topics" on public.learning_topics
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own learning topics" on public.learning_topics
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own learning topics" on public.learning_topics
      for delete using (auth.uid() = user_id);
  end if;

  -- learning briefs
  if to_regclass('public.learning_briefs') is not null then
    drop policy if exists "Users can view own learning briefs" on public.learning_briefs;
    drop policy if exists "Users can insert own learning briefs" on public.learning_briefs;
    drop policy if exists "Users can update own learning briefs" on public.learning_briefs;
    drop policy if exists "Users can delete own learning briefs" on public.learning_briefs;

    create policy "Users can view own learning briefs" on public.learning_briefs
      for select using (auth.uid() = user_id);
    create policy "Users can insert own learning briefs" on public.learning_briefs
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own learning briefs" on public.learning_briefs
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own learning briefs" on public.learning_briefs
      for delete using (auth.uid() = user_id);
  end if;

  -- rituals/checkins
  if to_regclass('public.rituals') is not null then
    drop policy if exists "Users can view own rituals" on public.rituals;
    drop policy if exists "Users can insert own rituals" on public.rituals;
    drop policy if exists "Users can update own rituals" on public.rituals;
    drop policy if exists "Users can delete own rituals" on public.rituals;

    create policy "Users can view own rituals" on public.rituals
      for select using (auth.uid() = user_id);
    create policy "Users can insert own rituals" on public.rituals
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own rituals" on public.rituals
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own rituals" on public.rituals
      for delete using (auth.uid() = user_id);
  end if;

  if to_regclass('public.ritual_checkins') is not null then
    drop policy if exists "Users can view own ritual checkins" on public.ritual_checkins;
    drop policy if exists "Users can insert own ritual checkins" on public.ritual_checkins;
    drop policy if exists "Users can update own ritual checkins" on public.ritual_checkins;
    drop policy if exists "Users can delete own ritual checkins" on public.ritual_checkins;

    create policy "Users can view own ritual checkins" on public.ritual_checkins
      for select using (auth.uid() = user_id);
    create policy "Users can insert own ritual checkins" on public.ritual_checkins
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own ritual checkins" on public.ritual_checkins
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own ritual checkins" on public.ritual_checkins
      for delete using (auth.uid() = user_id);
  end if;

  -- dashboard
  if to_regclass('public.dashboard_views') is not null then
    drop policy if exists "Users can view own dashboard views" on public.dashboard_views;
    drop policy if exists "Users can insert own dashboard views" on public.dashboard_views;
    drop policy if exists "Users can update own dashboard views" on public.dashboard_views;
    drop policy if exists "Users can delete own dashboard views" on public.dashboard_views;

    create policy "Users can view own dashboard views" on public.dashboard_views
      for select using (auth.uid() = user_id);
    create policy "Users can insert own dashboard views" on public.dashboard_views
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own dashboard views" on public.dashboard_views
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own dashboard views" on public.dashboard_views
      for delete using (auth.uid() = user_id);
  end if;

  if to_regclass('public.dashboard_widgets') is not null then
    drop policy if exists "Users can view own dashboard widgets" on public.dashboard_widgets;
    drop policy if exists "Users can insert own dashboard widgets" on public.dashboard_widgets;
    drop policy if exists "Users can update own dashboard widgets" on public.dashboard_widgets;
    drop policy if exists "Users can delete own dashboard widgets" on public.dashboard_widgets;

    create policy "Users can view own dashboard widgets" on public.dashboard_widgets
      for select using (
        exists (
          select 1
          from public.dashboard_views dv
          where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
        )
      );

    create policy "Users can insert own dashboard widgets" on public.dashboard_widgets
      for insert with check (
        exists (
          select 1
          from public.dashboard_views dv
          where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
        )
      );

    create policy "Users can update own dashboard widgets" on public.dashboard_widgets
      for update using (
        exists (
          select 1
          from public.dashboard_views dv
          where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
        )
      ) with check (
        exists (
          select 1
          from public.dashboard_views dv
          where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
        )
      );

    create policy "Users can delete own dashboard widgets" on public.dashboard_widgets
      for delete using (
        exists (
          select 1
          from public.dashboard_views dv
          where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
        )
      );
  end if;

  -- sessions/messages/actions
  if to_regclass('public.sessions') is not null then
    drop policy if exists "Users can view own sessions" on public.sessions;
    drop policy if exists "Users can insert own sessions" on public.sessions;
    drop policy if exists "Users can update own sessions" on public.sessions;
    drop policy if exists "Users can delete own sessions" on public.sessions;

    create policy "Users can view own sessions" on public.sessions
      for select using (auth.uid() = user_id);
    create policy "Users can insert own sessions" on public.sessions
      for insert with check (auth.uid() = user_id);
    create policy "Users can update own sessions" on public.sessions
      for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
    create policy "Users can delete own sessions" on public.sessions
      for delete using (auth.uid() = user_id);
  end if;

  if to_regclass('public.messages') is not null then
    drop policy if exists "Users can view own messages" on public.messages;
    drop policy if exists "Users can insert own messages" on public.messages;

    create policy "Users can view own messages" on public.messages
      for select using (
        exists (
          select 1
          from public.sessions s
          where s.id = messages.session_id and s.user_id = auth.uid()
        )
      );
    create policy "Users can insert own messages" on public.messages
      for insert with check (
        exists (
          select 1
          from public.sessions s
          where s.id = messages.session_id and s.user_id = auth.uid()
        )
      );
  end if;

  if to_regclass('public.actions') is not null then
    drop policy if exists "Users can view own actions" on public.actions;
    drop policy if exists "Users can insert own actions" on public.actions;

    create policy "Users can view own actions" on public.actions
      for select using (
        exists (
          select 1
          from public.sessions s
          where s.id = actions.session_id and s.user_id = auth.uid()
        )
      );
    create policy "Users can insert own actions" on public.actions
      for insert with check (
        exists (
          select 1
          from public.sessions s
          where s.id = actions.session_id and s.user_id = auth.uid()
        )
      );
  end if;
end;
$$;
