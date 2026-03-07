import familySearchSampleTree from '@/data/familysearch-sample-tree.json'
import type { DateIsRightEvent } from '@/lib/date-is-right/types'
import type {
	FamilySearchFactType,
	FamilySearchMockBundle,
	FamilySearchPerson,
} from '@/lib/familysearch/types'

const familySearchMockBundle = familySearchSampleTree as FamilySearchMockBundle

const relationshipByGeneration: Record<number, { male: string; female: string }> = {
	1: { male: 'Self', female: 'Self' },
	2: { male: 'Father', female: 'Mother' },
	3: { male: 'Grandfather', female: 'Grandmother' },
	4: { male: 'Great-Grandfather', female: 'Great-Grandmother' },
	5: { male: '2nd Great-Grandfather', female: '2nd Great-Grandmother' },
	6: { male: '3rd Great-Grandfather', female: '3rd Great-Grandmother' },
	7: { male: '4th Great-Grandfather', female: '4th Great-Grandmother' },
	8: { male: '5th Great-Grandfather', female: '5th Great-Grandmother' },
}

function getPersonName(person: FamilySearchPerson) {
	return (
		person.display?.name ||
		person.names?.[0]?.nameForms?.[0]?.fullText ||
		person.id
	)
}

function getGenerationFromAscendancy(ascendancyNumber?: string) {
	if (!ascendancyNumber) return 1

	const ahnentafelNumber = Number.parseInt(ascendancyNumber, 10)
	if (Number.isNaN(ahnentafelNumber) || ahnentafelNumber < 1) return 1

	return Math.floor(Math.log2(ahnentafelNumber)) + 1
}

function getRelationshipLabel(person: FamilySearchPerson) {
	const generation = getGenerationFromAscendancy(person.display?.ascendancyNumber)
	const relationship = relationshipByGeneration[generation]
	const gender = person.gender?.type

	if (!relationship) return generation === 1 ? 'Self' : 'Ancestor'
	if (gender === 'http://gedcomx.org/Male') return relationship.male
	if (gender === 'http://gedcomx.org/Female') return relationship.female
	return generation === 1 ? 'Self' : 'Ancestor'
}

function getFact(
	person: FamilySearchPerson,
	type: FamilySearchFactType
): { date: string; place: string } | null {
	const fact = person.facts?.find((entry) => entry.type === type)
	if (!fact?.date?.original) return null

	return {
		date: fact.date.original,
		place: fact.place?.original || '',
	}
}

function parseYear(originalDate: string) {
	const match = originalDate.match(/\b(1[5-9]\d{2}|20\d{2})\b/)
	return match ? Number(match[1]) : null
}

function toEvent(
	person: FamilySearchPerson,
	type: FamilySearchFactType,
	factLabel: 'born' | 'died'
): DateIsRightEvent | null {
	const fact = getFact(person, type)
	if (!fact) return null

	const year = parseYear(fact.date)
	if (!year) return null

	const personName = getPersonName(person)
	const relationship = getRelationshipLabel(person)
	const factKind = factLabel === 'born' ? 'birth' : 'death'

	return {
		id: `${person.id}:${factKind}`,
		personId: person.id,
		personName,
		relationship,
		factKind,
		factLabel,
		year,
		originalDate: fact.date,
		place: fact.place,
		prompt: `What year was ${personName} ${factLabel}?`,
		clue: `${relationship}${fact.place ? ` • ${fact.place}` : ''}`,
	}
}

export function getDateIsRightEvents() {
	const events = familySearchMockBundle.ancestry.persons.flatMap((person) => {
		const birth = toEvent(person, 'http://gedcomx.org/Birth', 'born')
		const death = toEvent(person, 'http://gedcomx.org/Death', 'died')
		return [birth, death].filter((event): event is DateIsRightEvent => Boolean(event))
	})

	return events.sort((left, right) => left.year - right.year || left.prompt.localeCompare(right.prompt))
}

function shuffle<T>(input: T[]) {
	const next = [...input]
	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
	}
	return next
}

export function buildDateIsRightRounds(count = 8) {
	return shuffle(getDateIsRightEvents()).slice(0, count)
}
