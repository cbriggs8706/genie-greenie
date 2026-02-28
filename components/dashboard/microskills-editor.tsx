'use client'

import { useEffect, useState } from 'react'
import type { LessonsPayload } from '@/lib/learn/types'
import { microSkills } from '@/data/microskills'

type MicroskillListItem = {
	id: number
	name: string
	slug: string
	category: string
	skill_level: string
	description: string
	url: string
	current_version: number
	is_public: boolean
}

type MicroskillDetail = MicroskillListItem & {
	lessons: LessonsPayload
}

type PartnerKey = {
	id: number
	label: string
	is_active: boolean
	created_at: string
	last_used_at: string | null
}

const defaultCategoryOptions = Array.from(
	new Set(microSkills.map((entry) => entry.category))
)

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

export default function MicroskillsEditor() {
	const [microskills, setMicroskills] = useState<MicroskillListItem[]>([])
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [detail, setDetail] = useState<MicroskillDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [partnerLabel, setPartnerLabel] = useState('')
	const [partnerKeys, setPartnerKeys] = useState<PartnerKey[]>([])
	const [newPartnerKey, setNewPartnerKey] = useState<string | null>(null)
	const [categoryOptions, setCategoryOptions] =
		useState<string[]>(defaultCategoryOptions)
	const [newCategoryName, setNewCategoryName] = useState('')

	useEffect(() => {
		void loadList()
		void loadPartnerKeys()
	}, [])

	async function loadList() {
		setLoading(true)
		setMessage(null)
		const response = await fetch('/api/admin/microskills', { cache: 'no-store' })
		const payload = (await response.json()) as {
			error?: string
			microskills?: MicroskillListItem[]
		}
		if (!response.ok) {
			setMessage(payload.error ?? 'Could not load microskills.')
			setLoading(false)
			return
		}
			setMicroskills(payload.microskills ?? [])
			const mergedCategories = new Set(defaultCategoryOptions)
			for (const item of payload.microskills ?? []) {
				if (item.category?.trim()) {
					mergedCategories.add(item.category.trim())
				}
			}
			setCategoryOptions(Array.from(mergedCategories).sort())
			setLoading(false)
		}

	async function loadPartnerKeys() {
		const response = await fetch('/api/admin/partner-keys', { cache: 'no-store' })
		const payload = (await response.json()) as { error?: string; keys?: PartnerKey[] }
		if (!response.ok) {
			return
		}
		setPartnerKeys(payload.keys ?? [])
	}

	async function loadDetail(id: number) {
		setSelectedId(id)
		setMessage(null)
		const response = await fetch(`/api/admin/microskills?id=${id}`, {
			cache: 'no-store',
		})
		const payload = (await response.json()) as {
			error?: string
			microskill?: MicroskillDetail
		}
			if (!response.ok || !payload.microskill) {
				setMessage(payload.error ?? 'Could not load microskill details.')
				return
			}
			const microskillDetail = payload.microskill
			if (microskillDetail.category?.trim()) {
				setCategoryOptions((prev) => {
					if (
						prev.some(
							(category) =>
								category.toLowerCase() ===
								microskillDetail.category.toLowerCase()
						)
					) {
						return prev
					}
					return [...prev, microskillDetail.category].sort()
				})
			}
			setDetail(microskillDetail)
		}

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
		;(next.lessons.sections[sectionIndex].checkpoints[checkpointIndex] as Record<string, unknown>)[field] =
			value
		setDetail(next)
	}

	function addSection() {
		if (!detail) return
		const next = structuredClone(detail)
		next.lessons.sections.push(newSection(next.lessons.sections.length))
		setDetail(next)
	}

	function addCheckpoint(sectionIndex: number) {
		if (!detail) return
		const next = structuredClone(detail)
		const checkpoints = next.lessons.sections[sectionIndex].checkpoints
		checkpoints.push(newCheckpoint(checkpoints.length))
		setDetail(next)
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
				skill_level: detail.skill_level,
				description: detail.description,
				url: detail.url,
				current_version: detail.current_version,
				is_public: detail.is_public,
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

		setMessage('Saved successfully.')
		await loadList()
		setSaving(false)
	}

	async function createPartnerKey() {
		if (!partnerLabel.trim()) {
			setMessage('Partner key label is required.')
			return
		}

		const response = await fetch('/api/admin/partner-keys', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label: partnerLabel }),
		})
		const payload = (await response.json()) as {
			error?: string
			key?: { apiKey: string; label: string }
		}

		if (!response.ok || !payload.key) {
			setMessage(payload.error ?? 'Could not create partner key.')
			return
		}

		setNewPartnerKey(payload.key.apiKey)
		setPartnerLabel('')
		setMessage(`Created partner key for ${payload.key.label}. Copy it now.`)
		await loadPartnerKeys()
	}

	function addCategoryOption() {
		const nextCategory = newCategoryName.trim()
		if (!nextCategory) {
			setMessage('Enter a category name first.')
			return
		}

		setCategoryOptions((prev) => {
			if (
				prev.some(
					(existing) => existing.toLowerCase() === nextCategory.toLowerCase()
				)
			) {
				return prev
			}
			return [...prev, nextCategory].sort()
		})

		if (detail) {
			setDetail({ ...detail, category: nextCategory })
		}
		setNewCategoryName('')
		setMessage(`Category "${nextCategory}" added.`)
	}

	return (
		<div className="mx-4 mb-24 mt-4 rounded-xl bg-white bg-opacity-85 p-4 shadow-lg md:mx-24 md:p-8">
			<h1 className="font-Young_Serif text-3xl text-sky-900">LMS Microskill Curation</h1>
			<p className="mt-2 font-inter text-sky-900">
				Select a microskill, then curate `Learn` and `Practice` sections with checkpoints.
			</p>
			{message ? (
				<p className="mt-3 rounded-lg border-2 border-sky-300 bg-sky-100 p-3 font-inter text-sky-900">
					{message}
				</p>
			) : null}

			<div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-1 rounded-lg border-2 border-green-700 p-3">
					<h2 className="font-Young_Serif text-xl text-sky-900 mb-2">Microskills</h2>
					{loading ? <p className="font-inter text-sm">Loading...</p> : null}
					<div className="space-y-2 max-h-[560px] overflow-auto">
						{microskills.map((item) => (
							<button
								key={item.id}
								type="button"
								onClick={() => void loadDetail(item.id)}
								className={`w-full text-left rounded p-2 border-2 ${
									selectedId === item.id
										? 'border-green-700 bg-lightyellow'
										: 'border-sky-200 bg-white'
								}`}
							>
								<p className="font-Young_Serif text-lg text-sky-900">{item.name}</p>
								<p className="font-inter text-xs text-sky-800">/{item.slug}</p>
							</button>
						))}
					</div>
				</div>

				<div className="lg:col-span-2 rounded-lg border-2 border-green-700 p-4">
					{detail ? (
						<div className="space-y-4">
							<h2 className="font-Young_Serif text-2xl text-sky-900">{detail.name}</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								<label className="font-inter text-xs text-sky-900">
									Microskill Name
									<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.name} onChange={(e) => setDetail({ ...detail, name: e.target.value })} placeholder="Name" />
								</label>
								<label className="font-inter text-xs text-sky-900">
									Slug
									<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.slug} onChange={(e) => setDetail({ ...detail, slug: e.target.value })} placeholder="Slug" />
								</label>
								<label className="font-inter text-xs text-sky-900">
									Category
									<select
										className="mt-1 w-full border-2 border-green-700 rounded p-2 bg-white"
										value={detail.category}
										onChange={(e) =>
											setDetail({ ...detail, category: e.target.value })
										}
									>
										{categoryOptions.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Skill Level
									<select
										className="mt-1 w-full border-2 border-green-700 rounded p-2 bg-white"
										value={detail.skill_level}
										onChange={(e) =>
											setDetail({ ...detail, skill_level: e.target.value })
										}
									>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</select>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Primary URL
									<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.url} onChange={(e) => setDetail({ ...detail, url: e.target.value })} placeholder="Primary URL" />
								</label>
								<label className="font-inter text-xs text-sky-900">
									Current Version
									<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" min={1} value={detail.current_version} onChange={(e) => setDetail({ ...detail, current_version: Number(e.target.value) })} placeholder="Current Version" />
								</label>
							</div>
							<label className="font-inter text-xs text-sky-900 block">
								Description
								<textarea className="mt-1 w-full border-2 border-green-700 rounded p-2" value={detail.description} onChange={(e) => setDetail({ ...detail, description: e.target.value })} placeholder="Description" />
							</label>
							<label className="font-inter text-sm text-sky-900 flex items-center gap-2">
								<input type="checkbox" checked={detail.is_public} onChange={(e) => setDetail({ ...detail, is_public: e.target.checked })} />
								Published to public learn catalog
							</label>
							<div className="rounded-lg border border-sky-300 p-3">
								<p className="font-inter text-xs text-sky-900 mb-2">
									Add New Category
								</p>
								<div className="flex flex-wrap gap-2">
									<input
										className="border-2 border-green-700 rounded p-2 min-w-[240px]"
										value={newCategoryName}
										onChange={(e) => setNewCategoryName(e.target.value)}
										placeholder="New category name"
									/>
									<button
										type="button"
										onClick={addCategoryOption}
										className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-2 rounded"
									>
										Add Category
									</button>
								</div>
							</div>

							<div className="rounded-lg border-2 border-green-700 p-3">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-Young_Serif text-xl text-sky-900">Sections & Checkpoints</h3>
									<button type="button" onClick={addSection} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-500 transition">Add Section</button>
								</div>
								<div className="space-y-3">
									{detail.lessons.sections.map((section, sectionIndex) => (
										<div key={section.id} className="border-2 border-green-700 rounded p-3">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
												<label className="font-inter text-xs text-sky-900">
													Section Title
													<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={section.title} onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)} placeholder="Section title" />
												</label>
												<label className="font-inter text-xs text-sky-900">
													Section Type
													<select className="mt-1 w-full border-2 border-green-700 rounded p-2" value={section.sectionKey} onChange={(e) => updateSection(sectionIndex, 'sectionKey', e.target.value)}>
														<option value="learn">learn</option>
														<option value="practice">practice</option>
													</select>
												</label>
												<label className="font-inter text-xs text-sky-900">
													Section Sort Order
													<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={section.sortOrder} onChange={(e) => updateSection(sectionIndex, 'sortOrder', Number(e.target.value))} />
												</label>
											</div>
											<div className="mt-2">
												<button type="button" onClick={() => addCheckpoint(sectionIndex)} className="border-green-700 border-2 text-green-700 hover:bg-green-500 hover:text-white px-3 py-1 rounded">Add Checkpoint</button>
											</div>
											<div className="space-y-2 mt-2">
												{section.checkpoints.map((checkpoint, checkpointIndex) => (
													<div key={checkpoint.id} className="border border-sky-300 rounded p-2">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
															<label className="font-inter text-xs text-sky-900">
																Checkpoint Title
																<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.title} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'title', e.target.value)} placeholder="Checkpoint title" />
															</label>
															<label className="font-inter text-xs text-sky-900">
																Checkpoint Type
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
														<label className="font-inter text-xs text-sky-900 block mt-2">
															Checkpoint Description
															<textarea className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.description} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'description', e.target.value)} placeholder="Checkpoint description" />
														</label>
														<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
															<label className="font-inter text-xs text-sky-900">
																Checkpoint Sort Order
																<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={checkpoint.sortOrder} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'sortOrder', Number(e.target.value))} placeholder="Sort" />
															</label>
															<label className="font-inter text-xs text-sky-900">
																Quiz Pass Percent
																<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" value={checkpoint.quizPassPercent ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'quizPassPercent', e.target.value === '' ? null : Number(e.target.value))} placeholder="Quiz pass %" />
															</label>
															<label className="font-inter text-xs text-sky-900">
																Resource URL
																<input className="mt-1 w-full border-2 border-green-700 rounded p-2" value={checkpoint.resourceUrl ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'resourceUrl', e.target.value || null)} placeholder="Resource URL" />
															</label>
														</div>
														<label className="font-inter text-xs text-sky-900 block mt-2">
															Duration (seconds)
															<input className="mt-1 w-full border-2 border-green-700 rounded p-2" type="number" min={1} value={checkpoint.durationSeconds ?? ''} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'durationSeconds', e.target.value === '' ? null : Math.max(1, Number(e.target.value)))} placeholder="Duration in seconds" />
														</label>
														<div className="flex gap-4 mt-2">
															<label className="font-inter text-xs"><input type="checkbox" checked={checkpoint.isRequired} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'isRequired', e.target.checked)} /> Required</label>
															<label className="font-inter text-xs"><input type="checkbox" checked={checkpoint.manualCompletion} onChange={(e) => updateCheckpoint(sectionIndex, checkpointIndex, 'manualCompletion', e.target.checked)} /> Manual complete</label>
														</div>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							<button type="button" onClick={() => void save()} disabled={saving} className="bg-green-700 text-white rounded hover:bg-green-500 transition px-4 py-2 disabled:opacity-60">
								{saving ? 'Saving...' : 'Save Microskill'}
							</button>
						</div>
					) : (
						<p className="font-inter text-sky-900">Select a microskill to start curation.</p>
					)}
				</div>
			</div>
			<div className="mt-6 rounded-lg border-2 border-green-700 p-4">
				<h2 className="font-Young_Serif text-2xl text-sky-900">Partner API Keys</h2>
				<p className="font-inter text-sm text-sky-900 mt-1">
					Create keys for external certificate lookup (`/api/certificates/lookup`).
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					<label className="font-inter text-xs text-sky-900 block">
						Partner Label
						<input
							className="mt-1 border-2 border-green-700 rounded p-2 min-w-[280px]"
							value={partnerLabel}
							onChange={(event) => setPartnerLabel(event.target.value)}
							placeholder="Partner label"
						/>
					</label>
					<button
						type="button"
						onClick={() => void createPartnerKey()}
						className="bg-green-700 text-white rounded hover:bg-green-500 transition px-4 py-2"
					>
						Create Key
					</button>
				</div>
				{newPartnerKey ? (
					<p className="mt-3 rounded-lg border-2 border-orange bg-lightyellow p-3 font-inter text-sm text-sky-900 break-all">
						New API key (shown once): {newPartnerKey}
					</p>
				) : null}
				<div className="mt-3 space-y-2">
					{partnerKeys.map((key) => (
						<div key={key.id} className="rounded border border-sky-300 p-2 font-inter text-sm text-sky-900">
							{key.label} | active: {String(key.is_active)} | last used:{' '}
							{key.last_used_at ?? 'never'}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
