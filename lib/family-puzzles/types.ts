export type PuzzleDifficulty = 'easy' | 'intermediate' | 'hard'
export type AvatarStylePreset = 'classic_cartoon' | 'storybook' | 'bold_comic' | 'soft_painterly'

export type RelationshipType =
	| 'spouse'
	| 'divorced_spouse'
	| 'parent'
	| 'adoptive_parent'
	| 'step_parent'

export type ClueBand = 'easy' | 'intermediate' | 'hard'

export type PuzzlePerson = {
	personCode: string
	fullName: string
	gender: 'female' | 'male' | 'nonbinary'
	age: number
	generation: number
	occupation: string
	hobby: string
	avatarPrompt: string
	avatarUrl: string
	targetSlotKey: string
}

export type PuzzleRelationship = {
	fromPersonCode: string
	toPersonCode: string
	relationshipType: RelationshipType
}

export type PuzzleClue = {
	clueText: string
	clueBand: ClueBand
	sortOrder: number
}

export type PuzzleSlot = {
	slotKey: string
	generation: number
	x: number
	y: number
	isLocked: boolean
	label: string | null
}

export type PuzzleSlotLink = {
	fromSlotKey: string
	toSlotKey: string
	linkType: 'spouse' | 'parent_child'
}

export type GeneratedPuzzleDraft = {
	title: string
	difficulty: PuzzleDifficulty
	avatarStylePreset: AvatarStylePreset
	people: PuzzlePerson[]
	relationships: PuzzleRelationship[]
	clues: PuzzleClue[]
	slots: PuzzleSlot[]
	slotLinks: PuzzleSlotLink[]
	prefilledSlotKeys: string[]
}

export type PublicPuzzlePayload = {
	id: number
	title: string
	difficulty: PuzzleDifficulty
	people: Array<{
		personCode: string
		fullName: string
		gender: PuzzlePerson['gender']
		age: number
		occupation: string
		hobby: string
		avatarUrl: string
	}>
	slots: PuzzleSlot[]
	slotLinks: PuzzleSlotLink[]
	clues: PuzzleClue[]
	prefilledAssignments: Array<{ slotKey: string; personCode: string }>
}
