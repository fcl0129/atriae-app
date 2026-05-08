create table if not exists public.memory_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('manual_note','voice_note','meeting','email','calendar','import')),
  title text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.memory_sources add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.memory_sources add column if not exists source_type text;
alter table public.memory_sources add column if not exists title text;
alter table public.memory_sources add column if not exists occurred_at timestamptz not null default now();
alter table public.memory_sources add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.memory_sources add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'memory_sources_source_type_check') then
    alter table public.memory_sources add constraint memory_sources_source_type_check
      check (source_type in ('manual_note','voice_note','meeting','email','calendar','import'));
  end if;
end $$;

create table if not exists public.memory_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid references public.memory_sources(id) on delete set null,
  block_type text not null check (block_type in ('summary','decision','task','person','meeting','idea','question','follow_up','reference')),
  title text not null,
  summary text not null,
  content text,
  importance integer not null default 2 check (importance between 1 and 5),
  tags text[] not null default '{}'::text[],
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.memory_blocks add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.memory_blocks add column if not exists source_id uuid references public.memory_sources(id) on delete set null;
alter table public.memory_blocks add column if not exists block_type text;
alter table public.memory_blocks add column if not exists title text;
alter table public.memory_blocks add column if not exists summary text;
alter table public.memory_blocks add column if not exists content text;
alter table public.memory_blocks add column if not exists importance integer not null default 2;
alter table public.memory_blocks add column if not exists tags text[] not null default '{}'::text[];
alter table public.memory_blocks add column if not exists occurred_at timestamptz not null default now();
alter table public.memory_blocks add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'memory_blocks_block_type_check') then
    alter table public.memory_blocks add constraint memory_blocks_block_type_check
      check (block_type in ('summary','decision','task','person','meeting','idea','question','follow_up','reference'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'memory_blocks_importance_check') then
    alter table public.memory_blocks add constraint memory_blocks_importance_check
      check (importance between 1 and 5);
  end if;
end $$;

create table if not exists public.memory_daily_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  summary_date date not null,
  title text not null,
  narrative text not null,
  decisions jsonb not null default '[]'::jsonb,
  open_loops jsonb not null default '[]'::jsonb,
  people jsonb not null default '[]'::jsonb,
  follow_ups jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, summary_date)
);

alter table public.memory_daily_summaries add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.memory_daily_summaries add column if not exists summary_date date;
alter table public.memory_daily_summaries add column if not exists title text;
alter table public.memory_daily_summaries add column if not exists narrative text;
alter table public.memory_daily_summaries add column if not exists decisions jsonb not null default '[]'::jsonb;
alter table public.memory_daily_summaries add column if not exists open_loops jsonb not null default '[]'::jsonb;
alter table public.memory_daily_summaries add column if not exists people jsonb not null default '[]'::jsonb;
alter table public.memory_daily_summaries add column if not exists follow_ups jsonb not null default '[]'::jsonb;
alter table public.memory_daily_summaries add column if not exists created_at timestamptz not null default now();
alter table public.memory_daily_summaries add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'memory_daily_summaries_user_id_summary_date_key') then
    alter table public.memory_daily_summaries add constraint memory_daily_summaries_user_id_summary_date_key unique (user_id, summary_date);
  end if;
end $$;

create index if not exists memory_sources_user_occurred_idx on public.memory_sources(user_id, occurred_at desc);
create index if not exists memory_sources_user_created_idx on public.memory_sources(user_id, created_at desc);
create index if not exists memory_blocks_user_occurred_idx on public.memory_blocks(user_id, occurred_at desc);
create index if not exists memory_blocks_user_type_idx on public.memory_blocks(user_id, block_type, occurred_at desc);
create index if not exists memory_blocks_source_idx on public.memory_blocks(source_id);
create index if not exists memory_blocks_tags_idx on public.memory_blocks using gin(tags);
create index if not exists memory_daily_summaries_user_date_idx on public.memory_daily_summaries(user_id, summary_date desc);

alter table public.memory_sources enable row level security;
alter table public.memory_blocks enable row level security;
alter table public.memory_daily_summaries enable row level security;

drop policy if exists "Users can view own memory sources" on public.memory_sources;
create policy "Users can view own memory sources" on public.memory_sources for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own memory sources" on public.memory_sources;
create policy "Users can insert own memory sources" on public.memory_sources for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own memory sources" on public.memory_sources;
create policy "Users can update own memory sources" on public.memory_sources for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own memory sources" on public.memory_sources;
create policy "Users can delete own memory sources" on public.memory_sources for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own memory blocks" on public.memory_blocks;
create policy "Users can view own memory blocks" on public.memory_blocks for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own memory blocks" on public.memory_blocks;
create policy "Users can insert own memory blocks" on public.memory_blocks for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own memory blocks" on public.memory_blocks;
create policy "Users can update own memory blocks" on public.memory_blocks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own memory blocks" on public.memory_blocks;
create policy "Users can delete own memory blocks" on public.memory_blocks for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own daily memory summaries" on public.memory_daily_summaries;
create policy "Users can view own daily memory summaries" on public.memory_daily_summaries for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own daily memory summaries" on public.memory_daily_summaries;
create policy "Users can insert own daily memory summaries" on public.memory_daily_summaries for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own daily memory summaries" on public.memory_daily_summaries;
create policy "Users can update own daily memory summaries" on public.memory_daily_summaries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own daily memory summaries" on public.memory_daily_summaries;
create policy "Users can delete own daily memory summaries" on public.memory_daily_summaries for delete using (auth.uid() = user_id);
