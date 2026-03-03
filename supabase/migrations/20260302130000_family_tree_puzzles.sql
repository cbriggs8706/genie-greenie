create table if not exists public.family_puzzles (
	id bigint generated always as identity primary key,
	title text not null,
	difficulty text not null check (difficulty in ('easy', 'intermediate', 'hard')),
	status text not null default 'draft' check (status in ('draft', 'published')),
	prefilled_slot_keys jsonb not null default '[]'::jsonb,
	created_by uuid null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists family_puzzles_status_idx on public.family_puzzles (status);
create index if not exists family_puzzles_difficulty_idx on public.family_puzzles (difficulty);

create table if not exists public.family_puzzle_people (
	id bigint generated always as identity primary key,
	puzzle_id bigint not null references public.family_puzzles (id) on delete cascade,
	person_code text not null,
	full_name text not null,
	gender text not null check (gender in ('female', 'male', 'nonbinary')),
	age int not null check (age between 1 and 120),
	generation int not null default 0,
	occupation text not null default '',
	hobby text not null default '',
	avatar_prompt text not null default '',
	avatar_url text not null default '',
	target_slot_key text not null,
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (puzzle_id, person_code)
);

create index if not exists family_puzzle_people_puzzle_id_idx on public.family_puzzle_people (puzzle_id, sort_order);

create table if not exists public.family_puzzle_relationships (
	id bigint generated always as identity primary key,
	puzzle_id bigint not null references public.family_puzzles (id) on delete cascade,
	from_person_code text not null,
	to_person_code text not null,
	relationship_type text not null check (relationship_type in ('spouse', 'divorced_spouse', 'parent', 'adoptive_parent', 'step_parent')),
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists family_puzzle_relationships_puzzle_id_idx on public.family_puzzle_relationships (puzzle_id, sort_order);

create table if not exists public.family_puzzle_clues (
	id bigint generated always as identity primary key,
	puzzle_id bigint not null references public.family_puzzles (id) on delete cascade,
	clue_text text not null,
	clue_band text not null check (clue_band in ('easy', 'intermediate', 'hard')),
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists family_puzzle_clues_puzzle_id_idx on public.family_puzzle_clues (puzzle_id, sort_order);

create table if not exists public.family_puzzle_slots (
	id bigint generated always as identity primary key,
	puzzle_id bigint not null references public.family_puzzles (id) on delete cascade,
	slot_key text not null,
	generation int not null default 0,
	x numeric(6, 2) not null,
	y numeric(6, 2) not null,
	is_locked boolean not null default false,
	label text null,
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (puzzle_id, slot_key)
);

create index if not exists family_puzzle_slots_puzzle_id_idx on public.family_puzzle_slots (puzzle_id, sort_order);

create table if not exists public.family_puzzle_slot_links (
	id bigint generated always as identity primary key,
	puzzle_id bigint not null references public.family_puzzles (id) on delete cascade,
	from_slot_key text not null,
	to_slot_key text not null,
	link_type text not null check (link_type in ('spouse', 'parent_child')),
	sort_order int not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists family_puzzle_slot_links_puzzle_id_idx on public.family_puzzle_slot_links (puzzle_id, sort_order);
