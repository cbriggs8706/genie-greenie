import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getFamilyPuzzleById } from '@/lib/family-puzzles/store'
import type { PuzzleDifficulty, PublicPuzzlePayload } from '@/lib/family-puzzles/types'

function isDifficulty(value: string | null): value is PuzzleDifficulty {
	return value === 'easy' || value === 'intermediate' || value === 'hard'
}

export async function GET(request: Request) {
	const url = new URL(request.url)
	const difficulty = url.searchParams.get('difficulty')
	const admin = createAdminClient()

	let query = admin
		.from('family_puzzles')
		.select('id,difficulty')
		.eq('status', 'published')
		.order('updated_at', { ascending: false })
		.limit(1)

	if (isDifficulty(difficulty)) {
		query = query.eq('difficulty', difficulty)
	}

	const { data, error } = await query.maybeSingle()
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
	if (!data) {
		return NextResponse.json({ puzzle: null })
	}

	const puzzle = await getFamilyPuzzleById(Number(data.id))
	if (!puzzle) {
		return NextResponse.json({ puzzle: null })
	}

	const personTargetMap = new Map(puzzle.people.map((person) => [person.targetSlotKey, person.personCode]))
	const payload: PublicPuzzlePayload = {
		id: puzzle.id,
		title: puzzle.title,
		difficulty: puzzle.difficulty,
		people: puzzle.people.map((person) => ({
			personCode: person.personCode,
			fullName: person.fullName,
			gender: person.gender,
			age: person.age,
			occupation: person.occupation,
			hobby: person.hobby,
			avatarUrl: person.avatarUrl,
		})),
		slots: puzzle.slots,
		slotLinks: puzzle.slotLinks,
		clues: puzzle.clues,
		prefilledAssignments: puzzle.prefilledSlotKeys
			.map((slotKey) => ({
				slotKey,
				personCode: personTargetMap.get(slotKey) ?? '',
			}))
			.filter((entry) => entry.personCode.length > 0),
	}

	return NextResponse.json({ puzzle: payload })
}
