create table if not exists public.ancestor_feud_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'finished')),
  current_round_index integer not null default 0,
  rounds jsonb not null default '[]'::jsonb,
  host_player_id uuid,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.ancestor_feud_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.ancestor_feud_rooms(id) on delete cascade,
  nickname text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.ancestor_feud_guesses (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.ancestor_feud_rooms(id) on delete cascade,
  player_id uuid not null references public.ancestor_feud_players(id) on delete cascade,
  round_index integer not null,
  guess_text text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (room_id, player_id, round_index)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ancestor_feud_rooms_host_player_fk'
  ) then
    alter table public.ancestor_feud_rooms
      add constraint ancestor_feud_rooms_host_player_fk
      foreign key (host_player_id) references public.ancestor_feud_players(id) on delete set null;
  end if;
end $$;

create index if not exists ancestor_feud_rooms_code_idx on public.ancestor_feud_rooms(code);
create index if not exists ancestor_feud_players_room_idx on public.ancestor_feud_players(room_id, joined_at asc);
create index if not exists ancestor_feud_guesses_room_round_idx on public.ancestor_feud_guesses(room_id, round_index);

alter table public.ancestor_feud_rooms enable row level security;
alter table public.ancestor_feud_players enable row level security;
alter table public.ancestor_feud_guesses enable row level security;

drop policy if exists "Public can read ancestor feud rooms" on public.ancestor_feud_rooms;
create policy "Public can read ancestor feud rooms"
  on public.ancestor_feud_rooms
  for select
  using (true);

drop policy if exists "Public can read ancestor feud players" on public.ancestor_feud_players;
create policy "Public can read ancestor feud players"
  on public.ancestor_feud_players
  for select
  using (true);

drop policy if exists "Public can read ancestor feud guesses" on public.ancestor_feud_guesses;
create policy "Public can read ancestor feud guesses"
  on public.ancestor_feud_guesses
  for select
  using (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ancestor_feud_rooms'
  ) then
    alter publication supabase_realtime add table public.ancestor_feud_rooms;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ancestor_feud_players'
  ) then
    alter publication supabase_realtime add table public.ancestor_feud_players;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ancestor_feud_guesses'
  ) then
    alter publication supabase_realtime add table public.ancestor_feud_guesses;
  end if;
end $$;
