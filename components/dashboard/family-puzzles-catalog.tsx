'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { AvatarStylePreset, PuzzleDifficulty } from '@/lib/family-puzzles/types'

type PuzzleListItem = {
	id: number
	title: string
	difficulty: PuzzleDifficulty
	avatarStylePreset: AvatarStylePreset
	status: 'draft' | 'published'
	updatedAt: string
}

export default function FamilyPuzzlesCatalog() {
	const [difficulty, setDifficulty] = useState<PuzzleDifficulty>('easy')
	const [avatarStylePreset, setAvatarStylePreset] = useState<AvatarStylePreset>('classic_cartoon')
	const [peopleCount, setPeopleCount] = useState('')
	const [clueCount, setClueCount] = useState('')
	const [generateAvatars, setGenerateAvatars] = useState(true)
	const [loading, setLoading] = useState(true)
	const [creating, setCreating] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [puzzles, setPuzzles] = useState<PuzzleListItem[]>([])

	async function load() {
		setLoading(true)
		const response = await fetch('/api/admin/family-puzzles', { cache: 'no-store' })
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			puzzles?: PuzzleListItem[]
		}
		if (!response.ok) {
			setMessage(payload.error ?? 'Could not load puzzles.')
			setPuzzles([])
			setLoading(false)
			return
		}
		setPuzzles(payload.puzzles ?? [])
		setLoading(false)
	}

	useEffect(() => {
		void (async () => {
			const response = await fetch('/api/admin/family-puzzles', { cache: 'no-store' })
			const payload = (await response.json().catch(() => ({}))) as {
				error?: string
				puzzles?: PuzzleListItem[]
			}
			if (!response.ok) {
				setMessage(payload.error ?? 'Could not load puzzles.')
				setPuzzles([])
				setLoading(false)
				return
			}
			setPuzzles(payload.puzzles ?? [])
			setLoading(false)
		})()
	}, [])

	async function generatePuzzle() {
		setCreating(true)
		setMessage(null)
		const response = await fetch('/api/admin/family-puzzles', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				difficulty,
				avatarStylePreset,
				peopleCount: peopleCount ? Number(peopleCount) : undefined,
				clueCount: clueCount ? Number(clueCount) : undefined,
				generateAvatars,
			}),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			id?: number
		}
		if (!response.ok || typeof payload.id !== 'number') {
			setMessage(payload.error ?? 'Could not generate puzzle.')
			setCreating(false)
			return
		}
		setMessage('Puzzle generated. Open it to refine clues, people, and slots.')
		setCreating(false)
		await load()
	}

	return (
		<div className="space-y-4">
			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<h2 className="font-Young_Serif text-2xl text-sky-900">Generate New Puzzle</h2>
				<div className="mt-3 grid gap-2 md:grid-cols-5">
					<label className="font-inter text-xs text-sky-900">
						Difficulty
						<select
							className="mt-1 w-full rounded border-2 border-green-700 p-2 bg-white"
							value={difficulty}
							onChange={(event) => setDifficulty(event.target.value as PuzzleDifficulty)}
						>
							<option value="easy">easy</option>
							<option value="intermediate">intermediate</option>
							<option value="hard">hard</option>
						</select>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Avatar Style
						<select
							className="mt-1 w-full rounded border-2 border-green-700 p-2 bg-white"
							value={avatarStylePreset}
							onChange={(event) =>
								setAvatarStylePreset(event.target.value as AvatarStylePreset)
							}
						>
							<option value="classic_cartoon">Classic Cartoon</option>
							<option value="storybook">Storybook</option>
							<option value="bold_comic">Bold Comic</option>
							<option value="soft_painterly">Soft Painterly</option>
						</select>
					</label>
					<label className="font-inter text-xs text-sky-900">
						People count (optional)
						<input
							className="mt-1 w-full rounded border-2 border-green-700 p-2"
							type="number"
							value={peopleCount}
							onChange={(event) => setPeopleCount(event.target.value)}
						/>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Clue count (optional)
						<input
							className="mt-1 w-full rounded border-2 border-green-700 p-2"
							type="number"
							value={clueCount}
							onChange={(event) => setClueCount(event.target.value)}
						/>
					</label>
					<div className="flex items-end">
						<label className="font-inter text-sm text-sky-900 flex items-center gap-2">
							<input
								type="checkbox"
								checked={generateAvatars}
								onChange={(event) => setGenerateAvatars(event.target.checked)}
							/>
							Generate avatars now
						</label>
					</div>
				</div>
				<button
					type="button"
					onClick={() => void generatePuzzle()}
					disabled={creating}
					className="mt-3 rounded bg-green-700 px-4 py-2 font-inter text-sm text-white transition hover:bg-green-500 disabled:opacity-70"
				>
					{creating ? 'Generating...' : 'Generate Puzzle'}
				</button>
			</div>

			{message ? (
				<p className="rounded-lg border-2 border-sky-300 bg-sky-100 p-3 font-inter text-sky-900">
					{message}
				</p>
			) : null}

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<h2 className="font-Young_Serif text-2xl text-sky-900">Existing Puzzles</h2>
				{loading ? (
					<p className="mt-2 font-inter text-sky-900">Loading puzzles...</p>
				) : puzzles.length === 0 ? (
					<p className="mt-2 font-inter text-sky-900">No puzzles yet.</p>
				) : (
					<div className="mt-3 space-y-2">
						{puzzles.map((puzzle) => (
							<div
								key={puzzle.id}
								className="flex flex-wrap items-center justify-between gap-2 rounded border border-sky-200 p-3"
							>
								<div>
									<p className="font-Young_Serif text-xl text-sky-900">{puzzle.title}</p>
									<p className="font-inter text-xs text-sky-900">
										{puzzle.difficulty} | {puzzle.avatarStylePreset} | {puzzle.status} | updated{' '}
										{new Date(puzzle.updatedAt).toLocaleString()}
									</p>
								</div>
								<Link
									href={`/dashboard/family-puzzles/${puzzle.id}`}
									className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
								>
									Edit Puzzle
								</Link>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
