import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { AVATAR_STYLE_PRESETS, generateAvatarWithAI } from '@/lib/family-puzzles/avatar'
import { getFamilyPuzzleById, saveFamilyPuzzle } from '@/lib/family-puzzles/store'
import type { AvatarStylePreset } from '@/lib/family-puzzles/types'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user || !isAdminUser(user)) {
		return null
	}
	return user
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id: idValue } = await params
	const id = Number(idValue)
	if (!Number.isFinite(id)) {
		return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
	}

	const puzzle = await getFamilyPuzzleById(id)
	if (!puzzle) {
		return NextResponse.json({ error: 'Puzzle not found.' }, { status: 404 })
	}
	const body = (await request.json().catch(() => null)) as
		| { avatarStylePreset?: AvatarStylePreset }
		| null
	const avatarStylePreset =
		body?.avatarStylePreset && AVATAR_STYLE_PRESETS.includes(body.avatarStylePreset)
			? body.avatarStylePreset
			: puzzle.avatarStylePreset

	const people = await Promise.all(
		puzzle.people.map(async (person) => ({
			...person,
			avatarUrl: await generateAvatarWithAI({
				fullName: person.fullName,
				gender: person.gender,
				occupation: person.occupation,
				hobby: person.hobby,
				avatarPrompt: person.avatarPrompt,
				personCode: person.personCode,
			}, avatarStylePreset),
		}))
	)

	await saveFamilyPuzzle({
		...puzzle,
		avatarStylePreset,
		people,
	})

	return NextResponse.json({ ok: true, people, avatarStylePreset })
}
