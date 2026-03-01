'use client'

import { useEffect, useState } from 'react'
import LucideIconPicker from '@/components/dashboard/lucide-icon-picker'
import { sanitizeBadgeIconName } from '@/lib/learn/badge-icons'
import type { LessonsPayload } from '@/lib/learn/types'

type MicroskillDetail = {
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
	badge_icon: string
	lessons: LessonsPayload
}

type CategoryItem = {
	id: number
	name: string
	sort_order: number
}

function newSection(index: number) {
	return {
		id: `sec_${Date.now()}_${index}`,
		sectionKey: index === 0 ? 'learn' : 'practice',
		title: index === 0 ? 'Learn' : 'Practice',
		sortOrder: index + 1,
		checkpoints: [],
	} as LessonsPayload['sections'][number]
}

function newCheckpoint(index: number) {
	return {
		id: `cp_${Date.now()}_${index}`,
		title: 'New checkpoint',
		description: '',
		kind: 'video',
		sortOrder: index + 1,
		isRequired: true,
		manualCompletion: true,
		quizPassPercent: null,
		resourceUrl: null,
		durationSeconds: null,
	} as LessonsPayload['sections'][number]['checkpoints'][number]
}

function estimateReadingDurationSeconds(input: { title: string; description: string }) {
	const text = `${input.title} ${input.description}`.trim()
	if (!text) return null
	const words = text.split(/\s+/).filter(Boolean).length
	if (words === 0) return null
	return Math.max(60, Math.ceil((words / 200) * 60))
}

export default function MicroskillCuration({ microskillId }: { microskillId: number }) {
	const [detail, setDetail] = useState<MicroskillDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [categoryOptions, setCategoryOptions] = useState<string[]>([])
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
	const [autoDurationCheckpointId, setAutoDurationCheckpointId] = useState<string | null>(
		null
	)

	useEffect(() => {
		void Promise.all([
			fetch(`/api/admin/microskills?id=${microskillId}`, { cache: 'no-store' }),
			fetch('/api/admin/categories', { cache: 'no-store' }),
		]).then(async ([detailResponse, categoriesResponse]) => {
			const detailPayload = (await detailResponse.json()) as {
				error?: string
				microskill?: MicroskillDetail
			}
			const categoriesPayload = (await categoriesResponse.json()) as {
				categories?: CategoryItem[]
			}

			if (!detailResponse.ok || !detailPayload.microskill) {
				setMessage(detailPayload.error ?? 'Could not load microskill details.')
				setLoading(false)
				return
			}

			const normalizedDetail = {
				...detailPayload.microskill,
				badge_icon: sanitizeBadgeIconName(detailPayload.microskill.badge_icon),
			}
			setDetail(normalizedDetail)
			setCollapsedSections(
				Object.fromEntries(normalizedDetail.lessons.sections.map((section) => [section.id, true]))
			)
			const names = (categoriesPayload.categories ?? []).map((entry) => entry.name)
			const currentCategory = detailPayload.microskill.category?.trim()
			if (currentCategory && !names.includes(currentCategory)) {
				names.push(currentCategory)
			}
			setCategoryOptions(names)
			setLoading(false)
		})
	}, [microskillId])

	function updateSection(sectionIndex: number, field: string, value: unknown) {
		if (!detail) return
		const next = structuredClone(detail)
		;(next.lessons.sections[sectionIndex] as Record<string, unknown>)[field] = value
		setDetail(next)
	}

	function updateCheckpoint(
		sectionIndex: number,
		checkpointIndex: number,
		field: string,
		value: unknown
	) {
		if (!detail) return
		const next = structuredClone(detail)
		;(next.lessons.sections[sectionIndex].checkpoints[checkpointIndex] as Record<string, unknown>)[field] = value
		setDetail(next)
	}

	function addSection() {
		if (!detail) return
		const next = structuredClone(detail)
		next.lessons.sections.push(newSection(next.lessons.sections.length))
		setDetail(next)
	}

	function toggleSection(sectionId: string) {
		setCollapsedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}))
	}

	function addCheckpoint(sectionIndex: number) {
		if (!detail) return
		const next = structuredClone(detail)
		next.lessons.sections[sectionIndex].checkpoints.push(
			newCheckpoint(next.lessons.sections[sectionIndex].checkpoints.length)
		)
		setDetail(next)
	}

	function removeSection(sectionIndex: number) {
		if (!detail) return
		const section = detail.lessons.sections[sectionIndex]
		if (!section) return
		const confirmed = window.confirm(
			`Delete section "${section.title}" and all ${section.checkpoints.length} checkpoints?`
		)
		if (!confirmed) return

		const next = structuredClone(detail)
		next.lessons.sections.splice(sectionIndex, 1)
		setDetail(next)
		setCollapsedSections((prev) => {
			const copy = { ...prev }
			delete copy[section.id]
			return copy
		})
		setMessage(`Section "${section.title}" deleted. Save microskill to apply changes.`)
	}

	function removeCheckpoint(sectionIndex: number, checkpointIndex: number) {
		if (!detail) return
		const checkpoint = detail.lessons.sections[sectionIndex]?.checkpoints[checkpointIndex]
		if (!checkpoint) return
		const confirmed = window.confirm(`Delete checkpoint "${checkpoint.title}"?`)
		if (!confirmed) return

		const next = structuredClone(detail)
		next.lessons.sections[sectionIndex].checkpoints.splice(checkpointIndex, 1)
		setDetail(next)
		if (autoDurationCheckpointId === checkpoint.id) {
			setAutoDurationCheckpointId(null)
		}
		setMessage(`Checkpoint "${checkpoint.title}" deleted. Save microskill to apply changes.`)
	}

	function setDurationFromText(sectionIndex: number, checkpointIndex: number) {
		if (!detail) return
		const checkpoint = detail.lessons.sections[sectionIndex]?.checkpoints[checkpointIndex]
		if (!checkpoint) return
		const estimated = estimateReadingDurationSeconds({
			title: checkpoint.title,
			description: checkpoint.description,
		})
		updateCheckpoint(sectionIndex, checkpointIndex, 'durationSeconds', estimated)
	}

	async function setDurationFromYoutube(
		sectionIndex: number,
		checkpointIndex: number,
		resourceUrl: string | null
	) {
		if (!resourceUrl) {
			setMessage('Add a YouTube URL first.')
			return
		}
		const checkpoint = detail?.lessons.sections[sectionIndex]?.checkpoints[checkpointIndex]
		if (!checkpoint) return
		setAutoDurationCheckpointId(checkpoint.id)
		setMessage(null)
		const response = await fetch('/api/admin/youtube-duration', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: resourceUrl }),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			durationSeconds?: number
		}
		if (!response.ok || typeof payload.durationSeconds !== 'number') {
			setMessage(payload.error ?? 'Could not detect YouTube duration. Enter manually.')
			setAutoDurationCheckpointId(null)
			return
		}
		updateCheckpoint(sectionIndex, checkpointIndex, 'durationSeconds', payload.durationSeconds)
		setMessage(`Duration detected from YouTube.`)
		setAutoDurationCheckpointId(null)
	}

	async function save() {
		if (!detail) return
		setSaving(true)
		setMessage(null)
		const response = await fetch('/api/admin/microskills', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: detail.id,
				name: detail.name,
				slug: detail.slug,
				category: detail.category,
				category_sort: detail.category_sort,
				skill_level: detail.skill_level,
				skill_sort: detail.skill_sort,
				description: detail.description,
				url: detail.url,
				current_version: detail.current_version,
				is_public: detail.is_public,
				badge_icon: detail.badge_icon,
				lessons: detail.lessons,
			}),
		})

		const payload = (await response.json()) as {
			error?: string
			current_version?: number | null
		}
		if (!response.ok) {
			setMessage(payload.error ?? 'Could not save microskill.')
			setSaving(false)
			return
		}
		const nextVersion = payload.current_version
		if (typeof nextVersion === 'number') {
			setDetail((prev) =>
				prev ? { ...prev, current_version: nextVersion } : prev
			)
		}
		setSaving(false)
		setMessage('Saved successfully.')
	}

	if (loading) {
		return <p className="font-inter text-sky-900">Loading microskill...</p>
	}

	if (!detail) {
		return <p className="font-inter text-red-600">{message ?? 'Microskill not found.'}</p>
	}

	return (
		<div className="space-y-4">
			<h1 className="font-Young_Serif text-3xl text-sky-900">{detail.name}</h1>
			{message ? (
				<p className="rounded-lg border-2 border-sky-300 bg-sky-100 p-3 font-inter text-sky-900">
					{message}
				</p>
			) : null}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<label className="font-inter text-xs text-sky-900">Microskill Name
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.name} onChange={(e) => setDetail({ ...detail, name: e.target.value })} />
				</label>
				<label className="font-inter text-xs text-sky-900">Slug
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.slug} onChange={(e) => setDetail({ ...detail, slug: e.target.value })} />
				</label>
				<label className="font-inter text-xs text-sky-900">Category
					<select className="mt-1 w-full border-2 border-green-700 rounded p-2 bg-white" value={detail.category} onChange={(e) => setDetail({ ...detail, category: e.target.value })}>
						{categoryOptions.map((category) => (
							<option key={category} value={category}>{category}</option>
						))}
					</select>
				</label>
				<label className="font-inter text-xs text-sky-900">Category Sort Order
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={detail.category_sort} onChange={(e) => setDetail({ ...detail, category_sort: Number(e.target.value) })} />
				</label>
				<label className="font-inter text-xs text-sky-900">Skill Level
					<select className="mt-1 w-full border-2 border-green-700 rounded p-2 bg-white" value={detail.skill_level} onChange={(e) => setDetail({ ...detail, skill_level: e.target.value })}>
						<option value="Beginner">Beginner</option>
						<option value="Intermediate">Intermediate</option>
						<option value="Advanced">Advanced</option>
					</select>
				</label>
				<label className="font-inter text-xs text-sky-900">Skill Sort Order
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={detail.skill_sort} onChange={(e) => setDetail({ ...detail, skill_sort: Number(e.target.value) })} />
				</label>
				<label className="font-inter text-xs text-sky-900">Primary URL
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.url} onChange={(e) => setDetail({ ...detail, url: e.target.value })} />
				</label>
				<label className="font-inter text-xs text-sky-900">Current Version
					<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" min={1} value={detail.current_version} onChange={(e) => setDetail({ ...detail, current_version: Number(e.target.value) })} />
				</label>
			</div>
			<LucideIconPicker
				value={detail.badge_icon}
				onChange={(iconName) => setDetail({ ...detail, badge_icon: sanitizeBadgeIconName(iconName) })}
			/>

			<label className="font-inter text-xs text-sky-900 block">Description
				<textarea className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.description} onChange={(e) => setDetail({ ...detail, description: e.target.value })} />
			</label>
			<label className="font-inter text-sm text-sky-900 flex items-center gap-2">
				<input type="checkbox" checked={detail.is_public} onChange={(e) => setDetail({ ...detail, is_public: e.target.checked })} />
				Published to public learn catalog
			</label>

			<div className="border-y border-sky-200 py-3">
				<div className="flex items-center justify-between mb-2">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Sections & Checkpoints</h2>
					<button type="button" onClick={addSection} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-500 transition">Add Section</button>
				</div>
				<div className="space-y-3">
					{detail.lessons.sections.map((section, sectionIndex) => (
						<div key={section.id} className="border-2 border-green-700 rounded p-3">
							<div className="flex items-center justify-between gap-3">
								<p className="font-inter text-sm text-sky-900">
									{section.title} ({section.checkpoints.length} checkpoints)
								</p>
								<div className="flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => toggleSection(section.id)}
										className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-1 rounded"
									>
										{collapsedSections[section.id]
											? 'Expand Section'
											: 'Collapse Section'}
									</button>
									<button
										type="button"
										onClick={() => removeSection(sectionIndex)}
										className="border-orange border-2 text-orange hover:bg-orange hover:text-white px-3 py-1 rounded"
									>
										Delete Section
									</button>
								</div>
							</div>
								{collapsedSections[section.id] ? null : (
									<div className="mt-3">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
										<label className="font-inter text-xs text-sky-900">Section Title
											<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={section.title} onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)} />
										</label>
										<label className="font-inter text-xs text-sky-900">Section Type
											<select className="mt-1 w-full border-2 border-green-700 rounded p-2" value={section.sectionKey} onChange={(e) => updateSection(sectionIndex, 'sectionKey', e.target.value)}>
												<option value="learn">learn</option>
												<option value="practice">practice</option>
											</select>
										</label>
										<label className="font-inter text-xs text-sky-900">Section Sort Order
											<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={section.sortOrder} onChange={(e) => updateSection(sectionIndex, 'sortOrder', Number(e.target.value))} />
										</label>
									</div>
									<div className="mt-2">
										<button type="button" onClick={() => addCheckpoint(sectionIndex)} className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-1 rounded">Add Checkpoint</button>
									</div>
									<div className="space-y-2 mt-2">
										{section.checkpoints.map((checkpoint, checkpointIndex) => (
											<div key={checkpoint.id} className="border border-sky-300 rounded p-2">
												<div className="flex justify-end">
													<button
														type="button"
														onClick={() => removeCheckpoint(sectionIndex, checkpointIndex)}
														className="border-orange border-2 text-orange hover:bg-orange hover:text-white px-3 py-1 rounded text-xs"
													>
														Delete Checkpoint
													</button>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
													<label className="font-inter text-xs text-sky-900">Checkpoint Title
														<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.title} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'title', e.target.value)} />
													</label>
													<label className="font-inter text-xs text-sky-900">Checkpoint Type
														<select className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.kind} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'kind', e.target.value)}>
															<option value="video">video</option>
															<option value="quiz">quiz</option>
															<option value="article">article</option>
															<option value="exercise">exercise</option>
															<option value="download">download</option>
															<option value="external">external</option>
														</select>
													</label>
												</div>
												<label className="font-inter text-xs text-sky-900 block mt-2">Checkpoint Description
													<textarea className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.description} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'description', e.target.value)} />
												</label>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
													<label className="font-inter text-xs text-sky-900">Checkpoint Sort Order
														<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={checkpoint.sortOrder} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'sortOrder', Number(e.target.value))} />
													</label>
													<label className="font-inter text-xs text-sky-900">Quiz Pass Percent
														<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={checkpoint.quizPassPercent ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'quizPassPercent', e.target.value === '' ? null : Number(e.target.value))} />
													</label>
													<label className="font-inter text-xs text-sky-900">Resource URL
														<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.resourceUrl ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'resourceUrl', e.target.value || null)} />
													</label>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-[220px_auto] gap-2 mt-2">
													<label className="font-inter text-xs text-sky-900">Duration (seconds)
														<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" min={1} value={checkpoint.durationSeconds ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'durationSeconds', e.target.value === '' ? null : Math.max(1, Number(e.target.value)))} />
													</label>
													<div className="flex flex-wrap items-end gap-2">
														{checkpoint.kind === 'video' ? (
															<button
																type="button"
																onClick={() =>
																	void setDurationFromYoutube(
																		sectionIndex,
																		checkpointIndex,
																		checkpoint.resourceUrl
																	)
																}
																disabled={autoDurationCheckpointId === checkpoint.id}
																className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-2 rounded disabled:opacity-60"
															>
																{autoDurationCheckpointId === checkpoint.id
																	? 'Detecting...'
																	: 'Auto from YouTube'}
															</button>
														) : (
															<button
																type="button"
																onClick={() => setDurationFromText(sectionIndex, checkpointIndex)}
																className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-2 rounded"
															>
																Estimate from text
															</button>
														)}
													</div>
												</div>
												<div className="flex gap-4 mt-2">
													<label className="font-inter text-xs"><input type="checkbox" checked={checkpoint.isRequired} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'isRequired', e.target.checked)} /> Required</label>
													<label className="font-inter text-xs"><input type="checkbox" checked={checkpoint.manualCompletion} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'manualCompletion', e.target.checked)} /> Manual complete</label>
												</div>
											</div>
										))}
									</div>
									</div>
								)}
							</div>
						))}
					</div>
			</div>

			<button type="button" onClick={() => void save()} disabled={saving} className="bg-green-700 text-white rounded hover:bg-green-500 transition px-4 py-2 disabled:opacity-60">
				{saving ? 'Saving...' : 'Save Microskill'}
			</button>
		</div>
	)
}
