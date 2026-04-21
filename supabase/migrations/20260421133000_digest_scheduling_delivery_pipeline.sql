-- Digest scheduling + delivery pipeline updates

alter type public.digest_run_status rename to digest_run_status_old;

create type public.digest_run_status as enum (
  'queued',
  'rendering',
  'sending',
  'sent',
  'failed'
);

alter table public.digest_runs
  alter column status drop default,
  alter column status type public.digest_run_status
  using (
    case
      when status::text = 'composing' then 'rendering'::public.digest_run_status
      when status::text = 'skipped' then 'failed'::public.digest_run_status
      else status::text::public.digest_run_status
    end
  ),
  alter column status set default 'queued';

drop type public.digest_run_status_old;

create unique index if not exists digest_runs_profile_scheduled_unique
  on public.digest_runs (profile_id, scheduled_for);
