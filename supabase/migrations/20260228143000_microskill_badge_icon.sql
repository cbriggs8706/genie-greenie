alter table public.microskills
  add column if not exists badge_icon text not null default 'award';

update public.microskills
set badge_icon = 'award'
where badge_icon is null or length(trim(badge_icon)) = 0;
