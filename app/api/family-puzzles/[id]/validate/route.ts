import { NextResponse } from 'next/server'
import { getFamilyPuzzleById } from '@/lib/family-puzzles/store'
import { validatePuzzlePlacements } from '@/lib/family-puzzles/validation'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: idValue } = await params
	const id = Number(idValue)
	if (!Number.isFinite(id)) {
		return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
	}

	const body = (await request.json().catch(() => null)) as
		| { placements?: Record<string, string> }
		| null

	if (!body || typeof body.placements !== 'object' || body.placements == null) {
		return NextResponse.json({ error: 'placements are required.' }, { status: 400 })
	}

	const puzzle = await getFamilyPuzzleById(id)
	if (!puzzle || puzzle.status !== 'published') {
		return NextResponse.json({ error: 'Puzzle not available.' }, { status: 404 })
	}

	const result = validatePuzzlePlacements({
		placements: body.placements,
		people: puzzle.people,
	})

	return NextResponse.json(result)
}
