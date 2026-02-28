create table if not exists public.microskill_categories (
  id bigserial primary key,
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.microskill_categories(name, sort_order)
select category, min(category_sort)
from public.microskills
where trim(category) <> ''
group by category
on conflict (name) do nothing;
