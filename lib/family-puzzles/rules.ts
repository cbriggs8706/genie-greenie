import type { PuzzleDifficulty } from '@/lib/family-puzzles/types'

export type DifficultyRules = {
	peopleMin: number
	peopleMax: number
	cluesMin: number
	cluesMax: number
	allowComplexFamilyRelations: boolean
}

const RULES: Record<PuzzleDifficulty, DifficultyRules> = {
	easy: {
		peopleMin: 6,
		peopleMax: 8,
		cluesMin: 6,
		cluesMax: 10,
		allowComplexFamilyRelations: false,
	},
	intermediate: {
		peopleMin: 10,
		peopleMax: 14,
		cluesMin: 6,
		cluesMax: 10,
		allowComplexFamilyRelations: true,
	},
	hard: {
		peopleMin: 15,
		peopleMax: 20,
		cluesMin: 6,
		cluesMax: 10,
		allowComplexFamilyRelations: true,
	},
}

export function getDifficultyRules(difficulty: PuzzleDifficulty): DifficultyRules {
	return RULES[difficulty]
}

export function clampDifficultyCount(
	difficulty: PuzzleDifficulty,
	value: number,
	type: 'people' | 'clues'
) {
	const rules = getDifficultyRules(difficulty)
	if (type === 'people') {
		return Math.min(rules.peopleMax, Math.max(rules.peopleMin, Math.floor(value)))
	}
	return Math.min(rules.cluesMax, Math.max(rules.cluesMin, Math.floor(value)))
}
