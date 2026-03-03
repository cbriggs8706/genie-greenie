import type { PuzzlePerson } from '@/lib/family-puzzles/types'

export type PlacementMap = Record<string, string>

export function validatePuzzlePlacements(input: {
	placements: PlacementMap
	people: Array<Pick<PuzzlePerson, 'personCode' | 'targetSlotKey'>>
}) {
	const expected = new Map(
		input.people.map((person) => [person.personCode, person.targetSlotKey])
	)
	const perPerson = input.people.map((person) => {
		const placedSlot = input.placements[person.personCode]
		const correct = placedSlot === person.targetSlotKey
		return {
			personCode: person.personCode,
			placedSlot: placedSlot ?? null,
			expectedSlot: person.targetSlotKey,
			correct,
		}
	})

	const filledCount = Object.keys(input.placements).filter(
		(personCode) =>
			typeof input.placements[personCode] === 'string' && input.placements[personCode].trim().length > 0
	).length
	const correctCount = perPerson.filter((entry) => entry.correct).length

	const duplicatedSlots = Object.values(input.placements)
		.filter(Boolean)
		.reduce<Record<string, number>>((acc, slotKey) => {
			acc[slotKey] = (acc[slotKey] ?? 0) + 1
			return acc
		}, {})

	const hasDuplicateSlot = Object.values(duplicatedSlots).some((count) => count > 1)
	const hasUnknownPerson = Object.keys(input.placements).some(
		(personCode) => !expected.has(personCode)
	)

	const solved =
		perPerson.length > 0 &&
		correctCount === perPerson.length &&
		filledCount === perPerson.length &&
		!hasDuplicateSlot &&
		!hasUnknownPerson

	return {
		solved,
		correctCount,
		totalCount: perPerson.length,
		perPerson,
		hasDuplicateSlot,
		hasUnknownPerson,
	}
}
