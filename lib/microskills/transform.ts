import type { MicroSkillsList, Skills } from '@/data/microskills'

export type MicroskillRow = {
	id?: number
	category: string
	category_sort: number
	name: string
	skill_level: string
	description: string
	url: string
	time: string[] | null
	skill_sort: number
}

export const isMicroSkillsList = (value: unknown): value is MicroSkillsList[] => {
	if (!Array.isArray(value)) {
		return false
	}

	return value.every((category) => {
		if (typeof category !== 'object' || category === null) {
			return false
		}

		const maybeCategory = category as Record<string, unknown>
		if (
			typeof maybeCategory.category !== 'string' ||
			!Array.isArray(maybeCategory.skills)
		) {
			return false
		}

		return maybeCategory.skills.every((skill) => {
			if (typeof skill !== 'object' || skill === null) {
				return false
			}

			const maybeSkill = skill as Record<string, unknown>
			const validTime =
				maybeSkill.time === undefined ||
				(Array.isArray(maybeSkill.time) &&
					maybeSkill.time.every((item) => typeof item === 'string'))

			return (
				typeof maybeSkill.url === 'string' &&
				typeof maybeSkill.name === 'string' &&
				typeof maybeSkill.skillLevel === 'string' &&
				typeof maybeSkill.description === 'string' &&
				validTime
			)
		})
	})
}

export function listToRows(list: MicroSkillsList[]): MicroskillRow[] {
	return list.flatMap((category, categoryIndex) =>
		category.skills.map((skill, skillIndex) => ({
			category: category.category,
			category_sort: categoryIndex,
			name: skill.name,
			skill_level: skill.skillLevel,
			description: skill.description,
			url: skill.url,
			time: skill.time ?? null,
			skill_sort: skillIndex,
		}))
	)
}

export function rowsToList(rows: MicroskillRow[]): MicroSkillsList[] {
	const categoryMap = new Map<
		string,
		{ category: string; categorySort: number; skills: Skills[] }
	>()

	for (const row of rows) {
		const existing = categoryMap.get(row.category)
		const skill = {
			url: row.url,
			name: row.name,
			skillLevel: row.skill_level,
			description: row.description,
			...(row.time ? { time: row.time } : {}),
		}

		if (existing) {
			existing.skills.push(skill)
			continue
		}

		categoryMap.set(row.category, {
			category: row.category,
			categorySort: row.category_sort,
			skills: [skill],
		})
	}

	return Array.from(categoryMap.values())
		.sort((a, b) => a.categorySort - b.categorySort)
		.map((entry) => ({
			category: entry.category,
			skills: entry.skills,
		}))
}
