import familySearchSampleTree from '@/data/familysearch-sample-tree.json'
import type {
	FamilySearchCoupleRelationship,
	FamilySearchFact,
	FamilySearchMockBundle,
	FamilySearchPerson,
	FamilySearchPortraitResponse,
} from '@/lib/familysearch/types'

const familySearchMockBundle = familySearchSampleTree as FamilySearchMockBundle

export type CouplesGameQuestionKind =
	| 'whereMet'
	| 'older'
	| 'diedFirst'
	| 'children'

export type CouplesGameQuestion = {
	id: string
	kind: CouplesGameQuestionKind
	prompt: string
	answer: string
}

export type CouplesGameRound = {
	id: string
	generation: number
	husbandId: string
	wifeId: string
	husbandName: string
	wifeName: string
	husbandPortraitUrl: string | null
	wifePortraitUrl: string | null
	questions: CouplesGameQuestion[]
	relatedCoupleIds: string[]
}

const QUESTION_ORDER: Array<{
	kind: CouplesGameQuestionKind
	prompt: string
}> = [
	{ kind: 'whereMet', prompt: 'Where were they married?' },
	{ kind: 'older', prompt: 'Who was older?' },
	{ kind: 'diedFirst', prompt: 'Who died first?' },
	{ kind: 'children', prompt: 'How many children?' },
]

const getPersonName = (person: FamilySearchPerson | undefined): string => {
	return (
		person?.display?.name ||
		person?.names?.[0]?.nameForms?.[0]?.fullText ||
		person?.id ||
		'Unknown person'
	)
}

const getPortraitUrl = (
	portrait: FamilySearchPortraitResponse | undefined
): string | null => {
	const source = portrait?.sourceDescriptions?.[0]
	return source?.links?.['image-thumbnail']?.href || source?.links?.image?.href || null
}

const getFact = (
	facts: FamilySearchFact[] | undefined,
	type: string
): FamilySearchFact | null => {
	return facts?.find((fact) => fact.type === type) || null
}

const parseSortableDate = (value?: string): number | null => {
	if (!value) {
		return null
	}

	const trimmed = value.trim()
	if (!trimmed) {
		return null
	}

	if (/^\d{4}$/.test(trimmed)) {
		return Date.UTC(Number.parseInt(trimmed, 10), 0, 1)
	}

	const parsed = Date.parse(trimmed)
	return Number.isNaN(parsed) ? null : parsed
}

const getGenerationFromAscendancy = (ascendancyNumber?: string): number => {
	if (!ascendancyNumber) {
		return 1
	}

	const parsed = Number.parseInt(ascendancyNumber, 10)
	if (Number.isNaN(parsed) || parsed < 1) {
		return 1
	}

	return Math.floor(Math.log2(parsed)) + 1
}

const formatOlderAnswer = (
	husband: FamilySearchPerson,
	wife: FamilySearchPerson
): string => {
	const husbandBirth = parseSortableDate(
		getFact(husband.facts, 'http://gedcomx.org/Birth')?.date?.original
	)
	const wifeBirth = parseSortableDate(
		getFact(wife.facts, 'http://gedcomx.org/Birth')?.date?.original
	)
	const husbandName = getPersonName(husband)
	const wifeName = getPersonName(wife)

	if (husbandBirth === null || wifeBirth === null) {
		return 'Not enough birth-date information is recorded.'
	}

	if (husbandBirth === wifeBirth) {
		return 'They were the same age.'
	}

	return husbandBirth < wifeBirth ? husbandName : wifeName
}

const formatDiedFirstAnswer = (
	husband: FamilySearchPerson,
	wife: FamilySearchPerson
): string => {
	const husbandDeath = parseSortableDate(
		getFact(husband.facts, 'http://gedcomx.org/Death')?.date?.original
	)
	const wifeDeath = parseSortableDate(
		getFact(wife.facts, 'http://gedcomx.org/Death')?.date?.original
	)
	const husbandName = getPersonName(husband)
	const wifeName = getPersonName(wife)

	if (husbandDeath === null && wifeDeath === null) {
		return 'No recorded death dates'
	}

	if (husbandDeath === null) {
		return wifeName
	}

	if (wifeDeath === null) {
		return husbandName
	}

	if (husbandDeath === wifeDeath) {
		return 'Same recorded date'
	}

	return husbandDeath < wifeDeath ? husbandName : wifeName
}

const formatChildrenAnswer = (children: FamilySearchPerson[]): string => {
	if (children.length === 0) {
		return '0 children'
	}

	if (children.length === 1) {
		return `1 child`
	}

	return `${children.length} children`
}

const unique = <T,>(items: T[]): T[] => [...new Set(items)]

export const getCouplesGameRounds = (): CouplesGameRound[] => {
	const persons = familySearchMockBundle.ancestry.persons
	const relationships = familySearchMockBundle.ancestry.childAndParentsRelationships || []
	const coupleRelationships = familySearchMockBundle.ancestry.relationships || []
	const personsById = new Map(persons.map((person) => [person.id, person]))
	const relationshipByCoupleKey = new Map<string, FamilySearchCoupleRelationship>()

	for (const relationship of coupleRelationships) {
		const person1Id = relationship.person1?.resourceId
		const person2Id = relationship.person2?.resourceId

		if (person1Id && person2Id) {
			relationshipByCoupleKey.set(`${person1Id}:${person2Id}`, relationship)
		}
	}

	const findChildren = (husbandId: string, wifeId: string) => {
		return relationships
			.filter(
				(relationship) =>
					relationship.father?.resourceId === husbandId &&
					relationship.mother?.resourceId === wifeId
			)
			.map((relationship) => personsById.get(relationship.child?.resourceId || ''))
			.filter((person): person is FamilySearchPerson => Boolean(person))
	}

	const findParentCoupleId = (personId: string): string | null => {
		const relationship = relationships.find(
			(entry) => entry.child?.resourceId === personId
		)

		if (!relationship?.father?.resourceId || !relationship?.mother?.resourceId) {
			return null
		}

		const prompt = relationshipByCoupleKey.get(
			`${relationship.father.resourceId}:${relationship.mother.resourceId}`
		)

		return prompt?.id || null
	}

	const rounds = coupleRelationships
		.map((relationship) => {
			const husbandId = relationship.person1?.resourceId
			const wifeId = relationship.person2?.resourceId

			if (!husbandId || !wifeId) {
				return null
			}

			const husband = personsById.get(husbandId)
			const wife = personsById.get(wifeId)

			if (!husband || !wife) {
				return null
			}

			const marriageFact = getFact(
				relationship.facts,
				'http://gedcomx.org/Marriage'
			)
			const marriagePlace = marriageFact?.place?.original?.trim()

			if (!marriagePlace) {
				return null
			}

			const children = findChildren(husbandId, wifeId)
			const generation = Math.max(
				getGenerationFromAscendancy(husband.display?.ascendancyNumber),
				getGenerationFromAscendancy(wife.display?.ascendancyNumber)
			)

			return {
				id: relationship.id,
				generation,
				husbandId,
				wifeId,
				husbandName: getPersonName(husband),
				wifeName: getPersonName(wife),
				husbandPortraitUrl: getPortraitUrl(
					familySearchMockBundle.portraits[husbandId]
				),
				wifePortraitUrl: getPortraitUrl(
					familySearchMockBundle.portraits[wifeId]
				),
				questions: QUESTION_ORDER.map((question) => ({
					id: `${relationship.id}-${question.kind}`,
					kind: question.kind,
					prompt: question.prompt,
					answer:
						question.kind === 'whereMet'
							? marriagePlace
							: question.kind === 'older'
								? formatOlderAnswer(husband, wife)
								: question.kind === 'diedFirst'
									? formatDiedFirstAnswer(husband, wife)
									: formatChildrenAnswer(children),
				})),
				relatedCoupleIds: unique(
					[
						findParentCoupleId(husbandId),
						findParentCoupleId(wifeId),
					].filter((value): value is string => Boolean(value))
				),
			}
		})
		.filter((round): round is CouplesGameRound => Boolean(round))

	return rounds.map((round) => {
		const sameGenerationNeighborIds = rounds
			.filter(
				(candidate) =>
					candidate.id !== round.id && candidate.generation === round.generation
			)
			.map((candidate) => candidate.id)

		return {
			...round,
			relatedCoupleIds: unique([...round.relatedCoupleIds, ...sameGenerationNeighborIds]),
		}
	})
}
