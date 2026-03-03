import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { getFamilyPuzzleById, saveFamilyPuzzle } from '@/lib/family-puzzles/store'
import { regenerateCluesFromExistingPuzzle } from '@/lib/family-puzzles/generator'

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

	const body = (await request.json().catch(() => null)) as
		| { clueCount?: number; seed?: number }
		| null

	const puzzle = await getFamilyPuzzleById(id)
	if (!puzzle) {
		return NextResponse.json({ error: 'Puzzle not found.' }, { status: 404 })
	}

	const clues = regenerateCluesFromExistingPuzzle({
		people: puzzle.people,
		relationships: puzzle.relationships,
		difficulty: puzzle.difficulty,
		clueCount: body?.clueCount,
		seed: body?.seed,
	})

	await saveFamilyPuzzle({
		...puzzle,
		clues,
	})

	return NextResponse.json({ ok: true, clues })
}
