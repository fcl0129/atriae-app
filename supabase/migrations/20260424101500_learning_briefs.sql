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

create index if not exists learning_briefs_user_created_idx on public.learning_briefs(user_id, created_at desc);
create index if not exists learning_briefs_topic_created_idx on public.learning_briefs(topic_id, created_at desc);

alter table public.learning_briefs enable row level security;

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
