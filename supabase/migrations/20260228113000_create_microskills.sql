create table if not exists public.microskills (
  id bigserial primary key,
  category text not null,
  category_sort integer not null,
  name text not null,
  skill_level text not null,
  description text not null,
  url text not null default '',
  "time" text[] null,
  skill_sort integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists microskills_category_name_key
  on public.microskills(category, name);

create index if not exists microskills_category_sort_idx
  on public.microskills(category_sort, skill_sort);

alter table public.microskills enable row level security;

drop policy if exists "Authenticated users can read microskills" on public.microskills;
create policy "Authenticated users can read microskills"
  on public.microskills
  for select
  to authenticated
  using (true);
