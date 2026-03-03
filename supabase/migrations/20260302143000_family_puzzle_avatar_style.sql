alter table public.family_puzzles
	add column if not exists avatar_style_preset text not null default 'classic_cartoon'
	check (avatar_style_preset in ('classic_cartoon', 'storybook', 'bold_comic', 'soft_painterly'));
