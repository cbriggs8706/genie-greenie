export type LessonCheckpoint = {
	id: string
	title: string
	description: string
	kind: 'video' | 'quiz' | 'article' | 'exercise' | 'download' | 'external'
	sortOrder: number
	isRequired: boolean
	manualCompletion: boolean
	quizPassPercent: number | null
	resourceUrl: string | null
	durationSeconds: number | null
}

export type LessonSection = {
	id: string
	sectionKey: 'learn' | 'practice'
	title: string
	sortOrder: number
	checkpoints: LessonCheckpoint[]
}

export type LessonsPayload = {
	versionTitle: string | null
	sections: LessonSection[]
}

const defaultLessons: LessonsPayload = {
	versionTitle: null,
	sections: [],
}

const checkpointKinds = new Set([
	'video',
	'quiz',
	'article',
	'exercise',
	'download',
	'external',
])

function toString(value: unknown, fallback: string) {
	return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function toNumber(value: unknown, fallback: number) {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function toPositiveNumberOrNull(value: unknown) {
	if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null
	return Math.ceil(Number(value))
}

function estimateReadingDurationSeconds(input: { title: string; description: string }) {
	const text = `${input.title} ${input.description}`.trim()
	if (!text) return null
	const words = text.split(/\s+/).filter(Boolean).length
	if (words === 0) return null
	const wordsPerMinute = 200
	return Math.max(60, Math.ceil((words / wordsPerMinute) * 60))
}

export function normalizeLessonsPayload(input: unknown): LessonsPayload {
	if (!input || typeof input !== 'object') {
		return defaultLessons
	}

	const root = input as Record<string, unknown>
	const sectionsRaw = Array.isArray(root.sections) ? root.sections : []

	const sections = sectionsRaw
		.map((section, sectionIndex) => {
			if (!section || typeof section !== 'object') return null
			const s = section as Record<string, unknown>
			const checkpointsRaw = Array.isArray(s.checkpoints) ? s.checkpoints : []

			const checkpoints = checkpointsRaw
				.map((checkpoint, checkpointIndex) => {
					if (!checkpoint || typeof checkpoint !== 'object') return null
					const c = checkpoint as Record<string, unknown>
					const kind = typeof c.kind === 'string' ? c.kind : 'video'

					return {
						id: toString(c.id, `cp_${sectionIndex + 1}_${checkpointIndex + 1}`),
						title: toString(c.title, 'Untitled checkpoint'),
						description: toString(c.description, ''),
						kind: checkpointKinds.has(kind) ? (kind as LessonCheckpoint['kind']) : 'video',
						sortOrder: toNumber(c.sortOrder, checkpointIndex + 1),
						isRequired: c.isRequired !== false,
						manualCompletion: c.manualCompletion !== false,
						quizPassPercent:
							typeof c.quizPassPercent === 'number' ? c.quizPassPercent : null,
						resourceUrl:
							typeof c.resourceUrl === 'string' && c.resourceUrl.length > 0
								? c.resourceUrl
								: null,
						durationSeconds:
							toPositiveNumberOrNull(c.durationSeconds) ??
							(typeof c.durationMinutes === 'number' && Number.isFinite(c.durationMinutes)
								? Math.max(60, Math.ceil(c.durationMinutes * 60))
								: null) ??
							(kind === 'video'
								? null
								: estimateReadingDurationSeconds({
										title: toString(c.title, 'Untitled checkpoint'),
										description: toString(c.description, ''),
								  })),
					}
				})
				.filter((checkpoint): checkpoint is LessonCheckpoint => checkpoint !== null)
				.sort((a, b) => a.sortOrder - b.sortOrder)

			return {
				id: toString(s.id, `sec_${sectionIndex + 1}`),
				sectionKey: s.sectionKey === 'practice' ? 'practice' : 'learn',
				title: toString(s.title, s.sectionKey === 'practice' ? 'Practice' : 'Learn'),
				sortOrder: toNumber(s.sortOrder, sectionIndex + 1),
				checkpoints,
			}
		})
		.filter((section): section is LessonSection => section !== null)
		.sort((a, b) => a.sortOrder - b.sortOrder)

	return {
		versionTitle:
			typeof root.versionTitle === 'string' ? root.versionTitle : defaultLessons.versionTitle,
		sections,
	}
}
