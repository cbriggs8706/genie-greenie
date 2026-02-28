import { createAdminClient } from '@/lib/supabase/admin'
import { normalizeLessonsPayload } from '@/lib/learn/types'

function resolveCategorySort(
	category: string,
	fallbackSort: number,
	categorySortMap: Map<string, number>
) {
	return categorySortMap.get(category.toLowerCase()) ?? fallbackSort
}

function estimateReadingDurationSeconds(input: { title: string; description: string }) {
	const text = `${input.title} ${input.description}`.trim()
	if (!text) return 0
	const words = text.split(/\s+/).filter(Boolean).length
	if (words === 0) return 0
	return Math.max(60, Math.ceil((words / 200) * 60))
}

function getCheckpointDurationSeconds(checkpoint: {
	durationSeconds: number | null
	kind: string
	title: string
	description: string
}) {
	if (
		typeof checkpoint.durationSeconds === 'number' &&
		Number.isFinite(checkpoint.durationSeconds) &&
		checkpoint.durationSeconds > 0
	) {
		return checkpoint.durationSeconds
	}
	if (checkpoint.kind === 'video') return 0
	return estimateReadingDurationSeconds({
		title: checkpoint.title,
		description: checkpoint.description,
	})
}

export async function getPublicMicroskills() {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskills')
		.select(
			'id,slug,name,description,skill_level,category,url,current_version,updated_at,is_public,category_sort,skill_sort'
		)
		.eq('is_public', true)
		.order('skill_sort', { ascending: true })

	if (error) {
		throw new Error(`Unable to load microskills: ${error.message}`)
	}

	const { data: categories } = await admin
		.from('microskill_categories')
		.select('name,sort_order')
		.order('sort_order', { ascending: true })

	const categorySortMap = new Map<string, number>()
	for (const category of categories ?? []) {
		categorySortMap.set(category.name.toLowerCase(), category.sort_order)
	}

	return (data ?? [])
		.sort(
			(a, b) =>
				resolveCategorySort(a.category, a.category_sort, categorySortMap) -
					resolveCategorySort(b.category, b.category_sort, categorySortMap) ||
				a.skill_sort - b.skill_sort ||
				a.name.localeCompare(b.name)
		)
		.map((row) => ({
			id: row.id,
			slug: row.slug,
			title: row.name,
			description: row.description,
			skillLevel: row.skill_level,
			category: row.category,
			url: row.url,
			currentVersion: row.current_version,
			updatedAt: row.updated_at,
		}))
}

export async function getMicroskillsForCatalog() {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskills')
		.select(
			'id,slug,name,description,skill_level,category,url,current_version,updated_at,is_public,category_sort,skill_sort,lessons'
		)
		.order('skill_sort', { ascending: true })

	if (error) {
		throw new Error(`Unable to load microskills: ${error.message}`)
	}

	const { data: categories } = await admin
		.from('microskill_categories')
		.select('name,sort_order')
		.order('sort_order', { ascending: true })

	const categorySortMap = new Map<string, number>()
	for (const category of categories ?? []) {
		categorySortMap.set(category.name.toLowerCase(), category.sort_order)
	}

	return (data ?? [])
		.sort(
			(a, b) =>
				resolveCategorySort(a.category, a.category_sort, categorySortMap) -
					resolveCategorySort(b.category, b.category_sort, categorySortMap) ||
				a.skill_sort - b.skill_sort ||
				a.name.localeCompare(b.name)
		)
		.map((row) => {
			const lessons = normalizeLessonsPayload(row.lessons)
			const totalSeconds = lessons.sections.reduce(
				(sectionTotal, section) =>
					sectionTotal +
					section.checkpoints.reduce(
						(checkpointTotal, checkpoint) =>
							checkpointTotal + getCheckpointDurationSeconds(checkpoint),
						0
					),
				0
			)
			const estimatedDurationMinutes = Math.max(1, Math.ceil(totalSeconds / 60))

			return {
				id: row.id,
				slug: row.slug,
				title: row.name,
				description: row.description,
				skillLevel: row.skill_level,
				category: row.category,
				url: row.url,
				currentVersion: row.current_version,
				isPublic: row.is_public,
				updatedAt: row.updated_at,
				estimatedDurationMinutes,
			}
		})
}

export async function getPublicMicroskillBySlug(slug: string) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskills')
		.select(
			'id,slug,name,description,skill_level,category,url,current_version,lessons,is_public'
		)
		.eq('slug', slug)
		.eq('is_public', true)
		.limit(1)
		.maybeSingle()

	if (error) {
		throw new Error(`Unable to load microskill: ${error.message}`)
	}

	if (!data) return null

	const lessons = normalizeLessonsPayload(data.lessons)

	return {
		id: data.id,
		slug: data.slug,
		title: data.name,
		description: data.description,
		skillLevel: data.skill_level,
		category: data.category,
		url: data.url,
		currentVersion: data.current_version,
		versionTitle: lessons.versionTitle,
		sections: lessons.sections,
	}
}
