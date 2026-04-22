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

create index if not exists dashboard_views_user_id_idx on public.dashboard_views(user_id);
create index if not exists dashboard_views_user_default_idx on public.dashboard_views(user_id, is_default);
create index if not exists dashboard_widgets_view_position_idx on public.dashboard_widgets(dashboard_view_id, position);
create index if not exists dashboard_widgets_type_idx on public.dashboard_widgets(widget_type);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dashboard_views_touch_updated_at on public.dashboard_views;
create trigger dashboard_views_touch_updated_at
before update on public.dashboard_views
for each row execute procedure public.touch_updated_at();

drop trigger if exists dashboard_widgets_touch_updated_at on public.dashboard_widgets;
create trigger dashboard_widgets_touch_updated_at
before update on public.dashboard_widgets
for each row execute procedure public.touch_updated_at();

alter table public.dashboard_views enable row level security;
alter table public.dashboard_widgets enable row level security;

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

drop policy if exists "Users can view own dashboard widgets" on public.dashboard_widgets;
create policy "Users can view own dashboard widgets"
on public.dashboard_widgets
for select
using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own dashboard widgets" on public.dashboard_widgets;
create policy "Users can insert own dashboard widgets"
on public.dashboard_widgets
for insert
with check (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own dashboard widgets" on public.dashboard_widgets;
create policy "Users can update own dashboard widgets"
on public.dashboard_widgets
for update
using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own dashboard widgets" on public.dashboard_widgets;
create policy "Users can delete own dashboard widgets"
on public.dashboard_widgets
for delete
using (
  exists (
    select 1 from public.dashboard_views dv
    where dv.id = dashboard_widgets.dashboard_view_id and dv.user_id = auth.uid()
  )
);
