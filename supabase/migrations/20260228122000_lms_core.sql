alter table public.microskills
  add column if not exists slug text,
  add column if not exists is_public boolean not null default true,
  add column if not exists current_version integer not null default 1,
  add column if not exists lessons jsonb not null default '{"versionTitle":null,"sections":[]}'::jsonb;

update public.microskills
set slug = coalesce(
  nullif(regexp_replace(lower(trim(both '/' from url)), '[^a-z0-9-]+', '-', 'g'), ''),
  regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')
)
where slug is null;

create unique index if not exists microskills_slug_key on public.microskills(slug);
create index if not exists microskills_is_public_idx on public.microskills(is_public, category_sort, skill_sort);

create table if not exists public.learner_progress (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  microskill_id bigint not null references public.microskills(id) on delete cascade,
  checkpoint_id text not null,
  completion_source text not null default 'manual',
  completed_at timestamptz not null default timezone('utc', now()),
  unique(user_id, microskill_id, checkpoint_id)
);

create index if not exists learner_progress_user_idx
  on public.learner_progress(user_id, microskill_id);

create table if not exists public.quiz_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  microskill_id bigint not null references public.microskills(id) on delete cascade,
  checkpoint_id text not null,
  score_percent integer not null,
  passed boolean not null,
  attempted_at timestamptz not null default timezone('utc', now())
);

create index if not exists quiz_attempts_user_idx
  on public.quiz_attempts(user_id, microskill_id, attempted_at desc);

create table if not exists public.certificates (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  email_normalized text not null,
  microskill_id bigint not null references public.microskills(id) on delete cascade,
  earned_version integer not null,
  earned_at timestamptz not null default timezone('utc', now()),
  unique(user_id, microskill_id, earned_version)
);

create index if not exists certificates_email_idx
  on public.certificates(email_normalized, microskill_id);

create table if not exists public.partner_api_keys (
  id bigserial primary key,
  label text not null,
  api_key_hash text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  last_used_at timestamptz null
);

create table if not exists public.partner_lookup_audit (
  id bigserial primary key,
  partner_api_key_id bigint null references public.partner_api_keys(id) on delete set null,
  email_normalized text not null,
  result_count integer not null default 0,
  requested_at timestamptz not null default timezone('utc', now())
);

alter table public.learner_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.partner_api_keys enable row level security;
alter table public.partner_lookup_audit enable row level security;

drop policy if exists "Authenticated users can read microskills" on public.microskills;
create policy "Public can read published microskills"
  on public.microskills
  for select
  to anon, authenticated
  using (is_public = true);

drop policy if exists "Users can read own learner_progress" on public.learner_progress;
create policy "Users can read own learner_progress"
  on public.learner_progress
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own learner_progress" on public.learner_progress;
create policy "Users can insert own learner_progress"
  on public.learner_progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own learner_progress" on public.learner_progress;
create policy "Users can update own learner_progress"
  on public.learner_progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own quiz_attempts" on public.quiz_attempts;
create policy "Users can read own quiz_attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own quiz_attempts" on public.quiz_attempts;
create policy "Users can insert own quiz_attempts"
  on public.quiz_attempts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own certificates" on public.certificates;
create policy "Users can read own certificates"
  on public.certificates
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "No client access partner_api_keys" on public.partner_api_keys;
create policy "No client access partner_api_keys"
  on public.partner_api_keys
  for all
  to authenticated
  using (false)
  with check (false);

drop policy if exists "No client access partner_lookup_audit" on public.partner_lookup_audit;
create policy "No client access partner_lookup_audit"
  on public.partner_lookup_audit
  for all
  to authenticated
  using (false)
  with check (false);
