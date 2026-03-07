export type TimelineGameEvent = {
	id: number
	year: number
	event: string
	sortOrder: number
}

export type TimelineGame = {
	id: number
	title: string
	slug: string
	description: string
	sourcePrompt: string | null
	isPublished: boolean
	createdAt: string
	updatedAt: string
	events: TimelineGameEvent[]
}

export type TimelineGameListItem = Pick<
	TimelineGame,
	'id' | 'title' | 'slug' | 'description' | 'isPublished' | 'updatedAt'
> & {
	eventCount: number
}

export type TimelineGameMutationInput = {
	title: string
	slug: string
	description: string
	sourcePrompt: string | null
	isPublished: boolean
	events: Array<{
		year: number
		event: string
	}>
}

export function slugifyTimelineGame(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function normalizeTimelineEvents(input: unknown) {
	if (!Array.isArray(input)) return []

	return input
		.map((entry) => {
			const event = typeof entry === 'object' && entry ? entry : null
			const yearValue = event && 'year' in event ? event.year : null
			const year = typeof yearValue === 'number' ? yearValue : Number(yearValue)
			const eventText =
				event && 'event' in event && typeof event.event === 'string'
					? event.event.trim()
					: ''

			if (!Number.isInteger(year) || !eventText) {
				return null
			}

			return {
				year,
				event: eventText,
			}
		})
		.filter((entry): entry is { year: number; event: string } => entry !== null)
}

export function validateTimelineGameInput(input: TimelineGameMutationInput) {
	if (!input.title.trim()) return 'Title is required.'
	if (!input.slug.trim()) return 'Slug is required.'
	if (input.events.length < 3) return 'Add at least 3 events.'
	if (input.events.some((entry) => !Number.isInteger(entry.year))) {
		return 'Every event needs a whole-number year.'
	}
	if (input.events.some((entry) => !entry.event.trim())) {
		return 'Every event needs an event description.'
	}
	return null
}
