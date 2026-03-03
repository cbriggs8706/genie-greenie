import type { PuzzlePerson, PuzzleRelationship } from '@/lib/family-puzzles/types'

function isMarriageRelationship(type: PuzzleRelationship['relationshipType']) {
	return type === 'spouse' || type === 'divorced_spouse'
}

function personLabel(personCode: string, peopleByCode: Map<string, PuzzlePerson>) {
	return peopleByCode.get(personCode)?.fullName || personCode
}

export function validateMarriageConstraints(input: {
	people: PuzzlePerson[]
	relationships: PuzzleRelationship[]
}) {
	const peopleByCode = new Map(input.people.map((person) => [person.personCode, person]))
	const errors: string[] = []

	for (const relationship of input.relationships) {
		if (!isMarriageRelationship(relationship.relationshipType)) continue
		const left = peopleByCode.get(relationship.fromPersonCode)
		const right = peopleByCode.get(relationship.toPersonCode)
		if (!left || !right) continue
		const validPair =
			(left.gender === 'male' && right.gender === 'female') ||
			(left.gender === 'female' && right.gender === 'male')
		if (!validPair) {
			errors.push(
				`Marriage pairs must be male-female only: ${personLabel(
					relationship.fromPersonCode,
					peopleByCode
				)} and ${personLabel(relationship.toPersonCode, peopleByCode)}.`
			)
		}
	}

	return {
		ok: errors.length === 0,
		errors,
	}
}
