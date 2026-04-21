-- Atriae core data foundation: profiles extension, learning, rituals, and check-ins.

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists morning_ritual_reminder text;

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

create table if not exists public.rituals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  cadence text,
  prompt text,
  created_at timestamptz not null default now()
);

create table if not exists public.ritual_checkins (
  id uuid primary key default gen_random_uuid(),
  ritual_id uuid not null references public.rituals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now()
);

alter table public.learning_topics enable row level security;
alter table public.rituals enable row level security;
alter table public.ritual_checkins enable row level security;

-- Profiles policies
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Learning topics policies
create policy "Users can view own learning topics"
on public.learning_topics
for select
using (auth.uid() = user_id);

create policy "Users can insert own learning topics"
on public.learning_topics
for insert
with check (auth.uid() = user_id);

create policy "Users can update own learning topics"
on public.learning_topics
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own learning topics"
on public.learning_topics
for delete
using (auth.uid() = user_id);

-- Ritual policies
create policy "Users can view own rituals"
on public.rituals
for select
using (auth.uid() = user_id);

create policy "Users can insert own rituals"
on public.rituals
for insert
with check (auth.uid() = user_id);

create policy "Users can update own rituals"
on public.rituals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own rituals"
on public.rituals
for delete
using (auth.uid() = user_id);

-- Ritual checkins policies
create policy "Users can view own ritual checkins"
on public.ritual_checkins
for select
using (auth.uid() = user_id);

create policy "Users can insert own ritual checkins"
on public.ritual_checkins
for insert
with check (auth.uid() = user_id);

create policy "Users can update own ritual checkins"
on public.ritual_checkins
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own ritual checkins"
on public.ritual_checkins
for delete
using (auth.uid() = user_id);
