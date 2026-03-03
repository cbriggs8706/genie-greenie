import { generateAvatarWithAI } from '@/lib/family-puzzles/avatar'
import { clampDifficultyCount, getDifficultyRules } from '@/lib/family-puzzles/rules'
import type {
	AvatarStylePreset,
	GeneratedPuzzleDraft,
	PuzzleClue,
	PuzzleDifficulty,
	PuzzlePerson,
	PuzzleRelationship,
	PuzzleSlot,
	PuzzleSlotLink,
	RelationshipType,
} from '@/lib/family-puzzles/types'

type GenerateOptions = {
	difficulty: PuzzleDifficulty
	peopleCount?: number
	clueCount?: number
	seed?: number
	title?: string
	generateAvatars?: boolean
	avatarStylePreset?: AvatarStylePreset
}

type MutablePerson = Omit<PuzzlePerson, 'targetSlotKey'> & { targetSlotKey?: string }

const maleNames = [
	'James',
	'Robert',
	'Michael',
	'William',
	'David',
	'Joseph',
	'Thomas',
	'Charles',
	'Daniel',
	'Matthew',
	'Andrew',
	'Anthony',
	'Christopher',
	'Steven',
	'Edward',
	'Samuel',
]

const femaleNames = [
	'Patricia',
	'Linda',
	'Barbara',
	'Elizabeth',
	'Susan',
	'Jennifer',
	'Mary',
	'Nancy',
	'Sarah',
	'Emma',
	'Olivia',
	'Sophia',
	'Grace',
	'Chloe',
	'Amy',
	'Ruth',
]

const nonbinaryNames = [
	'Avery',
	'Taylor',
	'Jordan',
	'Quinn',
	'Rowan',
	'Casey',
]

function oppositeBinaryGender(gender: MutablePerson['gender']): MutablePerson['gender'] {
	if (gender === 'male') return 'female'
	return 'male'
}

const occupations = [
	'teacher',
	'librarian',
	'nurse',
	'carpenter',
	'engineer',
	'chef',
	'garden designer',
	'postal worker',
	'accountant',
	'artist',
	'farmer',
	'research assistant',
]

const hobbies = [
	'birdwatching',
	'knitting',
	'hiking',
	'photography',
	'crossword puzzles',
	'cooking',
	'cycling',
	'woodworking',
	'painting',
	'genealogy research',
	'gardening',
]

function mulberry32(seed: number) {
	let value = seed
	return () => {
		value |= 0
		value = (value + 0x6d2b79f5) | 0
		let mixed = Math.imul(value ^ (value >>> 15), 1 | value)
		mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)
		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
	}
}

function pick<T>(items: T[], random: () => number) {
	return items[Math.floor(random() * items.length)]
}

function pickUniqueName(
	gender: MutablePerson['gender'],
	used: Set<string>,
	random: () => number
) {
	const pool = gender === 'male' ? maleNames : gender === 'female' ? femaleNames : nonbinaryNames
	const available = pool.filter((entry) => !used.has(entry.toLowerCase()))
	const chosen = available.length > 0 ? pick(available, random) : `${pick(pool, random)} ${used.size + 1}`
	used.add(chosen.toLowerCase())
	return chosen
}

function relKey(relationship: PuzzleRelationship) {
	return `${relationship.relationshipType}:${relationship.fromPersonCode}:${relationship.toPersonCode}`
}

function dedupeRelationships(relationships: PuzzleRelationship[]) {
	const seen = new Set<string>()
	const deduped: PuzzleRelationship[] = []
	for (const relationship of relationships) {
		const key = relKey(relationship)
		if (seen.has(key)) continue
		seen.add(key)
		deduped.push(relationship)
	}
	return deduped
}

function relationIncludesType(type: RelationshipType, difficulty: PuzzleDifficulty) {
	if (difficulty === 'easy') {
		return type === 'parent' || type === 'spouse'
	}
	return true
}

function buildClues(
	people: MutablePerson[],
	relationships: PuzzleRelationship[],
	difficulty: PuzzleDifficulty,
	clueCount: number,
	random: () => number
) {
	const byCode = new Map(people.map((person) => [person.personCode, person]))
	const clueTexts = new Set<string>()

	const parentLinks = relationships.filter((entry) =>
		['parent', 'adoptive_parent', 'step_parent'].includes(entry.relationshipType)
	)
	for (const entry of parentLinks) {
		if (!relationIncludesType(entry.relationshipType, difficulty)) continue
		const parent = byCode.get(entry.fromPersonCode)
		const child = byCode.get(entry.toPersonCode)
		if (!parent || !child) continue
		let relationWord = 'parent'
		if (entry.relationshipType === 'adoptive_parent') relationWord = 'adoptive parent'
		if (entry.relationshipType === 'step_parent') relationWord = 'step-parent'
		if (entry.relationshipType === 'parent') {
			relationWord = parent.gender === 'female' ? 'mother' : parent.gender === 'male' ? 'father' : 'parent'
		}
		clueTexts.add(`${parent.fullName} is ${child.fullName}'s ${relationWord}.`)
	}

	for (const entry of relationships.filter((item) => item.relationshipType === 'spouse')) {
		const a = byCode.get(entry.fromPersonCode)
		const b = byCode.get(entry.toPersonCode)
		if (!a || !b) continue
		clueTexts.add(`${a.fullName} and ${b.fullName} are married.`)
	}

	for (const entry of relationships.filter((item) => item.relationshipType === 'divorced_spouse')) {
		if (difficulty === 'easy') continue
		const a = byCode.get(entry.fromPersonCode)
		const b = byCode.get(entry.toPersonCode)
		if (!a || !b) continue
		clueTexts.add(`${a.fullName} and ${b.fullName} were once married but are now divorced.`)
	}

	const childrenByParent = new Map<string, string[]>()
	for (const relationship of parentLinks) {
		if (!childrenByParent.has(relationship.fromPersonCode)) {
			childrenByParent.set(relationship.fromPersonCode, [])
		}
		childrenByParent.get(relationship.fromPersonCode)!.push(relationship.toPersonCode)
	}

	for (const [parentCode, childrenCodes] of childrenByParent.entries()) {
		if (childrenCodes.length < 2) continue
		const first = byCode.get(childrenCodes[0])
		const second = byCode.get(childrenCodes[1])
		if (!first || !second) continue
		clueTexts.add(`${first.fullName} and ${second.fullName} are siblings.`)
		const parent = byCode.get(parentCode)
		if (parent) {
			clueTexts.add(`${parent.fullName} has at least ${childrenCodes.length} children.`)
		}
	}

	if (difficulty !== 'easy') {
		for (const person of people) {
			clueTexts.add(`${person.fullName} works as a ${person.occupation}.`)
			if (clueTexts.size >= clueCount * 2) break
		}
	}

	const clues = Array.from(clueTexts)
	if (clues.length < clueCount) {
		for (const person of people) {
			clues.push(`${person.fullName} enjoys ${person.hobby}.`)
			if (clues.length >= clueCount) break
		}
	}

	for (let index = clues.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1))
		const temp = clues[index]
		clues[index] = clues[swap]
		clues[swap] = temp
	}

	return clues.slice(0, clueCount).map(
		(clueText, index): PuzzleClue => ({
			clueText,
			clueBand: difficulty,
			sortOrder: index,
		})
	)
}

function choosePrefilledSlots(
	difficulty: PuzzleDifficulty,
	slots: PuzzleSlot[],
	random: () => number
) {
	const sorted = [...slots].sort((a, b) => a.generation - b.generation)
	if (difficulty === 'hard') {
		return []
	}
	if (difficulty === 'easy') {
		return sorted.slice(0, 1).map((entry) => entry.slotKey)
	}
	const first = sorted[0]?.slotKey
	const second = sorted[Math.floor(random() * sorted.length)]?.slotKey
	return Array.from(new Set([first, second].filter(Boolean) as string[]))
}

function buildSlotsAndLinks(
	people: MutablePerson[],
	relationships: PuzzleRelationship[]
): { slots: PuzzleSlot[]; slotLinks: PuzzleSlotLink[] } {
	const groups = new Map<number, MutablePerson[]>()
	const peopleByCode = new Map(people.map((person) => [person.personCode, person]))
	const spouseByPerson = new Map<string, string>()
	for (const relationship of relationships) {
		if (
			relationship.relationshipType === 'spouse' ||
			relationship.relationshipType === 'divorced_spouse'
		) {
			spouseByPerson.set(relationship.fromPersonCode, relationship.toPersonCode)
			spouseByPerson.set(relationship.toPersonCode, relationship.fromPersonCode)
		}
	}

	for (const person of people) {
		if (!groups.has(person.generation)) {
			groups.set(person.generation, [])
		}
		groups.get(person.generation)!.push(person)
	}

	const childParents = new Map<string, string[]>()
	for (const relationship of relationships) {
		if (relationship.relationshipType !== 'parent') continue
		if (!childParents.has(relationship.toPersonCode)) {
			childParents.set(relationship.toPersonCode, [])
		}
		childParents.get(relationship.toPersonCode)!.push(relationship.fromPersonCode)
	}

	type GenerationUnit =
		| { kind: 'couple'; members: [string, string] }
		| { kind: 'single'; members: [string] }

	const generations = Array.from(groups.keys()).sort((a, b) => a - b)
	const unitsByGeneration = new Map<number, GenerationUnit[]>()

	for (const generation of generations) {
		const generationPeople = [...(groups.get(generation) ?? [])]
		generationPeople.sort((a, b) => a.personCode.localeCompare(b.personCode))
		const consumed = new Set<string>()
		const units: GenerationUnit[] = []

		for (const person of generationPeople) {
			if (consumed.has(person.personCode)) continue
			const spouseCode = spouseByPerson.get(person.personCode)
			if (
				spouseCode &&
				!consumed.has(spouseCode) &&
				peopleByCode.get(spouseCode)?.generation === generation
			) {
				consumed.add(person.personCode)
				consumed.add(spouseCode)
				const members = [person.personCode, spouseCode].sort() as [string, string]
				units.push({ kind: 'couple', members })
				continue
			}

			consumed.add(person.personCode)
			units.push({ kind: 'single', members: [person.personCode] })
		}

		if (generation > 0) {
			const previousUnitIndex = new Map<string, number>()
			const previousGenerationUnits = unitsByGeneration.get(generation - 1) ?? []
			previousGenerationUnits.forEach((unit, index) => {
				for (const member of unit.members) {
					previousUnitIndex.set(member, index)
				}
			})
			units.sort((left, right) => {
				const leftParents = left.members.flatMap((member) => childParents.get(member) ?? [])
				const rightParents = right.members.flatMap((member) => childParents.get(member) ?? [])
				const leftRank =
					leftParents.length > 0
						? leftParents.reduce(
								(sum, parent) => sum + (previousUnitIndex.get(parent) ?? previousGenerationUnits.length),
								0
						  ) / leftParents.length
						: Number.POSITIVE_INFINITY
				const rightRank =
					rightParents.length > 0
						? rightParents.reduce(
								(sum, parent) => sum + (previousUnitIndex.get(parent) ?? previousGenerationUnits.length),
								0
						  ) / rightParents.length
						: Number.POSITIVE_INFINITY
				if (leftRank !== rightRank) return leftRank - rightRank
				return left.members[0].localeCompare(right.members[0])
			})
		}

		unitsByGeneration.set(generation, units)
	}

	const slots: PuzzleSlot[] = []
	for (const generation of generations) {
		const units = unitsByGeneration.get(generation) ?? []
		const totalPositions = units.reduce(
			(total, unit) => total + (unit.kind === 'couple' ? 2 : 1),
			0
		)
		const y = 12 + generation * 24
		let slotCursor = 0
		for (const unit of units) {
			const sortedMembers = [...unit.members].sort((leftCode, rightCode) => {
				const left = peopleByCode.get(leftCode)
				const right = peopleByCode.get(rightCode)
				if (!left || !right) return leftCode.localeCompare(rightCode)
				if (left.gender === right.gender) return leftCode.localeCompare(rightCode)
				return left.gender === 'male' ? -1 : 1
			})
			for (const memberCode of sortedMembers) {
				slotCursor += 1
				const slotKey = `g${generation + 1}_s${slotCursor}`
				const x = Number(((slotCursor / (totalPositions + 1)) * 100).toFixed(2))
				const person = peopleByCode.get(memberCode)
				if (!person) continue
				person.targetSlotKey = slotKey
				slots.push({
					slotKey,
					generation,
					x,
					y: Number(y.toFixed(2)),
					isLocked: false,
					label: null,
				})
			}
		}
	}

	const slotByPersonCode = new Map(
		people.map((person) => [person.personCode, person.targetSlotKey])
	)
	const slotLinkKeySet = new Set<string>()
	const slotLinks: PuzzleSlotLink[] = []
	for (const relationship of relationships) {
		const fromSlot = slotByPersonCode.get(relationship.fromPersonCode)
		const toSlot = slotByPersonCode.get(relationship.toPersonCode)
		if (!fromSlot || !toSlot) continue
		const linkType =
			relationship.relationshipType === 'spouse' ||
			relationship.relationshipType === 'divorced_spouse'
				? 'spouse'
				: relationship.relationshipType === 'parent'
					? 'parent_child'
					: null
		if (!linkType) continue
		const key = `${linkType}:${fromSlot}:${toSlot}`
		if (slotLinkKeySet.has(key)) continue
		slotLinkKeySet.add(key)
		slotLinks.push({
			fromSlotKey: fromSlot,
			toSlotKey: toSlot,
			linkType,
		})
	}

	return { slots, slotLinks }
}

export function rebuildLayoutFromExistingPuzzle(input: {
	people: PuzzlePerson[]
	relationships: PuzzleRelationship[]
}) {
	const mutablePeople: MutablePerson[] = input.people.map((person) => ({ ...person }))
	const { slots, slotLinks } = buildSlotsAndLinks(mutablePeople, input.relationships)
	const updatedPeople: PuzzlePerson[] = mutablePeople.map((person) => ({
		...person,
		targetSlotKey: person.targetSlotKey ?? '',
	}))
	return {
		people: updatedPeople,
		slots,
		slotLinks,
	}
}

function defaultTitle(difficulty: PuzzleDifficulty) {
	const suffix = Math.floor(Date.now() / 1000).toString().slice(-6)
	return `${difficulty[0].toUpperCase()}${difficulty.slice(1)} Family Puzzle ${suffix}`
}

export async function generateFamilyPuzzleDraft(options: GenerateOptions): Promise<GeneratedPuzzleDraft> {
	const rules = getDifficultyRules(options.difficulty)
	const seed = options.seed ?? Math.floor(Math.random() * 1_000_000)
	const random = mulberry32(seed)
	const targetPeople = clampDifficultyCount(
		options.difficulty,
		options.peopleCount ?? rules.peopleMin + Math.floor(random() * (rules.peopleMax - rules.peopleMin + 1)),
		'people'
	)
	const targetClues = clampDifficultyCount(
		options.difficulty,
		options.clueCount ?? rules.cluesMin + Math.floor(random() * (rules.cluesMax - rules.cluesMin + 1)),
		'clues'
	)
	const people: MutablePerson[] = []
	const avatarStylePreset = options.avatarStylePreset ?? 'classic_cartoon'
	let peopleCounter = 0
	const relationships: PuzzleRelationship[] = []
	const usedNames = new Set<string>()
	const spouseOf = new Map<string, string>()
	const familyUnits: Array<{ adultA: string; adultB: string; generation: number }> = []

	const addPerson = (generation: number, forcedGender?: MutablePerson['gender']) => {
		peopleCounter += 1
		const gender = forcedGender ?? (random() < 0.5 ? 'female' : 'male')
		const fullName = pickUniqueName(gender, usedNames, random)
		const occupation = pick(occupations, random)
		const hobby = pick(hobbies, random)
		const person: MutablePerson = {
			personCode: `p${peopleCounter}`,
			fullName,
			gender,
			age: Math.max(5, Math.min(92, Math.round(72 - generation * 18 + random() * 20))),
			generation,
			occupation,
			hobby,
			avatarPrompt: `${fullName}, ${occupation}, likes ${hobby}`,
			avatarUrl: '',
		}
		people.push(person)
		return person.personCode
	}

	const addRelationship = (
		fromPersonCode: string,
		toPersonCode: string,
		relationshipType: RelationshipType
	) => {
		relationships.push({ fromPersonCode, toPersonCode, relationshipType })
	}

	const addSpousePair = (left: string, right: string) => {
		if (spouseOf.get(left) === right || spouseOf.get(right) === left) return
		spouseOf.set(left, right)
		spouseOf.set(right, left)
		addRelationship(left, right, 'spouse')
	}

	const addChildToUnit = (unit: { adultA: string; adultB: string; generation: number }) => {
		if (people.length >= targetPeople) return null
		const child = addPerson(unit.generation + 1)
		addRelationship(unit.adultA, child, 'parent')
		addRelationship(unit.adultB, child, 'parent')
		return child
	}

	const rootA = addPerson(0, 'male')
	const rootB = addPerson(0, 'female')
	addSpousePair(rootA, rootB)
	familyUnits.push({ adultA: rootA, adultB: rootB, generation: 0 })

	const firstWaveChildrenTarget =
		options.difficulty === 'easy' ? 3 : options.difficulty === 'intermediate' ? 4 : 5
	const firstWaveChildren: string[] = []
	for (let index = 0; index < firstWaveChildrenTarget; index += 1) {
		const child = addChildToUnit(familyUnits[0])
		if (!child) break
		firstWaveChildren.push(child)
	}

	for (const childCode of firstWaveChildren) {
		if (people.length >= targetPeople) break
		if (random() > 0.68) continue
		const child = people.find((entry) => entry.personCode === childCode)
		if (!child || spouseOf.has(child.personCode)) continue
		const spouse = addPerson(child.generation, oppositeBinaryGender(child.gender))
		addSpousePair(child.personCode, spouse)
		familyUnits.push({ adultA: child.personCode, adultB: spouse, generation: child.generation })
	}

	let loopSafety = 0
	while (people.length < targetPeople && loopSafety < targetPeople * 8) {
		loopSafety += 1
		const validUnits = familyUnits.filter((unit) => unit.generation < 3)
		if (validUnits.length === 0) break
		const unit = pick(validUnits, random)
		const nextChild = addChildToUnit(unit)
		if (!nextChild) break

		const child = people.find((entry) => entry.personCode === nextChild)
		if (!child || people.length >= targetPeople) continue
		if (child.generation < 3 && random() < 0.42 && !spouseOf.has(child.personCode)) {
			const spouse = addPerson(child.generation, oppositeBinaryGender(child.gender))
			addSpousePair(child.personCode, spouse)
			familyUnits.push({ adultA: child.personCode, adultB: spouse, generation: child.generation })
		}
	}

	if (rules.allowComplexFamilyRelations) {
		const spouseRelationships = relationships.filter((entry) => entry.relationshipType === 'spouse')
		if (spouseRelationships.length > 0 && random() < 0.45) {
			const target = pick(spouseRelationships, random)
			target.relationshipType = 'divorced_spouse'
			const remarriedPersonCode = target.fromPersonCode
			if (people.length < targetPeople) {
				const remarriedPerson = people.find((entry) => entry.personCode === remarriedPersonCode)
				if (remarriedPerson) {
					const newSpouseCode = addPerson(
						remarriedPerson.generation,
						oppositeBinaryGender(remarriedPerson.gender)
					)
					addSpousePair(remarriedPerson.personCode, newSpouseCode)
					const childrenOfOriginal = relationships
						.filter(
							(entry) =>
								entry.relationshipType === 'parent' &&
								entry.fromPersonCode === remarriedPerson.personCode
						)
						.map((entry) => entry.toPersonCode)
					if (childrenOfOriginal.length > 0) {
						addRelationship(newSpouseCode, childrenOfOriginal[0], 'step_parent')
					}
				}
			}
		}

		if (people.length > 8 && random() < 0.5) {
			const candidateParent = pick(people.filter((person) => person.generation <= 2), random)
			const candidateChild = pick(people.filter((person) => person.generation >= 1), random)
			if (candidateParent && candidateChild && candidateParent.personCode !== candidateChild.personCode) {
				addRelationship(candidateParent.personCode, candidateChild.personCode, 'adoptive_parent')
			}
		}
	}

	const dedupedRelationships = dedupeRelationships(relationships)
	const { slots, slotLinks } = buildSlotsAndLinks(people, dedupedRelationships)
	const clues = buildClues(people, dedupedRelationships, options.difficulty, targetClues, random)

	const generateAvatars = options.generateAvatars ?? true
	for (const person of people) {
		person.avatarUrl = generateAvatars
			? await generateAvatarWithAI({
				fullName: person.fullName,
				gender: person.gender,
				occupation: person.occupation,
				hobby: person.hobby,
				avatarPrompt: person.avatarPrompt,
				personCode: person.personCode,
			}, avatarStylePreset)
			: ''
	}

	const prefilledSlotKeys = choosePrefilledSlots(options.difficulty, slots, random)
	const finalizedPeople: PuzzlePerson[] = people.map((person) => ({
		...person,
		targetSlotKey: person.targetSlotKey ?? '',
		avatarUrl: person.avatarUrl || '',
	}))

	return {
		title: options.title?.trim() || defaultTitle(options.difficulty),
		difficulty: options.difficulty,
		avatarStylePreset,
		people: finalizedPeople,
		relationships: dedupedRelationships,
		clues,
		slots,
		slotLinks,
		prefilledSlotKeys,
	}
}

export function regenerateCluesFromExistingPuzzle(input: {
	people: Array<Pick<PuzzlePerson, 'personCode' | 'fullName' | 'gender' | 'occupation' | 'hobby'>>
	relationships: PuzzleRelationship[]
	difficulty: PuzzleDifficulty
	clueCount?: number
	seed?: number
}) {
	const random = mulberry32(input.seed ?? Math.floor(Math.random() * 1_000_000))
	const rules = getDifficultyRules(input.difficulty)
	const clueCount = clampDifficultyCount(
		input.difficulty,
		input.clueCount ?? rules.cluesMin + Math.floor(random() * (rules.cluesMax - rules.cluesMin + 1)),
		'clues'
	)
	const people: MutablePerson[] = input.people.map((person) => ({
		personCode: person.personCode,
		fullName: person.fullName,
		gender: person.gender,
		occupation: person.occupation,
		hobby: person.hobby,
		avatarPrompt: '',
		avatarUrl: '',
		age: 30,
		generation: 0,
	}))
	return buildClues(people, dedupeRelationships(input.relationships), input.difficulty, clueCount, random)
}
