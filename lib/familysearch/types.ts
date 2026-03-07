export type FamilySearchFactType =
	| 'http://gedcomx.org/Birth'
	| 'http://gedcomx.org/Death'
	| 'http://gedcomx.org/Occupation'

export type FamilySearchGenderType =
	| 'http://gedcomx.org/Male'
	| 'http://gedcomx.org/Female'
	| 'http://gedcomx.org/Unknown'

export type FamilySearchResourceReference = {
	resource: string
	resourceId?: string
}

export type FamilySearchFact = {
	id?: string
	type?: FamilySearchFactType | string
	value?: string
	date?: {
		original?: string
	}
	place?: {
		original?: string
	}
}

export type FamilySearchPerson = {
	id: string
	identifiers?: Record<string, string[]>
	living?: boolean
	gender?: {
		type?: FamilySearchGenderType
	}
	names?: Array<{
		nameForms?: Array<{
			fullText?: string
		}>
	}>
	facts?: FamilySearchFact[]
	display?: {
		name?: string
		lifespan?: string
		gender?: string
		birthDate?: string
		birthPlace?: string
		deathDate?: string
		deathPlace?: string
		ascendancyNumber?: string
	}
}

export type FamilySearchChildAndParentsRelationship = {
	id: string
	child?: FamilySearchResourceReference
	father?: FamilySearchResourceReference
	mother?: FamilySearchResourceReference
}

export type FamilySearchCoupleRelationship = {
	id: string
	type?: string
	person1?: FamilySearchResourceReference
	person2?: FamilySearchResourceReference
	facts?: FamilySearchFact[]
}

export type FamilySearchAncestryResponse = {
	description?: string
	persons: FamilySearchPerson[]
	childAndParentsRelationships?: FamilySearchChildAndParentsRelationship[]
	relationships?: FamilySearchCoupleRelationship[]
	links?: {
		self?: {
			href: string
		}
	}
}

export type FamilySearchPortraitResponse = {
	personId: string
	sourceDescriptions?: Array<{
		id: string
		titles?: Array<{
			value?: string
		}>
		about?: string
		resourceType?: string
		links?: {
			'image-thumbnail'?: {
				href: string
			}
			image?: {
				href: string
			}
		}
	}>
}

export type FamilySearchSurveyAnswer = {
	answer: string
	count: number
	personIds: string[]
	aliases?: string[]
}

export type FamilySearchSurveyPrompt = {
	id: string
	title: string
	prompt: string
	description: string
	answerLimit: number
	skillsLearned: string[]
	source: {
		endpoint: string
		photoPath: string
		derivedFrom: Array<{
			path: string
			matchType?: string
			field?: string
			transform?: string
			note?: string
		}>
	}
	sampleAnswers: FamilySearchSurveyAnswer[]
}

export type FamilySearchTwoTruthsOneLieStatement = {
	id: string
	text: string
	personId: string
	kind: 'truth' | 'lie'
	factType?: FamilySearchFactType | string
}

export type FamilySearchTwoTruthsOneLiePrompt = {
	id: string
	personId: string
	adjacentPersonId: string
	adjacentRelationship: 'parent' | 'child' | 'sibling'
	title: string
	prompt: string
	description: string
	source: {
		endpoint: string
		photoPath: string
		derivedFrom: Array<{
			path: string
			matchType?: string
			field?: string
			transform?: string
			note?: string
		}>
	}
	statements: FamilySearchTwoTruthsOneLieStatement[]
}

export type FamilySearchInsights = {
	description?: string
	surveyPrompts: FamilySearchSurveyPrompt[]
	twoTruthsOneLiePrompts?: FamilySearchTwoTruthsOneLiePrompt[]
}

export type FamilySearchFlashcardField =
	| 'photo'
	| 'fullName'
	| 'relationship'
	| 'birth'
	| 'death'
	| 'birthPlace'
	| 'deathPlace'

export type FamilyFlashcardSettings = {
	pid: string
	generations: number
	frontFields: FamilySearchFlashcardField[]
	backFields: FamilySearchFlashcardField[]
}

export type FamilyFlashcard = {
	personId: string
	name: string
	relationship: string
	generation: number
	ascendancyNumber: string
	portraitUrl: string | null
	fields: Record<Exclude<FamilySearchFlashcardField, 'photo'>, string>
}

export type FamilySearchMockBundle = {
	pid: string
	ancestry: FamilySearchAncestryResponse
	portraits: Record<string, FamilySearchPortraitResponse>
	insights: FamilySearchInsights
}
