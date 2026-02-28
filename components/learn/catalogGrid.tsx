'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type CatalogMicroskill = {
	id: number
	slug: string
	title: string
	description: string
	updatedAt: string
	category: string
	isPublic: boolean
	estimatedDurationMinutes?: number
}

export default function CatalogGrid() {
	const [microskills, setMicroskills] = useState<CatalogMicroskill[]>([])
	const [completedMicroskillIds, setCompletedMicroskillIds] = useState<Set<number>>(
		new Set()
	)
	const [loading, setLoading] = useState(true)
	const [expandedComingSoon, setExpandedComingSoon] = useState<Record<string, boolean>>({})

	useEffect(() => {
		void fetch('/api/learn/catalog', { cache: 'no-store' })
			.then((response) => response.json())
			.then(
				(payload: {
					microskills?: CatalogMicroskill[]
					completedMicroskillIds?: number[]
					error?: string
				}) => {
				setMicroskills(Array.isArray(payload.microskills) ? payload.microskills : [])
				setCompletedMicroskillIds(
					new Set(
						Array.isArray(payload.completedMicroskillIds)
							? payload.completedMicroskillIds
							: []
					)
				)
				setLoading(false)
				}
			)
			.catch(() => {
				setMicroskills([])
				setCompletedMicroskillIds(new Set())
				setLoading(false)
			})
	}, [])

	const grouped = useMemo(() => {
		const map = new Map<string, CatalogMicroskill[]>()
		for (const microskill of microskills) {
			if (!map.has(microskill.category)) {
				map.set(microskill.category, [])
			}
			map.get(microskill.category)!.push(microskill)
		}
		return Array.from(map.entries())
	}, [microskills])

	function formatUpdatedDate(value: string) {
		const date = new Date(value)
		if (Number.isNaN(date.getTime())) return 'Unknown'
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	function formatEstimatedMinutes(value: number | undefined) {
		if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return '1 min'
		return `${Math.max(1, Math.ceil(value))} min`
	}

	if (loading) {
		return <p className="text-center font-inter text-sky-900">Loading microskills...</p>
	}

	if (grouped.length === 0) {
		return (
			<p className="text-center font-inter text-sky-900">
				No microskills available right now.
			</p>
		)
	}

	return (
		<div className="space-y-8">
			{grouped.map(([category, skills]) => {
				const publicSkills = skills.filter((skill) => skill.isPublic)
				const comingSoon = skills.filter((skill) => !skill.isPublic)

				return (
					<div key={category} className="space-y-3">
						<h2 className="text-xl font-semibold text-green-700 border-b-2 border-green-700 pb-2">
							{category}
						</h2>

						{publicSkills.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{publicSkills.map((skill) => {
									const completed = completedMicroskillIds.has(skill.id)
									return (
										<Link
											key={skill.id}
											href={`/learn/${skill.slug}`}
											className={`w-full p-4 rounded-lg shadow-lg border-2 text-center transition ${
												completed
													? 'bg-green-700 text-white border-green-700 hover:bg-green-600'
													: 'bg-white border-green-700 hover:bg-green-700 hover:text-white'
											}`}
										>
											<h3 className="font-Young_Serif text-2xl">{skill.title}</h3>
											<p className="font-inter text-sm mt-2">{skill.description}</p>
											<p className="font-inter text-xs mt-3">
												Estimated time: {formatEstimatedMinutes(skill.estimatedDurationMinutes)}
											</p>
											<p className="font-inter text-xs mt-1">
												Updated: {formatUpdatedDate(skill.updatedAt)}
											</p>
											{completed ? (
												<p className="font-inter text-xs mt-2">Completed</p>
											) : null}
										</Link>
									)
								})}
							</div>
						) : (
							<p className="font-inter text-sm text-sky-900">No public microskills yet.</p>
						)}

						{comingSoon.length > 0 ? (
							<div className="rounded-lg border-2 border-sky-300 bg-sky-50 p-4">
								<button
									type="button"
									onClick={() =>
										setExpandedComingSoon((prev) => ({
											...prev,
											[category]: !prev[category],
										}))
									}
									className="w-full flex items-center justify-between text-left"
								>
									<p className="font-Young_Serif text-xl text-sky-900">
										Coming soon
									</p>
									<span className="font-inter text-sm text-sky-900">
										{expandedComingSoon[category] ? 'Hide' : 'Show'}
									</span>
								</button>
								{expandedComingSoon[category] ? (
									<ul className="mt-2 space-y-1">
										{comingSoon.map((skill) => (
											<li key={skill.id} className="font-inter text-sky-900">
												{skill.title}
											</li>
										))}
									</ul>
								) : null}
							</div>
						) : null}
					</div>
				)
			})}
		</div>
	)
}
