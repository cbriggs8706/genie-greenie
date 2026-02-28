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
	url: string
	current_version: number
	is_public: boolean
	updated_at: string
	badge_icon: string
}

function formatDate(value: string) {
	if (!value) return 'n/a'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'n/a'
	return date.toLocaleString()
}

export default function MicroskillsAssignmentView() {
	const [microskills, setMicroskills] = useState<MicroskillListItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState('All')
	const [visibility, setVisibility] = useState<'all' | 'public' | 'hidden'>('all')
	const [selectedIds, setSelectedIds] = useState<number[]>([])

	useEffect(() => {
		void (async () => {
			const response = await fetch('/api/admin/microskills', { cache: 'no-store' })
			const payload = (await response.json().catch(() => ({}))) as {
				error?: string
				microskills?: MicroskillListItem[]
			}

			if (!response.ok) {
				setError(payload.error ?? 'Could not load microskills.')
				setMicroskills([])
				setLoading(false)
				return
			}

			setMicroskills(payload.microskills ?? [])
			setLoading(false)
		})()
	}, [])

	const categories = useMemo(() => {
		const values = Array.from(new Set(microskills.map((item) => item.category)))
		values.sort((a, b) => a.localeCompare(b))
		return ['All', ...values]
	}, [microskills])

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase()
		return microskills.filter((item) => {
			if (category !== 'All' && item.category !== category) return false
			if (visibility === 'public' && !item.is_public) return false
			if (visibility === 'hidden' && item.is_public) return false
			if (!query) return true
			return (
				item.name.toLowerCase().includes(query) ||
				item.slug.toLowerCase().includes(query) ||
				item.category.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query)
			)
		})
	}, [category, microskills, search, visibility])

	const selected = useMemo(
		() => microskills.filter((item) => selectedIds.includes(item.id)),
		[microskills, selectedIds]
	)

	function toggleSelected(id: number) {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
	}

	function toggleAllVisible() {
		const visibleIds = filtered.map((item) => item.id)
		const allSelected =
			visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
		if (allSelected) {
			setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
			return
		}
		setSelectedIds((prev) => {
			const next = new Set(prev)
			for (const id of visibleIds) next.add(id)
			return Array.from(next)
		})
	}

	if (loading) {
		return <p className="font-inter text-sky-900">Loading microskills...</p>
	}

	if (error) {
		return <p className="font-inter text-sky-900">{error}</p>
	}

	return (
		<div className="space-y-6">
			<div className="rounded-lg border-2 border-green-700 bg-white p-4 shadow-lg">
				<h2 className="font-Young_Serif text-2xl text-sky-900">
					Available Microskills for Assignment
				</h2>
				<p className="mt-1 font-inter text-sm text-sky-900">
					Review all microskill details and choose the set you want to assign to consultants.
				</p>
				<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
					<label className="font-inter text-xs text-sky-900">
						Search
						<input
							className="mt-1 w-full rounded border-2 border-green-700 p-2"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Name, slug, category..."
						/>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Category
						<select
							className="mt-1 w-full rounded border-2 border-green-700 bg-white p-2"
							value={category}
							onChange={(event) => setCategory(event.target.value)}
						>
							{categories.map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Visibility
						<select
							className="mt-1 w-full rounded border-2 border-green-700 bg-white p-2"
							value={visibility}
							onChange={(event) =>
								setVisibility(event.target.value as 'all' | 'public' | 'hidden')
							}
						>
							<option value="all">All</option>
							<option value="public">Published</option>
							<option value="hidden">Hidden</option>
						</select>
					</label>
					<div className="flex items-end">
						<button
							type="button"
							onClick={toggleAllVisible}
							className="w-full rounded bg-green-700 px-4 py-2 font-inter text-sm text-white transition hover:bg-green-500"
						>
							Toggle Visible Selection
						</button>
					</div>
				</div>
				<p className="mt-3 font-inter text-sm text-sky-900">
					Showing {filtered.length} of {microskills.length} microskills. Selected {selected.length}.
				</p>
			</div>

			{selected.length > 0 ? (
				<div className="rounded-lg border-2 border-green-700 bg-lightyellow p-4 shadow-lg">
					<h3 className="font-Young_Serif text-xl text-sky-900">Selected Microskills</h3>
					<div className="mt-2 flex flex-wrap gap-2">
						{selected.map((item) => (
							<span
								key={item.id}
								className="rounded-full border-2 border-green-700 px-3 py-1 font-inter text-xs text-sky-900"
							>
								{item.name}
							</span>
						))}
					</div>
				</div>
			) : null}

			<div className="space-y-3">
				{filtered.map((item) => (
					<div
						key={item.id}
						className="rounded-lg border-2 border-green-700 bg-white p-4 shadow-lg"
					>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={selectedIds.includes(item.id)}
										onChange={() => toggleSelected(item.id)}
										className="h-4 w-4 accent-green-700"
										aria-label={`Select ${item.name}`}
									/>
									<h3 className="font-Young_Serif text-2xl text-sky-900">{item.name}</h3>
								</div>
								<p className="mt-1 font-inter text-xs text-sky-900">/{item.slug}</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Link
									href={`/learn/${item.slug}`}
									className="rounded border-2 border-green-700 px-3 py-1.5 font-inter text-xs text-green-700 transition hover:bg-green-500 hover:text-white"
								>
									Open Learn Page
								</Link>
								<Link
									href={`/dashboard/microskills/${item.id}`}
									className="rounded border-2 border-green-700 px-3 py-1.5 font-inter text-xs text-green-700 transition hover:bg-green-500 hover:text-white"
								>
									Open Admin Details
								</Link>
								{item.url?.trim() ? (
									<Link
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded border-2 border-green-700 px-3 py-1.5 font-inter text-xs text-green-700 transition hover:bg-green-500 hover:text-white"
									>
										Open Resource URL
									</Link>
								) : null}
							</div>
						</div>

						<p className="mt-2 font-inter text-sm text-sky-900">
							{item.description?.trim() || 'No description set.'}
						</p>

						<div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
							<p className="font-inter text-xs text-sky-900">
								Category: {item.category} (sort {item.category_sort})
							</p>
							<p className="font-inter text-xs text-sky-900">
								Skill Level: {item.skill_level}
							</p>
							<p className="font-inter text-xs text-sky-900">Skill Sort: {item.skill_sort}</p>
							<p className="font-inter text-xs text-sky-900">Version: v{item.current_version}</p>
							<p className="font-inter text-xs text-sky-900">
								Status: {item.is_public ? 'Published' : 'Hidden'}
							</p>
							<p className="font-inter text-xs text-sky-900">Badge Icon: {item.badge_icon}</p>
							<p className="font-inter text-xs text-sky-900">
								Last Updated: {formatDate(item.updated_at)}
							</p>
							<p className="font-inter text-xs text-sky-900">
								DB ID: {item.id}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
