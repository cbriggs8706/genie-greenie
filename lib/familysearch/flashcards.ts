import familySearchSampleTree from '@/data/familysearch-sample-tree.json'
import type {
	FamilyFlashcard,
	FamilyFlashcardSettings,
	FamilySearchAncestryResponse,
	FamilySearchFactType,
	FamilySearchFlashcardField,
	FamilySearchMockBundle,
	FamilySearchPerson,
	FamilySearchPortraitResponse,
} from '@/lib/familysearch/types'

const familySearchMockBundle = familySearchSampleTree as FamilySearchMockBundle
const FAMILYSEARCH_SAMPLE_PID = familySearchMockBundle.pid

export const familyFlashcardFieldLabels: Record<
	FamilySearchFlashcardField,
	string
> = {
	photo: 'Photo',
	fullName: 'Full name',
	relationship: 'Relationship',
	birth: 'Birth',
	death: 'Death',
	birthPlace: 'Birth place',
	deathPlace: 'Death place',
}

export const defaultFamilyFlashcardSettings: FamilyFlashcardSettings = {
	pid: FAMILYSEARCH_SAMPLE_PID,
	generations: 4,
	frontFields: ['photo'],
	backFields: ['relationship', 'fullName'],
}

const relationshipByGeneration: Record<number, { male: string; female: string }> = {
	1: { male: 'Self', female: 'Self' },
	2: { male: 'Father', female: 'Mother' },
	3: { male: 'Grandfather', female: 'Grandmother' },
	4: { male: 'Great-Grandfather', female: 'Great-Grandmother' },
	5: {
		male: '2nd Great-Grandfather',
		female: '2nd Great-Grandmother',
	},
	6: {
		male: '3rd Great-Grandfather',
		female: '3rd Great-Grandmother',
	},
	7: {
		male: '4th Great-Grandfather',
		female: '4th Great-Grandmother',
	},
	8: {
		male: '5th Great-Grandfather',
		female: '5th Great-Grandmother',
	},
}

const getFact = (
	person: FamilySearchPerson,
	type: FamilySearchFactType
): { date: string; place: string } => {
	const fact = person.facts?.find((entry) => entry.type === type)

	return {
		date: fact?.date?.original || '',
		place: fact?.place?.original || '',
	}
}

const getPersonName = (person: FamilySearchPerson): string => {
	return (
		person.display?.name ||
		person.names?.[0]?.nameForms?.[0]?.fullText ||
		person.id
	)
}

const getPersonGender = (person: FamilySearchPerson): 'male' | 'female' | 'unknown' => {
	if (person.gender?.type === 'http://gedcomx.org/Male') {
		return 'male'
	}

	if (person.gender?.type === 'http://gedcomx.org/Female') {
		return 'female'
	}

	return 'unknown'
}

const getGenerationFromAscendancy = (ascendancyNumber?: string): number => {
	if (!ascendancyNumber) {
		return 1
	}

	const ahnentafelNumber = Number.parseInt(ascendancyNumber, 10)

	if (Number.isNaN(ahnentafelNumber) || ahnentafelNumber < 1) {
		return 1
	}

	return Math.floor(Math.log2(ahnentafelNumber)) + 1
}

const getRelationshipLabel = (person: FamilySearchPerson): string => {
	const generation = getGenerationFromAscendancy(person.display?.ascendancyNumber)
	const relationship = relationshipByGeneration[generation]

	if (!relationship) {
		return 'Ancestor'
	}

	const gender = getPersonGender(person)

	if (gender === 'male') {
		return relationship.male
	}

	if (gender === 'female') {
		return relationship.female
	}

	return generation === 1 ? 'Self' : 'Ancestor'
}

const getPortraitUrl = (
	portrait: FamilySearchPortraitResponse | undefined
): string | null => {
	const source = portrait?.sourceDescriptions?.[0]

	return source?.links?.['image-thumbnail']?.href || source?.links?.image?.href || null
}

const toFlashcard = (
	person: FamilySearchPerson,
	portrait: FamilySearchPortraitResponse | undefined
): FamilyFlashcard => {
	const birth = getFact(person, 'http://gedcomx.org/Birth')
	const death = getFact(person, 'http://gedcomx.org/Death')
	const relationship = getRelationshipLabel(person)
	const generation = getGenerationFromAscendancy(person.display?.ascendancyNumber)

	return {
		personId: person.id,
		name: getPersonName(person),
		relationship,
		generation,
		ascendancyNumber: person.display?.ascendancyNumber || '-',
		portraitUrl: getPortraitUrl(portrait),
		fields: {
			fullName: getPersonName(person) || '-',
			relationship: relationship || '-',
			birth: person.display?.birthDate || birth.date || '-',
			death: person.display?.deathDate || death.date || '-',
			birthPlace: person.display?.birthPlace || birth.place || '-',
			deathPlace: person.display?.deathPlace || death.place || '-',
		},
	}
}

export const getFamilySearchMockBundle = () => {
	return familySearchMockBundle
}

export const buildFamilyFlashcards = ({
	ancestry,
	portraits,
	settings,
}: {
	ancestry: FamilySearchAncestryResponse
	portraits: Record<string, FamilySearchPortraitResponse>
	settings: FamilyFlashcardSettings
}): FamilyFlashcard[] => {
	return ancestry.persons
		.filter((person) => {
			const generation = getGenerationFromAscendancy(person.display?.ascendancyNumber)
			return generation <= settings.generations
		})
		.sort((left, right) => {
			const leftAsc = Number.parseInt(left.display?.ascendancyNumber || '0', 10)
			const rightAsc = Number.parseInt(right.display?.ascendancyNumber || '0', 10)
			return leftAsc - rightAsc
		})
		.map((person) => toFlashcard(person, portraits[person.id]))
}
