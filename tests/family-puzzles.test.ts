import test from 'node:test'
import assert from 'node:assert/strict'
import { generateFamilyPuzzleDraft } from '@/lib/family-puzzles/generator'
import { validatePuzzlePlacements } from '@/lib/family-puzzles/validation'

function parseSlotIndex(slotKey: string) {
	const match = /g(\d+)_s(\d+)/.exec(slotKey)
	if (!match) return null
	return {
		generation: Number(match[1]),
		index: Number(match[2]),
	}
}

test('easy puzzle generation follows easy constraints', async () => {
	const draft = await generateFamilyPuzzleDraft({
		difficulty: 'easy',
		seed: 12345,
		generateAvatars: false,
	})

	assert.ok(draft.people.length >= 6 && draft.people.length <= 8)
	assert.ok(draft.clues.length >= 6 && draft.clues.length <= 10)
	assert.equal(
		draft.relationships.some((relationship) =>
			['divorced_spouse', 'adoptive_parent', 'step_parent'].includes(
				relationship.relationshipType
			)
		),
		false
	)
	const peopleByCode = new Map(draft.people.map((person) => [person.personCode, person]))
	for (const relationship of draft.relationships.filter(
		(entry) => entry.relationshipType === 'spouse'
	)) {
		const left = peopleByCode.get(relationship.fromPersonCode)
		const right = peopleByCode.get(relationship.toPersonCode)
		assert.ok(left && right)
		assert.equal(left.gender !== right.gender, true)
		const leftSlot = parseSlotIndex(left.targetSlotKey)
		const rightSlot = parseSlotIndex(right.targetSlotKey)
		assert.ok(leftSlot && rightSlot)
		assert.equal(leftSlot.generation, rightSlot.generation)
		assert.equal(Math.abs(leftSlot.index - rightSlot.index), 1)
	}
})

test('hard puzzle generation follows hard constraints', async () => {
	const draft = await generateFamilyPuzzleDraft({
		difficulty: 'hard',
		seed: 67890,
		generateAvatars: false,
	})

	assert.ok(draft.people.length >= 15 && draft.people.length <= 20)
	assert.ok(draft.clues.length >= 6 && draft.clues.length <= 10)
	assert.equal(draft.prefilledSlotKeys.length, 0)
	const peopleByCode = new Map(draft.people.map((person) => [person.personCode, person]))
	for (const relationship of draft.relationships.filter((entry) =>
		['spouse', 'divorced_spouse'].includes(entry.relationshipType)
	)) {
		const left = peopleByCode.get(relationship.fromPersonCode)
		const right = peopleByCode.get(relationship.toPersonCode)
		assert.ok(left && right)
		assert.equal(left.gender !== right.gender, true)
		const leftSlot = parseSlotIndex(left.targetSlotKey)
		const rightSlot = parseSlotIndex(right.targetSlotKey)
		assert.ok(leftSlot && rightSlot)
		assert.equal(leftSlot.generation, rightSlot.generation)
		assert.equal(Math.abs(leftSlot.index - rightSlot.index), 1)
	}
})

test('placement validator accepts correct solution and rejects incorrect one', () => {
	const people = [
		{ personCode: 'p1', targetSlotKey: 's1' },
		{ personCode: 'p2', targetSlotKey: 's2' },
	]
	const solved = validatePuzzlePlacements({
		people,
		placements: {
			p1: 's1',
			p2: 's2',
		},
	})
	assert.equal(solved.solved, true)

	const unsolved = validatePuzzlePlacements({
		people,
		placements: {
			p1: 's2',
			p2: 's1',
		},
	})
	assert.equal(unsolved.solved, false)
	assert.equal(unsolved.correctCount, 0)
})
