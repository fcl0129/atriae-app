create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('clarity', 'plan', 'focus', 'decision')),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  structured_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.actions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  label text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on public.sessions(user_id);
create index if not exists messages_session_id_idx on public.messages(session_id);
create index if not exists actions_session_id_idx on public.actions(session_id);

alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.actions enable row level security;

drop trigger if exists sessions_touch_updated_at on public.sessions;
create trigger sessions_touch_updated_at
before update on public.sessions
for each row execute procedure public.touch_updated_at();

drop policy if exists "Users can view own sessions" on public.sessions;
create policy "Users can view own sessions"
on public.sessions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own sessions" on public.sessions;
create policy "Users can insert own sessions"
on public.sessions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own sessions" on public.sessions;
create policy "Users can update own sessions"
on public.sessions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own sessions" on public.sessions;
create policy "Users can delete own sessions"
on public.sessions
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view own messages" on public.messages;
create policy "Users can view own messages"
on public.messages
for select
using (
  exists (
    select 1 from public.sessions s
    where s.id = messages.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own messages" on public.messages;
create policy "Users can insert own messages"
on public.messages
for insert
with check (
  exists (
    select 1 from public.sessions s
    where s.id = messages.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own actions" on public.actions;
create policy "Users can view own actions"
on public.actions
for select
using (
  exists (
    select 1 from public.sessions s
    where s.id = actions.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own actions" on public.actions;
create policy "Users can insert own actions"
on public.actions
for insert
with check (
  exists (
    select 1 from public.sessions s
    where s.id = actions.session_id and s.user_id = auth.uid()
  )
);
