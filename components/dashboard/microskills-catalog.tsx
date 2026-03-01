'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type MicroskillListItem = {
	id: number
	name: string
	slug: string
	category: string
	category_sort: number
	skill_level: string
	skill_sort: number
	description: string
	is_public: boolean
}

type CategoryItem = {
	id: number | null
	name: string
	sort_order: number
}

export default function MicroskillsCatalog() {
	const [microskills, setMicroskills] = useState<MicroskillListItem[]>([])
	const [categories, setCategories] = useState<CategoryItem[]>([])
	const [newCategoryName, setNewCategoryName] = useState('')
	const [addingCategory, setAddingCategory] = useState(false)
	const [draggingCategoryName, setDraggingCategoryName] = useState<string | null>(null)
	const [syncingOrder, setSyncingOrder] = useState(false)
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState<string | null>(null)
	const [newMicroskillByCategory, setNewMicroskillByCategory] = useState<
		Record<string, { name: string; skillLevel: string }>
	>({})
	const [addingMicroskillCategory, setAddingMicroskillCategory] = useState<string | null>(null)

	async function fetchCatalogData() {
		const [skillsResponse, categoriesResponse] = await Promise.all([
			fetch('/api/admin/microskills', { cache: 'no-store' }),
			fetch('/api/admin/categories', { cache: 'no-store' }),
		])
		const skillsPayload = (await skillsResponse.json()) as {
			error?: string
			microskills?: MicroskillListItem[]
		}
		const categoriesPayload = (await categoriesResponse.json()) as {
			error?: string
			categories?: CategoryItem[]
		}

		if (!skillsResponse.ok) {
			return {
				error: skillsPayload.error ?? 'Could not load microskills.',
				microskills: [] as MicroskillListItem[],
				categories: [] as CategoryItem[],
			}
		}

		const skills = skillsPayload.microskills ?? []
		const byCategory = new Map<string, number>()
		for (const skill of skills) {
			if (!byCategory.has(skill.category)) {
				byCategory.set(skill.category, skill.category_sort)
				continue
			}
			byCategory.set(
				skill.category,
				Math.min(byCategory.get(skill.category) ?? skill.category_sort, skill.category_sort)
			)
		}
		const derivedCategories = Array.from(byCategory.entries()).map(
			([name, sort_order]) => ({ id: null, name, sort_order })
		)
		const fetchedCategories = categoriesResponse.ok
			? categoriesPayload.categories ?? []
			: []
		const mergedByName = new Map<string, CategoryItem>()
		for (const category of derivedCategories) {
			mergedByName.set(category.name.toLowerCase(), category)
		}
		for (const category of fetchedCategories) {
			mergedByName.set(category.name.toLowerCase(), category)
		}

		return {
			error: null,
			microskills: skills,
			categories: Array.from(mergedByName.values()).sort(
				(a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
			),
		}
	}

	async function reloadFromServer() {
		setLoading(true)
		const next = await fetchCatalogData()
		setMessage(next.error)
		setMicroskills(next.microskills)
		setCategories(next.categories)
		setLoading(false)
	}

	useEffect(() => {
		void (async () => {
			const next = await fetchCatalogData()
			setMessage(next.error)
			setMicroskills(next.microskills)
			setCategories(next.categories)
			setLoading(false)
		})()
	}, [])

	const grouped = useMemo(() => {
		const categoryOrder = new Map<string, number>(
			categories.map((category) => [category.name.toLowerCase(), category.sort_order])
		)
		const orderedSkills = [...microskills].sort(
			(a, b) =>
				(categoryOrder.get(a.category.toLowerCase()) ?? a.category_sort) -
					(categoryOrder.get(b.category.toLowerCase()) ?? b.category_sort) ||
				a.skill_sort - b.skill_sort
		)
		const map = new Map<string, MicroskillListItem[]>()
		for (const category of categories) {
			map.set(category.name, [])
		}
		for (const skill of orderedSkills) {
			if (!map.has(skill.category)) {
				map.set(skill.category, [])
			}
			map.get(skill.category)!.push(skill)
		}
		const groupedEntries = Array.from(map.entries())
		groupedEntries.sort(
			([leftCategory], [rightCategory]) =>
				(categoryOrder.get(leftCategory.toLowerCase()) ?? 999) -
					(categoryOrder.get(rightCategory.toLowerCase()) ?? 999) ||
				leftCategory.localeCompare(rightCategory)
		)
		return groupedEntries
	}, [categories, microskills])

	if (loading) {
		return <p className="font-inter text-sky-900">Loading microskills...</p>
	}

	if (grouped.length === 0) {
		return <p className="font-inter text-sky-900">No microskills found.</p>
	}

	function getMicroskillDraft(category: string) {
		return (
			newMicroskillByCategory[category.toLowerCase()] ?? {
				name: '',
				skillLevel: 'Beginner',
			}
		)
	}

	async function addCategory() {
		const name = newCategoryName.trim()
		if (!name) {
			setMessage('Enter a category name first.')
			return
		}
		setAddingCategory(true)
		setMessage(null)
		const response = await fetch('/api/admin/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, sortOrder: categories.length }),
		})
		const payload = (await response.json()) as {
			error?: string
			category?: CategoryItem
		}
		if (!response.ok || !payload.category) {
			setMessage(payload.error ?? 'Could not add category.')
			setAddingCategory(false)
			return
		}
		setCategories((prev) => {
			const next = [...prev, payload.category!]
			next.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
			return next
		})
		setNewCategoryName('')
		setMessage(`Category "${payload.category.name}" added.`)
		setAddingCategory(false)
	}

	async function syncCategoryOrder(nextCategories: CategoryItem[]) {
		setSyncingOrder(true)
		setMessage(null)

		const normalized = nextCategories.map((category, index) => ({
			...category,
			sort_order: index,
		}))
		setCategories(normalized)

		const categorySortMap = new Map<string, number>()
		for (const category of normalized) {
			categorySortMap.set(category.name.toLowerCase(), category.sort_order)
		}
		setMicroskills((prev) =>
			prev
				.map((skill) => ({
					...skill,
					category_sort:
						categorySortMap.get(skill.category.toLowerCase()) ?? skill.category_sort,
				}))
				.sort((a, b) => a.category_sort - b.category_sort || a.skill_sort - b.skill_sort)
		)

		const responses = await Promise.all(
			normalized.map((category) =>
				category.id === null
					? fetch('/api/admin/categories', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								name: category.name,
								sortOrder: category.sort_order,
							}),
					  })
					: fetch('/api/admin/categories', {
							method: 'PATCH',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								id: category.id,
								sortOrder: category.sort_order,
							}),
					  })
			)
		)

		const failedResponse = responses.find((response) => !response.ok)
		if (failedResponse) {
			const payload = (await failedResponse.json().catch(() => ({}))) as { error?: string }
			setMessage(payload.error ?? 'Could not save category order.')
			setSyncingOrder(false)
			await reloadFromServer()
			return
		}

		const payloads = (await Promise.all(
			responses.map((response) => response.json().catch(() => ({})))
		)) as Array<{ category?: CategoryItem }>

		const savedByName = new Map<string, CategoryItem>()
		for (const payload of payloads) {
			if (payload.category) {
				savedByName.set(payload.category.name.toLowerCase(), payload.category)
			}
		}
		setCategories((prev) =>
			prev.map((category) => savedByName.get(category.name.toLowerCase()) ?? category)
		)
		setSyncingOrder(false)
	}

	function moveCategory(sourceName: string, targetName: string) {
		if (sourceName === targetName) return
		const sourceIndex = categories.findIndex(
			(category) => category.name.toLowerCase() === sourceName.toLowerCase()
		)
		const targetIndex = categories.findIndex(
			(category) => category.name.toLowerCase() === targetName.toLowerCase()
		)
		if (sourceIndex < 0 || targetIndex < 0) return

		const next = [...categories]
		const [moved] = next.splice(sourceIndex, 1)
		next.splice(targetIndex, 0, moved)
		void syncCategoryOrder(next)
	}

	async function addMicroskill(category: string) {
		const draft = getMicroskillDraft(category)
		const name = draft.name.trim()
		if (!name) {
			setMessage('Enter a microskill name first.')
			return
		}
		setAddingMicroskillCategory(category)
		setMessage(null)
		const response = await fetch('/api/admin/microskills', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				category,
				skill_level: draft.skillLevel || 'Beginner',
			}),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			microskill?: MicroskillListItem
		}
		if (!response.ok || !payload.microskill) {
			setMessage(payload.error ?? 'Could not add microskill.')
			setAddingMicroskillCategory(null)
			return
		}
		setMicroskills((prev) =>
			[...prev, payload.microskill!].sort(
				(a, b) => a.category_sort - b.category_sort || a.skill_sort - b.skill_sort
			)
		)
		setNewMicroskillByCategory((prev) => ({
			...prev,
			[category.toLowerCase()]: { name: '', skillLevel: draft.skillLevel || 'Beginner' },
		}))
		setMessage(`Microskill "${payload.microskill.name}" added to ${category}.`)
		setAddingMicroskillCategory(null)
	}

	return (
		<div className="space-y-8">
			<div className="border-b-2 border-green-700 pb-6">
				<h2 className="font-Young_Serif text-2xl text-sky-900">Categories</h2>
				<p className="mt-1 font-inter text-sm text-sky-900">
					Drag and drop categories to reorder them.
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					<label className="block font-inter text-xs text-sky-900">
						New Category Name
						<input
							className="mt-1 min-w-[260px] rounded border-2 border-green-700 p-2"
							value={newCategoryName}
							onChange={(event) => setNewCategoryName(event.target.value)}
							placeholder="New category"
						/>
					</label>
					<button
						type="button"
						onClick={() => void addCategory()}
						disabled={addingCategory}
						className="self-end rounded bg-green-700 px-4 py-2 text-white transition hover:bg-green-500 disabled:opacity-60"
					>
						{addingCategory ? 'Adding...' : 'Add Category'}
					</button>
				</div>
				{message ? <p className="mt-2 font-inter text-sm text-sky-900">{message}</p> : null}
				{syncingOrder ? (
					<p className="mt-2 font-inter text-xs text-sky-900">Saving category order...</p>
				) : null}
				<div className="mt-3 space-y-2">
					{categories.map((category) => (
						<div
							key={category.id ?? category.name}
							className="flex cursor-grab flex-wrap items-center gap-2 border-b border-sky-200 pb-2"
							draggable
							onDragStart={() => setDraggingCategoryName(category.name)}
							onDragOver={(event) => event.preventDefault()}
							onDrop={() => {
								if (!draggingCategoryName || syncingOrder) return
								moveCategory(draggingCategoryName, category.name)
								setDraggingCategoryName(null)
							}}
							onDragEnd={() => setDraggingCategoryName(null)}
						>
							<span className="font-inter text-sm text-sky-700">::</span>
							<span className="font-inter text-xs text-sky-900 min-w-[180px]">
								{category.name} ({category.sort_order})
							</span>
						</div>
					))}
				</div>
			</div>
			{grouped.map(([category, skills]) => (
				<div key={category} className="space-y-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">{category}</h2>
					<div className="flex flex-wrap items-end gap-2">
						<label className="block font-inter text-xs text-sky-900">
							New Microskill
							<input
								className="mt-1 min-w-[220px] rounded border-2 border-green-700 p-2"
								value={getMicroskillDraft(category).name}
								onChange={(event) =>
									setNewMicroskillByCategory((prev) => ({
										...prev,
										[category.toLowerCase()]: {
											...getMicroskillDraft(category),
											name: event.target.value,
										},
									}))
								}
								placeholder="Microskill name"
							/>
						</label>
						<label className="block font-inter text-xs text-sky-900">
							Skill Level
							<select
								className="mt-1 rounded border-2 border-green-700 p-2 bg-white"
								value={getMicroskillDraft(category).skillLevel}
								onChange={(event) =>
									setNewMicroskillByCategory((prev) => ({
										...prev,
										[category.toLowerCase()]: {
											...getMicroskillDraft(category),
											skillLevel: event.target.value,
										},
									}))
								}
							>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Advanced">Advanced</option>
							</select>
						</label>
						<button
							type="button"
							onClick={() => void addMicroskill(category)}
							disabled={addingMicroskillCategory === category}
							className="self-end rounded bg-green-700 px-4 py-2 text-white transition hover:bg-green-500 disabled:opacity-60"
						>
							{addingMicroskillCategory === category ? 'Adding...' : 'Add Microskill'}
						</button>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{skills.length === 0 ? (
							<p className="col-span-full rounded-lg border-2 border-sky-200 bg-white px-3 py-3 font-inter text-sm text-sky-900">
								No microskills in this category yet.
							</p>
						) : null}
						{skills.map((skill) => (
							<Link
								key={skill.id}
								href={`/dashboard/microskills/${skill.id}`}
								className="block rounded-lg border-2 border-green-700 bg-white p-3 text-center shadow-md transition hover:bg-green-700 hover:text-white"
							>
								<p className="font-Young_Serif text-lg leading-tight">{skill.name}</p>
								<p className="font-inter text-xs">/{skill.slug}</p>
								<p className="mt-1 font-inter text-xs">
									Category Sort: {skill.category_sort} | Skill Sort: {skill.skill_sort}
								</p>
								<p className="mt-1 font-inter text-sm">{skill.skill_level}</p>
								<p className="mt-1 font-inter text-xs">
									{skill.is_public ? 'Published' : 'Hidden'}
								</p>
							</Link>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
