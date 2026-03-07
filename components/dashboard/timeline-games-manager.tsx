'use client'

import { useCallback, useMemo, useState } from 'react'
import {
	slugifyTimelineGame,
	type TimelineGame,
	type TimelineGameListItem,
} from '@/lib/timeline-games/types'

type EditableEvent = {
	year: string
	event: string
}

type EditableGame = {
	id: number | null
	title: string
	slug: string
	description: string
	sourcePrompt: string
	isPublished: boolean
	events: EditableEvent[]
	updatedAt?: string
}

function emptyGame(): EditableGame {
	return {
		id: null,
		title: '',
		slug: '',
		description: '',
		sourcePrompt: '',
		isPublished: false,
		events: [
			{ year: '', event: '' },
			{ year: '', event: '' },
			{ year: '', event: '' },
		],
	}
}

function toEditableGame(game: TimelineGame): EditableGame {
	return {
		id: game.id,
		title: game.title,
		slug: game.slug,
		description: game.description,
		sourcePrompt: game.sourcePrompt ?? '',
		isPublished: game.isPublished,
		updatedAt: game.updatedAt,
		events: game.events.map((entry) => ({
			year: String(entry.year),
			event: entry.event,
		})),
	}
}

export default function TimelineGamesManager({
	initialGames,
}: {
	initialGames: TimelineGameListItem[]
}) {
	const [games, setGames] = useState<TimelineGameListItem[]>(initialGames)
	const [editor, setEditor] = useState<EditableGame>(emptyGame())
	const [loadingList, setLoadingList] = useState(false)
	const [loadingDetail, setLoadingDetail] = useState(false)
	const [saving, setSaving] = useState(false)
	const [generating, setGenerating] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const loadDetail = useCallback(async (id: number) => {
		setLoadingDetail(true)
		setMessage(null)
		const response = await fetch(`/api/admin/timeline-games/${id}`, {
			cache: 'no-store',
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			game?: TimelineGame
		}

		if (!response.ok || !payload.game) {
			setMessage(payload.error ?? 'Could not load timeline game.')
			setLoadingDetail(false)
			return
		}

		setEditor(toEditableGame(payload.game))
		setLoadingDetail(false)
	}, [])

	const loadList = useCallback(async (selectedId?: number) => {
		setLoadingList(true)
		const response = await fetch('/api/admin/timeline-games', { cache: 'no-store' })
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			games?: TimelineGameListItem[]
		}

		if (!response.ok) {
			setMessage(payload.error ?? 'Could not load timeline games.')
			setLoadingList(false)
			return
		}

		const nextGames = payload.games ?? []
		setGames(nextGames)
		setLoadingList(false)

		if (typeof selectedId === 'number') {
			await loadDetail(selectedId)
		}
	}, [loadDetail])

	function updateEditor(field: keyof EditableGame, value: string | boolean) {
		setEditor((current) => ({
			...current,
			[field]: value,
		}))
	}

	function updateTitle(value: string) {
		setEditor((current) => {
			const shouldRefreshSlug =
				!current.slug.trim() || current.slug === slugifyTimelineGame(current.title)
			return {
				...current,
				title: value,
				slug: shouldRefreshSlug ? slugifyTimelineGame(value) : current.slug,
			}
		})
	}

	function updateEvent(index: number, field: keyof EditableEvent, value: string) {
		setEditor((current) => ({
			...current,
			events: current.events.map((entry, entryIndex) =>
				entryIndex === index ? { ...entry, [field]: value } : entry
			),
		}))
	}

	function addEvent() {
		setEditor((current) => ({
			...current,
			events: [...current.events, { year: '', event: '' }],
		}))
	}

	function removeEvent(index: number) {
		setEditor((current) => ({
			...current,
			events:
				current.events.length <= 3
					? current.events
					: current.events.filter((_, entryIndex) => entryIndex !== index),
		}))
	}

	const normalizedEvents = useMemo(
		() =>
			editor.events
			.map((entry) => ({
				year: Number(entry.year),
				event: entry.event.trim(),
			}))
			.filter((entry) => Number.isInteger(entry.year) && entry.event),
		[editor.events]
	)

	const duplicateYears = useMemo(() => {
		const counts = new Map<number, number>()
		for (const event of normalizedEvents) {
			counts.set(event.year, (counts.get(event.year) ?? 0) + 1)
		}
		return Array.from(counts.entries())
			.filter(([, count]) => count > 1)
			.map(([year]) => year)
	}, [normalizedEvents])

	async function generateDraft() {
		const prompt = editor.sourcePrompt.trim()
		if (!prompt) {
			setMessage('Enter a prompt first.')
			return
		}

		setGenerating(true)
		setMessage(null)
		const response = await fetch('/api/admin/timeline-games/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt }),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			draft?: {
				title: string
				slug: string
				description: string
				sourcePrompt: string
				events: Array<{ year: number; event: string }>
			}
		}

		if (!response.ok || !payload.draft) {
			setMessage(payload.error ?? 'Could not generate a timeline draft.')
			setGenerating(false)
			return
		}

		setEditor((current) => ({
			...current,
			title: payload.draft?.title ?? current.title,
			slug: payload.draft?.slug ?? current.slug,
			description: payload.draft?.description ?? current.description,
			sourcePrompt: payload.draft?.sourcePrompt ?? current.sourcePrompt,
			events:
				payload.draft?.events.map((entry) => ({
					year: String(entry.year),
					event: entry.event,
				})) ?? current.events,
		}))
		setMessage('Draft generated. Review the years and events before saving.')
		setGenerating(false)
	}

	async function saveGame() {
		setSaving(true)
		setMessage(null)
		const body = {
			title: editor.title,
			slug: editor.slug,
			description: editor.description,
			sourcePrompt: editor.sourcePrompt,
			isPublished: editor.isPublished,
			events: editor.events,
		}
		const endpoint = editor.id
			? `/api/admin/timeline-games/${editor.id}`
			: '/api/admin/timeline-games'
		const method = editor.id ? 'PATCH' : 'POST'

		const response = await fetch(endpoint, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			game?: TimelineGame
		}

		if (!response.ok || !payload.game) {
			setMessage(payload.error ?? 'Could not save timeline game.')
			setSaving(false)
			return
		}

		await loadList(payload.game.id)
		setEditor(toEditableGame(payload.game))
		setMessage(editor.id ? 'Timeline game updated.' : 'Timeline game created.')
		setSaving(false)
	}

	const selectedId = editor.id

	return (
		<div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
			<aside className="rounded-xl border-2 border-green-700 bg-white p-4 shadow-lg">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h2 className="font-Young_Serif text-2xl text-sky-900">Timeline Games</h2>
						<p className="mt-1 font-inter text-sm text-sky-900">
							Manage the new Play timeline experiences.
						</p>
					</div>
					<button
						type="button"
						onClick={() => {
							setEditor(emptyGame())
							setMessage(null)
						}}
						className="rounded border-2 border-green-700 px-3 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						New Draft
					</button>
				</div>
				<div className="mt-4 space-y-3">
					{loadingList ? (
						<p className="font-inter text-sm text-sky-900">Loading timeline games...</p>
					) : games.length > 0 ? (
						games.map((game) => (
							<button
								key={game.id}
								type="button"
								onClick={() => void loadDetail(game.id)}
								className={`w-full rounded-lg border-2 p-3 text-left shadow-sm transition ${
									selectedId === game.id
										? 'border-green-700 bg-green-700 text-white'
										: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white'
								}`}
							>
								<p className="font-Young_Serif text-lg">{game.title}</p>
								<p className="mt-1 font-inter text-xs">
									{game.eventCount} events • {game.isPublished ? 'Published' : 'Draft'}
								</p>
							</button>
						))
					) : (
						<p className="font-inter text-sm text-sky-900">
							No timeline games yet. Generate one from a prompt to get started.
						</p>
					)}
				</div>
			</aside>

			<section className="rounded-xl border-2 border-green-700 bg-white p-4 md:p-6 shadow-lg">
				<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div>
						<h2 className="font-Young_Serif text-3xl text-sky-900">
							{editor.id ? 'Edit Timeline Game' : 'Create Timeline Game'}
						</h2>
						<p className="mt-2 max-w-2xl font-inter text-sm text-sky-900">
							Use AI to draft a sequence of events, then refine the years and event
							labels before publishing it to Play.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => void generateDraft()}
							disabled={generating}
							className="rounded bg-green-700 px-4 py-2 font-inter text-sm text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							{generating ? 'Generating...' : 'Generate With AI'}
						</button>
						<button
							type="button"
							onClick={() => void saveGame()}
							disabled={saving || loadingDetail}
							className="rounded bg-sky-800 px-4 py-2 font-inter text-sm text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							{saving ? 'Saving...' : editor.id ? 'Save Changes' : 'Create Game'}
						</button>
					</div>
				</div>

				{message ? (
					<div className="mt-4 rounded-lg border border-darkyellow bg-lightyellow px-4 py-3 font-inter text-sm text-sky-900">
						{message}
					</div>
				) : null}

				{loadingDetail ? (
					<p className="mt-6 font-inter text-sm text-sky-900">Loading game details...</p>
				) : (
					<div className="mt-6 space-y-6">
						<div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
							<label className="block font-Young_Serif text-xl text-sky-900">
								AI Prompt
								<textarea
									className="mt-2 min-h-28 w-full rounded-lg border-2 border-green-700 p-3 font-inter text-sm text-sky-900 outline-none focus:border-green-500"
									value={editor.sourcePrompt}
									onChange={(event) => updateEditor('sourcePrompt', event.target.value)}
									placeholder='Example: "History of Oakley Idaho, 20 events"'
								/>
							</label>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<label className="block font-Young_Serif text-xl text-sky-900">
								Title
								<input
									className="mt-2 w-full rounded-lg border-2 border-green-700 p-3 font-inter text-sm outline-none focus:border-green-500"
									value={editor.title}
									onChange={(event) => updateTitle(event.target.value)}
									placeholder="Oakley Idaho History"
								/>
							</label>
							<label className="block font-Young_Serif text-xl text-sky-900">
								Slug
								<input
									className="mt-2 w-full rounded-lg border-2 border-green-700 p-3 font-inter text-sm outline-none focus:border-green-500"
									value={editor.slug}
									onChange={(event) => updateEditor('slug', slugifyTimelineGame(event.target.value))}
									placeholder="oakley-idaho-history"
								/>
							</label>
						</div>

						<label className="block font-Young_Serif text-xl text-sky-900">
							Description
							<textarea
								className="mt-2 min-h-24 w-full rounded-lg border-2 border-green-700 p-3 font-inter text-sm text-sky-900 outline-none focus:border-green-500"
								value={editor.description}
								onChange={(event) => updateEditor('description', event.target.value)}
								placeholder="Place the events in the correct order from earliest to latest."
							/>
						</label>

						<label className="flex items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 font-inter text-sm text-sky-900">
							<input
								type="checkbox"
								checked={editor.isPublished}
								onChange={(event) => updateEditor('isPublished', event.target.checked)}
							/>
							Publish to the Play section
						</label>

						<div className="flex items-center justify-between gap-3">
							<div>
								<h3 className="font-Young_Serif text-2xl text-sky-900">Year + Event Pairs</h3>
								<p className="mt-1 font-inter text-sm text-sky-900">
									Players see the event cards and drag them into chronological order.
								</p>
							</div>
							<button
								type="button"
								onClick={addEvent}
								className="rounded border-2 border-green-700 px-3 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
							>
								Add Event
							</button>
						</div>

						{duplicateYears.length > 0 ? (
							<div className="rounded-lg border border-orange bg-orange/10 px-4 py-3 font-inter text-sm text-sky-900">
								Duplicate years detected: {duplicateYears.join(', ')}. The game works
								best when each event has a distinct year.
							</div>
						) : null}

						<div className="space-y-3">
							{editor.events.map((entry, index) => (
								<div
									key={`${index}-${editor.id ?? 'draft'}`}
									className="rounded-lg border-2 border-green-700 bg-white p-4 shadow-sm"
								>
									<div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_auto]">
										<label className="font-inter text-sm text-sky-900">
											Year
											<input
												type="number"
												className="mt-2 w-full rounded border-2 border-green-700 p-2 outline-none focus:border-green-500"
												value={entry.year}
												onChange={(event) => updateEvent(index, 'year', event.target.value)}
												placeholder="1907"
											/>
										</label>
										<label className="font-inter text-sm text-sky-900">
											Event
											<textarea
												className="mt-2 min-h-24 w-full rounded border-2 border-green-700 p-2 outline-none focus:border-green-500"
												value={entry.event}
												onChange={(event) => updateEvent(index, 'event', event.target.value)}
												placeholder="Oakley becomes known for..."
											/>
										</label>
										<div className="flex items-end">
											<button
												type="button"
												onClick={() => removeEvent(index)}
												disabled={editor.events.length <= 3}
												className="rounded border-2 border-red-500 px-3 py-2 font-inter text-sm text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
											>
												Remove
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</section>
		</div>
	)
}
