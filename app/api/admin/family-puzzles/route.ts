import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createFamilyPuzzleFromDraft, getFamilyPuzzleById, getFamilyPuzzleList, saveFamilyPuzzle } from '@/lib/family-puzzles/store'
import { generateFamilyPuzzleDraft } from '@/lib/family-puzzles/generator'
import { validateMarriageConstraints } from '@/lib/family-puzzles/constraints'
import { AVATAR_STYLE_PRESETS } from '@/lib/family-puzzles/avatar'
import type { AvatarStylePreset, PuzzleDifficulty } from '@/lib/family-puzzles/types'

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

function isDifficulty(value: unknown): value is PuzzleDifficulty {
	return value === 'easy' || value === 'intermediate' || value === 'hard'
}

function isAvatarStylePreset(value: unknown): value is AvatarStylePreset {
	return typeof value === 'string' && AVATAR_STYLE_PRESETS.includes(value as AvatarStylePreset)
}

export async function GET(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const url = new URL(request.url)
	const idValue = url.searchParams.get('id')
	if (idValue) {
		const id = Number(idValue)
		if (!Number.isFinite(id)) {
			return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
		}
		const puzzle = await getFamilyPuzzleById(id)
		if (!puzzle) {
			return NextResponse.json({ error: 'Puzzle not found.' }, { status: 404 })
		}
		return NextResponse.json({ puzzle })
	}

	const puzzles = await getFamilyPuzzleList()
	return NextResponse.json({ puzzles })
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as
		| {
			difficulty?: PuzzleDifficulty
			avatarStylePreset?: AvatarStylePreset
			peopleCount?: number
			clueCount?: number
			title?: string
			seed?: number
			generateAvatars?: boolean
		}
		| null

	if (!body || !isDifficulty(body.difficulty)) {
		return NextResponse.json({ error: 'difficulty is required.' }, { status: 400 })
	}
	if (body.avatarStylePreset && !isAvatarStylePreset(body.avatarStylePreset)) {
		return NextResponse.json({ error: 'Invalid avatar style preset.' }, { status: 400 })
	}

	try {
		const draft = await generateFamilyPuzzleDraft({
			difficulty: body.difficulty,
			peopleCount: body.peopleCount,
			clueCount: body.clueCount,
			seed: body.seed,
			title: body.title,
			generateAvatars: body.generateAvatars ?? true,
			avatarStylePreset: body.avatarStylePreset ?? 'classic_cartoon',
		})
		const id = await createFamilyPuzzleFromDraft(draft, user.id)
		return NextResponse.json({ ok: true, id })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not create puzzle.'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}

export async function PATCH(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as
		| Parameters<typeof saveFamilyPuzzle>[0]
		| null

	if (!body || typeof body.id !== 'number') {
		return NextResponse.json({ error: 'Puzzle payload is required.' }, { status: 400 })
	}
	if (!isDifficulty(body.difficulty)) {
		return NextResponse.json({ error: 'Invalid difficulty.' }, { status: 400 })
	}
	if (!isAvatarStylePreset(body.avatarStylePreset)) {
		return NextResponse.json({ error: 'Invalid avatar style preset.' }, { status: 400 })
	}
	const marriageValidation = validateMarriageConstraints({
		people: body.people,
		relationships: body.relationships,
	})
	if (!marriageValidation.ok) {
		return NextResponse.json(
			{ error: marriageValidation.errors.join(' ') },
			{ status: 400 }
		)
	}

	try {
		await saveFamilyPuzzle(body)
		return NextResponse.json({ ok: true })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not save puzzle.'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
