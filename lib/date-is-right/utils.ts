const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const DATE_IS_RIGHT_YEAR_PADDING = 5

const PROFANITY_EXACT = new Set([
	'anal',
	'asshole',
	'bastard',
	'bitch',
	'cock',
	'cunt',
	'dick',
	'fuck',
	'motherfucker',
	'nigga',
	'nigger',
	'pussy',
	'shit',
	'slut',
	'whore',
])

const PROFANITY_CONTAINS = [
	'fuck',
	'shit',
	'cunt',
	'nigger',
	'nigga',
	'asshole',
	'motherfucker',
]

export function createRoomCode(length = 6) {
	let output = ''
	for (let index = 0; index < length; index += 1) {
		const charIndex = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)
		output += ROOM_CODE_ALPHABET.charAt(charIndex)
	}
	return output
}

function normalizeNickname(value: string) {
	return value
		.toLowerCase()
		.replace(/[@4]/g, 'a')
		.replace(/[!1|]/g, 'i')
		.replace(/[3]/g, 'e')
		.replace(/[0]/g, 'o')
		.replace(/[5$]/g, 's')
		.replace(/[7]/g, 't')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
}

export function containsProfanity(value: string) {
	const normalized = normalizeNickname(value)
	if (!normalized) return false

	const compact = normalized.replace(/\s+/g, '')
	if (PROFANITY_CONTAINS.some((word) => compact.includes(word))) {
		return true
	}

	return normalized.split(/\s+/).some((token) => PROFANITY_EXACT.has(token))
}

export function sanitizeNickname(value: string) {
	return value.replace(/\s+/g, ' ').trim().slice(0, 24)
}

export function scoreGuess(guessYear: number, answerYear: number) {
	if (guessYear > answerYear) {
		return {
			diff: guessYear - answerYear,
			wentOver: true,
			score: 0,
		}
	}

	const diff = answerYear - guessYear
	return {
		diff,
		wentOver: false,
		score: Math.max(1, 100 - diff),
	}
}

export function getGuessYearBounds(years: number[]) {
	return {
		minYear: Math.min(...years) - DATE_IS_RIGHT_YEAR_PADDING,
		maxYear: Math.max(...years) + DATE_IS_RIGHT_YEAR_PADDING,
	}
}

export function getInitialGuessYear(answerYear: number, minYear: number, maxYear: number) {
	const options: number[] = []

	for (let year = minYear; year <= maxYear; year += 1) {
		if (year !== answerYear) {
			options.push(year)
		}
	}

	if (options.length === 0) {
		return answerYear
	}

	const randomIndex = Math.floor(Math.random() * options.length)
	return options[randomIndex]
}
