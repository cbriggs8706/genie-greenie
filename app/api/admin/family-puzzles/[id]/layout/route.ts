import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { rebuildLayoutFromExistingPuzzle } from '@/lib/family-puzzles/generator'
import { getFamilyPuzzleById, saveFamilyPuzzle } from '@/lib/family-puzzles/store'

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
	_request: Request,
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

	const rebuilt = rebuildLayoutFromExistingPuzzle({
		people: puzzle.people,
		relationships: puzzle.relationships,
	})

	await saveFamilyPuzzle({
		...puzzle,
		people: rebuilt.people,
		slots: rebuilt.slots,
		slotLinks: rebuilt.slotLinks,
	})

	return NextResponse.json({ ok: true, people: rebuilt.people, slots: rebuilt.slots, slotLinks: rebuilt.slotLinks })
}
