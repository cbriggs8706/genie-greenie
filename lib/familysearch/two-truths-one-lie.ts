import familySearchSampleTree from '@/data/familysearch-sample-tree.json'
import type {
	FamilySearchFactType,
	FamilySearchMockBundle,
	FamilySearchPerson,
	FamilySearchPortraitResponse,
	FamilySearchTwoTruthsOneLieStatement,
} from '@/lib/familysearch/types'

const familySearchMockBundle = familySearchSampleTree as FamilySearchMockBundle

type AdjacentRelationship = 'parent' | 'child' | 'sibling'

type CandidateStatement = FamilySearchTwoTruthsOneLieStatement & {
	priority: number
}

export type TwoTruthsOneLieStatement = FamilySearchTwoTruthsOneLieStatement

export type TwoTruthsOneLieRound = {
	id: string
	title: string
	prompt: string
	description: string
	personId: string
	personName: string
	personPortraitUrl: string | null
	generation: number
	adjacentPersonId: string
	adjacentPersonName: string
	adjacentRelationship: AdjacentRelationship
	statements: TwoTruthsOneLieStatement[]
	lieStatementId: string
}

const getPortraitUrl = (
	portrait: FamilySearchPortraitResponse | undefined
): string | null => {
	const source = portrait?.sourceDescriptions?.[0]

	return source?.links?.['image-thumbnail']?.href || source?.links?.image?.href || null
}

const getPersonName = (person: FamilySearchPerson | undefined): string => {
	if (!person) {
		return 'Unknown ancestor'
	}

	return person.display?.name || person.names?.[0]?.nameForms?.[0]?.fullText || person.id
}

const getGeneration = (person: FamilySearchPerson): number => {
	const ascendancyNumber = person.display?.ascendancyNumber

	if (!ascendancyNumber) {
		return 1
	}

	const numericAscendancy = Number.parseInt(ascendancyNumber, 10)
	if (!Number.isFinite(numericAscendancy) || numericAscendancy < 1) {
		return 1
	}

	return Math.floor(Math.log2(numericAscendancy)) + 1
}

const getAscendancyNumber = (person: FamilySearchPerson): number => {
	const value = Number.parseInt(person.display?.ascendancyNumber || '0', 10)
	return Number.isFinite(value) ? value : 0
}

const buildStatementText = (
	person: FamilySearchPerson,
	factType: FamilySearchFactType | string,
	date?: string,
	place?: string,
	value?: string
): string | null => {
	if (factType === 'http://gedcomx.org/Birth') {
		if (date && place) {
			return `Born ${date} in ${place}.`
		}
		if (date) {
			return `Born ${date}.`
		}
		if (place) {
			return `Born in ${place}.`
		}
	}

	if (factType === 'http://gedcomx.org/Death') {
		if (date && place) {
			return `Died ${date} in ${place}.`
		}
		if (date) {
			return `Died ${date}.`
		}
		if (place) {
			return `Died in ${place}.`
		}
	}

	if (factType === 'http://gedcomx.org/Occupation' && value) {
		return `Worked as a ${value}.`
	}

	const birthDate = person.display?.birthDate
	const birthPlace = person.display?.birthPlace
	if (!date && !place && factType === 'http://gedcomx.org/Birth' && (birthDate || birthPlace)) {
		return buildStatementText(person, factType, birthDate, birthPlace)
	}

	const deathDate = person.display?.deathDate
	const deathPlace = person.display?.deathPlace
	if (!date && !place && factType === 'http://gedcomx.org/Death' && (deathDate || deathPlace)) {
		return buildStatementText(person, factType, deathDate, deathPlace)
	}

	return null
}

const getCandidateStatements = (
	person: FamilySearchPerson,
	kind: 'truth' | 'lie'
): CandidateStatement[] => {
	const facts = person.facts || []
	const candidates: CandidateStatement[] = []
	const seenTexts = new Set<string>()

	for (const fact of facts) {
		const factType = fact.type || ''
		const text = buildStatementText(
			person,
			factType,
			fact.date?.original,
			fact.place?.original,
			fact.value
		)

		if (!text || seenTexts.has(text)) {
			continue
		}

		seenTexts.add(text)
		candidates.push({
			id: `${person.id}-${factType.split('/').pop()?.toLowerCase() || 'fact'}-${candidates.length + 1}`,
			text,
			personId: person.id,
			kind,
			factType,
			priority:
				factType === 'http://gedcomx.org/Birth'
					? 1
					: factType === 'http://gedcomx.org/Occupation'
						? 2
						: factType === 'http://gedcomx.org/Death'
							? 3
							: 4,
		})
	}

	return candidates.sort((left, right) => left.priority - right.priority)
}

const getAdjacentPeople = (
	personId: string,
	peopleById: Map<string, FamilySearchPerson>
): Array<{ person: FamilySearchPerson; relationship: AdjacentRelationship }> => {
	const relationships = familySearchMockBundle.ancestry.childAndParentsRelationships || []
	const matches: Array<{ person: FamilySearchPerson; relationship: AdjacentRelationship }> = []
	const seen = new Set<string>()

	for (const relationship of relationships) {
		const childId = relationship.child?.resourceId
		const fatherId = relationship.father?.resourceId
		const motherId = relationship.mother?.resourceId

		if (childId === personId) {
			for (const candidateId of [fatherId, motherId]) {
				if (!candidateId || seen.has(`parent:${candidateId}`)) {
					continue
				}

				const person = peopleById.get(candidateId)
				if (!person) {
					continue
				}

				seen.add(`parent:${candidateId}`)
				matches.push({ person, relationship: 'parent' })
			}
		}

		if (fatherId === personId || motherId === personId) {
			if (childId && !seen.has(`child:${childId}`)) {
				const person = peopleById.get(childId)
				if (person) {
					seen.add(`child:${childId}`)
					matches.push({ person, relationship: 'child' })
				}
			}

			for (const siblingId of [fatherId === personId ? motherId : fatherId]) {
				void siblingId
			}
		}
	}

	for (const relationship of relationships) {
		const childId = relationship.child?.resourceId
		const fatherId = relationship.father?.resourceId
		const motherId = relationship.mother?.resourceId

		const isDirectRelative =
			childId === personId || fatherId === personId || motherId === personId

		if (isDirectRelative || !childId) {
			continue
		}

		const sharesParent = relationships.some((candidate) => {
			if (candidate.child?.resourceId !== personId) {
				return false
			}

			return (
				(candidate.father?.resourceId &&
					candidate.father.resourceId === fatherId &&
					fatherId) ||
				(candidate.mother?.resourceId &&
					candidate.mother.resourceId === motherId &&
					motherId)
			)
		})

		if (!sharesParent || seen.has(`sibling:${childId}`)) {
			continue
		}

		const sibling = peopleById.get(childId)
		if (!sibling) {
			continue
		}

		seen.add(`sibling:${childId}`)
		matches.push({ person: sibling, relationship: 'sibling' })
	}

	return matches.sort((left, right) => {
		const relationshipOrder = { parent: 1, child: 2, sibling: 3 }
		if (relationshipOrder[left.relationship] !== relationshipOrder[right.relationship]) {
			return relationshipOrder[left.relationship] - relationshipOrder[right.relationship]
		}

		return getAscendancyNumber(left.person) - getAscendancyNumber(right.person)
	})
}

const buildRound = (
	person: FamilySearchPerson,
	peopleById: Map<string, FamilySearchPerson>
): TwoTruthsOneLieRound | null => {
	const truths = getCandidateStatements(person, 'truth')
	if (truths.length < 2) {
		return null
	}

	const adjacentCandidates = getAdjacentPeople(person.id, peopleById)
	for (const adjacentCandidate of adjacentCandidates) {
		const lies = getCandidateStatements(adjacentCandidate.person, 'lie')
		const selectedLie = lies.find(
			(statement) => !truths.some((truth) => truth.text === statement.text)
		)

		if (!selectedLie) {
			continue
		}

		const selectedTruths = truths.slice(0, 2).map((statement, index) => ({
			...statement,
			id: `${person.id}-truth-${index + 1}`,
		}))
		const lieStatement = {
			...selectedLie,
			id: `${person.id}-lie-1`,
		}

		return {
			id: `${person.id}-two-truths-one-lie`,
			title: 'FamilySearch fact check',
			prompt: 'Which statement is the lie?',
			description: `Two facts belong to ${getPersonName(person)}. One fact actually belongs to ${getPersonName(adjacentCandidate.person)}, this ancestor's ${adjacentCandidate.relationship}.`,
			personId: person.id,
			personName: getPersonName(person),
			personPortraitUrl: getPortraitUrl(familySearchMockBundle.portraits[person.id]),
			generation: getGeneration(person),
			adjacentPersonId: adjacentCandidate.person.id,
			adjacentPersonName: getPersonName(adjacentCandidate.person),
			adjacentRelationship: adjacentCandidate.relationship,
			statements: [...selectedTruths, lieStatement],
			lieStatementId: lieStatement.id,
		}
	}

	return null
}

export const getTwoTruthsOneLieRounds = (): TwoTruthsOneLieRound[] => {
	const people: FamilySearchPerson[] = familySearchMockBundle.ancestry.persons
	const peopleById = new Map<string, FamilySearchPerson>(
		people.map((person) => [person.id, person])
	)

	return people
		.filter((person) => getGeneration(person) >= 2)
		.sort((left, right) => getAscendancyNumber(left) - getAscendancyNumber(right))
		.map((person) => buildRound(person, peopleById))
		.filter((round): round is TwoTruthsOneLieRound => Boolean(round))
}
