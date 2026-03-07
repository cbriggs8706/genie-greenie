import familySearchSampleTree from '@/data/familysearch-sample-tree.json'
import type {
	FamilySearchMockBundle,
	FamilySearchPortraitResponse,
	FamilySearchSurveyPrompt,
} from '@/lib/familysearch/types'

const familySearchMockBundle = familySearchSampleTree as FamilySearchMockBundle

export type AncestorFeudAnswer = {
	id: string
	label: string
	normalized: string
	count: number
	personIds: string[]
	portraitUrls: string[]
	aliases: string[]
}

export type AncestorFeudRound = {
	id: string
	title: string
	prompt: string
	description: string
	answerLimit: number
	skillsLearned: string[]
	source: FamilySearchSurveyPrompt['source']
	answers: AncestorFeudAnswer[]
	totalPoints: number
}

export type AncestorFeudGuessScore = {
	isMatch: boolean
	score: number
	matchedAnswerId: string | null
	matchedLabel: string | null
	portraitUrls: string[]
}

const normalizeGuess = (value: string) =>
	value
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

const getPortraitUrl = (
	portrait: FamilySearchPortraitResponse | undefined
): string | null => {
	const source = portrait?.sourceDescriptions?.[0]

	return source?.links?.['image-thumbnail']?.href || source?.links?.image?.href || null
}

const toAnswer = (
	promptId: string,
	answerIndex: number,
	answer: FamilySearchSurveyPrompt['sampleAnswers'][number],
	portraits: FamilySearchMockBundle['portraits']
): AncestorFeudAnswer => {
	const portraitUrls = answer.personIds
		.map((personId) => getPortraitUrl(portraits[personId]))
		.filter((portraitUrl): portraitUrl is string => Boolean(portraitUrl))

	return {
		id: `${promptId}-${answerIndex + 1}`,
		label: answer.answer,
		normalized: normalizeGuess(answer.answer),
		count: answer.count,
		personIds: answer.personIds,
		portraitUrls,
		aliases: (answer.aliases || []).map(normalizeGuess),
	}
}

export const getAncestorFeudRounds = (): AncestorFeudRound[] => {
	return familySearchMockBundle.insights.surveyPrompts.map((prompt) => {
		const answers = prompt.sampleAnswers
			.map((answer, index) =>
				toAnswer(prompt.id, index, answer, familySearchMockBundle.portraits)
			)
			.sort((left, right) => {
				if (right.count !== left.count) {
					return right.count - left.count
				}

				return left.label.localeCompare(right.label)
			})
			.slice(0, prompt.answerLimit)

		return {
			id: prompt.id,
			title: prompt.title,
			prompt: prompt.prompt,
			description: prompt.description,
			answerLimit: prompt.answerLimit,
			skillsLearned: prompt.skillsLearned,
			source: prompt.source,
			totalPoints: answers.reduce((sum, answer) => sum + answer.count, 0),
			answers,
		}
	})
}

export const findAncestorFeudAnswer = (
	round: AncestorFeudRound,
	guess: string,
	guessedAnswerIds: string[]
): AncestorFeudAnswer | null => {
	const normalizedGuess = normalizeGuess(guess)
	if (!normalizedGuess) {
		return null
	}

	return (
		round.answers.find((answer) => {
			if (guessedAnswerIds.includes(answer.id)) {
				return false
			}

			if (answer.normalized === normalizedGuess) {
				return true
			}

			if (answer.aliases.includes(normalizedGuess)) {
				return true
			}

			return normalizedGuess.includes(answer.normalized) || answer.normalized.includes(normalizedGuess)
		}) || null
	)
}

export const scoreAncestorFeudGuess = (
	round: AncestorFeudRound,
	guess: string
): AncestorFeudGuessScore => {
	const match = findAncestorFeudAnswer(round, guess, [])

	if (!match) {
		return {
			isMatch: false,
			score: 0,
			matchedAnswerId: null,
			matchedLabel: null,
			portraitUrls: [],
		}
	}

	return {
		isMatch: true,
		score: match.count,
		matchedAnswerId: match.id,
		matchedLabel: match.label,
		portraitUrls: match.portraitUrls,
	}
}
