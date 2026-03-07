create table if not exists public.date_is_right_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'finished')),
  current_round_index integer not null default 0,
  min_year integer not null,
  max_year integer not null,
  rounds jsonb not null default '[]'::jsonb,
  host_player_id uuid,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.date_is_right_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.date_is_right_rooms(id) on delete cascade,
  nickname text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.date_is_right_guesses (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.date_is_right_rooms(id) on delete cascade,
  player_id uuid not null references public.date_is_right_players(id) on delete cascade,
  round_index integer not null,
  guess_year integer not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (room_id, player_id, round_index)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'date_is_right_rooms_host_player_fk'
  ) then
    alter table public.date_is_right_rooms
      add constraint date_is_right_rooms_host_player_fk
      foreign key (host_player_id) references public.date_is_right_players(id) on delete set null;
  end if;
end $$;

create index if not exists date_is_right_rooms_code_idx on public.date_is_right_rooms(code);
create index if not exists date_is_right_players_room_idx on public.date_is_right_players(room_id, joined_at asc);
create index if not exists date_is_right_guesses_room_round_idx on public.date_is_right_guesses(room_id, round_index);

alter table public.date_is_right_rooms enable row level security;
alter table public.date_is_right_players enable row level security;
alter table public.date_is_right_guesses enable row level security;

drop policy if exists "Public can read date is right rooms" on public.date_is_right_rooms;
create policy "Public can read date is right rooms"
  on public.date_is_right_rooms
  for select
  using (true);

drop policy if exists "Public can read date is right players" on public.date_is_right_players;
create policy "Public can read date is right players"
  on public.date_is_right_players
  for select
  using (true);

drop policy if exists "Public can read date is right guesses" on public.date_is_right_guesses;
create policy "Public can read date is right guesses"
  on public.date_is_right_guesses
  for select
  using (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'date_is_right_rooms'
  ) then
    alter publication supabase_realtime add table public.date_is_right_rooms;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'date_is_right_players'
  ) then
    alter publication supabase_realtime add table public.date_is_right_players;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'date_is_right_guesses'
  ) then
    alter publication supabase_realtime add table public.date_is_right_guesses;
  end if;
end $$;
