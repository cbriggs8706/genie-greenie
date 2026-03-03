import type {
	PuzzleClue,
	PuzzleDifficulty,
	PuzzlePerson,
	PuzzleRelationship,
	PuzzleSlot,
	PuzzleSlotLink,
} from '@/lib/family-puzzles/types'

export type PuzzleRecord = {
	id: number
	title: string
	difficulty: PuzzleDifficulty
	status: 'draft' | 'published'
	prefilledSlotKeys: string[]
	people: PuzzlePerson[]
	relationships: PuzzleRelationship[]
	clues: PuzzleClue[]
	slots: PuzzleSlot[]
	slotLinks: PuzzleSlotLink[]
}

export function normalizeJsonArray<T>(value: unknown): T[] {
	if (!Array.isArray(value)) {
		return []
	}
	return value as T[]
}

export function toStringArray(value: unknown) {
	if (!Array.isArray(value)) return []
	return value.filter((item): item is string => typeof item === 'string')
}
