'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AvatarStylePreset, PuzzleDifficulty, RelationshipType } from '@/lib/family-puzzles/types'

type EditorPuzzle = {
	id: number
	title: string
	difficulty: PuzzleDifficulty
	avatarStylePreset: AvatarStylePreset
	status: 'draft' | 'published'
	prefilledSlotKeys: string[]
	people: Array<{
		personCode: string
		fullName: string
		gender: 'female' | 'male' | 'nonbinary'
		age: number
		generation: number
		occupation: string
		hobby: string
		avatarPrompt: string
		avatarUrl: string
		targetSlotKey: string
	}>
	relationships: Array<{
		fromPersonCode: string
		toPersonCode: string
		relationshipType: RelationshipType
	}>
	clues: Array<{
		clueText: string
		clueBand: PuzzleDifficulty
		sortOrder: number
	}>
	slots: Array<{
		slotKey: string
		generation: number
		x: number
		y: number
		isLocked: boolean
		label: string | null
	}>
	slotLinks: Array<{
		fromSlotKey: string
		toSlotKey: string
		linkType: 'spouse' | 'parent_child'
	}>
}

const relationshipOptions: RelationshipType[] = [
	'spouse',
	'divorced_spouse',
	'parent',
	'adoptive_parent',
	'step_parent',
]

export default function FamilyPuzzleEditor({ puzzleId }: { puzzleId: number }) {
	const [puzzle, setPuzzle] = useState<EditorPuzzle | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [regeneratingClues, setRegeneratingClues] = useState(false)
	const [regeneratingAvatars, setRegeneratingAvatars] = useState(false)
	const [rebuildingLayout, setRebuildingLayout] = useState(false)
	const [publishing, setPublishing] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	useEffect(() => {
		void (async () => {
			setLoading(true)
			const response = await fetch(`/api/admin/family-puzzles?id=${puzzleId}`, {
				cache: 'no-store',
			})
			const payload = (await response.json().catch(() => ({}))) as {
				error?: string
				puzzle?: EditorPuzzle
			}
			if (!response.ok || !payload.puzzle) {
				setMessage(payload.error ?? 'Could not load puzzle.')
				setLoading(false)
				return
			}
			setPuzzle(payload.puzzle)
			setLoading(false)
		})()
	}, [puzzleId])

	const personCodes = useMemo(
		() => (puzzle ? puzzle.people.map((person) => person.personCode) : []),
		[puzzle]
	)
	const slotKeys = useMemo(
		() => (puzzle ? puzzle.slots.map((slot) => slot.slotKey) : []),
		[puzzle]
	)

	if (loading) {
		return <p className="font-inter text-sky-900">Loading puzzle...</p>
	}

	if (!puzzle) {
		return <p className="font-inter text-red-600">{message ?? 'Puzzle not found.'}</p>
	}

	function updatePuzzle(updater: (current: EditorPuzzle) => EditorPuzzle) {
		setPuzzle((current) => (current ? updater(current) : current))
	}
	const puzzleIdValue = puzzle.id
	const puzzleAvatarStylePreset = puzzle.avatarStylePreset

	async function save() {
		setSaving(true)
		setMessage(null)
		const response = await fetch('/api/admin/family-puzzles', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(puzzle),
		})
		const payload = (await response.json().catch(() => ({}))) as { error?: string }
		if (!response.ok) {
			setMessage(payload.error ?? 'Could not save puzzle.')
			setSaving(false)
			return
		}
		setSaving(false)
		setMessage('Puzzle saved successfully.')
	}

	async function setPublished(published: boolean) {
		setPublishing(true)
		setMessage(null)
			const response = await fetch(`/api/admin/family-puzzles/${puzzleIdValue}/publish`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ published }),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			status?: 'draft' | 'published'
		}
		if (!response.ok || !payload.status) {
			setMessage(payload.error ?? 'Could not update publish status.')
			setPublishing(false)
			return
		}
			updatePuzzle((current) => ({ ...current, status: payload.status! }))
		setPublishing(false)
		setMessage(payload.status === 'published' ? 'Puzzle published.' : 'Puzzle moved to draft.')
	}

	async function regenerateClues() {
		setRegeneratingClues(true)
		setMessage(null)
			const response = await fetch(`/api/admin/family-puzzles/${puzzleIdValue}/clues`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			clues?: EditorPuzzle['clues']
		}
		if (!response.ok || !payload.clues) {
			setMessage(payload.error ?? 'Could not regenerate clues.')
			setRegeneratingClues(false)
			return
		}
			updatePuzzle((current) => ({ ...current, clues: payload.clues! }))
		setRegeneratingClues(false)
		setMessage('Clues regenerated. Review and refine before publishing.')
	}

	async function regenerateAvatars() {
		setRegeneratingAvatars(true)
		setMessage(null)
				const response = await fetch(`/api/admin/family-puzzles/${puzzleIdValue}/avatars`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ avatarStylePreset: puzzleAvatarStylePreset }),
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			people?: EditorPuzzle['people']
			avatarStylePreset?: AvatarStylePreset
		}
		if (!response.ok || !payload.people) {
			setMessage(payload.error ?? 'Could not regenerate avatars.')
			setRegeneratingAvatars(false)
			return
		}
			updatePuzzle((current) => ({
				...current,
				avatarStylePreset: payload.avatarStylePreset ?? current.avatarStylePreset,
				people: payload.people!,
			}))
		setRegeneratingAvatars(false)
		setMessage('Avatars regenerated.')
	}

	async function rebuildLayout() {
		setRebuildingLayout(true)
		setMessage(null)
		const response = await fetch(`/api/admin/family-puzzles/${puzzleIdValue}/layout`, {
			method: 'POST',
		})
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string
			people?: EditorPuzzle['people']
			slots?: EditorPuzzle['slots']
			slotLinks?: EditorPuzzle['slotLinks']
		}
		if (!response.ok || !payload.people || !payload.slots || !payload.slotLinks) {
			setMessage(payload.error ?? 'Could not rebuild layout.')
			setRebuildingLayout(false)
			return
		}
		updatePuzzle((current) => ({
			...current,
			people: payload.people!,
			slots: payload.slots!,
			slotLinks: payload.slotLinks!,
		}))
		setRebuildingLayout(false)
		setMessage('Layout rebuilt from relationship graph.')
	}

	function updatePerson(index: number, patch: Partial<EditorPuzzle['people'][number]>) {
		if (!puzzle) return
		const next: EditorPuzzle = structuredClone(puzzle)
		next.people[index] = { ...next.people[index], ...patch }
		setPuzzle(next)
	}

	function updateRelationship(
		index: number,
		patch: Partial<EditorPuzzle['relationships'][number]>
	) {
		if (!puzzle) return
		const next: EditorPuzzle = structuredClone(puzzle)
		next.relationships[index] = { ...next.relationships[index], ...patch }
		setPuzzle(next)
	}

	function updateClue(index: number, patch: Partial<EditorPuzzle['clues'][number]>) {
		if (!puzzle) return
		const next: EditorPuzzle = structuredClone(puzzle)
		next.clues[index] = { ...next.clues[index], ...patch }
		setPuzzle(next)
	}

	function updateSlot(index: number, patch: Partial<EditorPuzzle['slots'][number]>) {
		if (!puzzle) return
		const next: EditorPuzzle = structuredClone(puzzle)
		next.slots[index] = { ...next.slots[index], ...patch }
		setPuzzle(next)
	}

	function updateSlotLink(index: number, patch: Partial<EditorPuzzle['slotLinks'][number]>) {
		if (!puzzle) return
		const next: EditorPuzzle = structuredClone(puzzle)
		next.slotLinks[index] = { ...next.slotLinks[index], ...patch }
		setPuzzle(next)
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="font-Young_Serif text-3xl text-sky-900">{puzzle.title}</h1>
				<p className="font-inter text-sm text-sky-900 mt-1">
					Status: <span className="font-medium">{puzzle.status}</span>
				</p>
			</div>

			{message ? (
				<p className="rounded-lg border-2 border-sky-300 bg-sky-100 p-3 font-inter text-sky-900">
					{message}
				</p>
			) : null}

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<h2 className="font-Young_Serif text-2xl text-sky-900">Puzzle Settings</h2>
				<div className="mt-3 grid gap-2 md:grid-cols-3">
					<label className="font-inter text-xs text-sky-900">
						Title
						<input
							className="mt-1 w-full rounded border-2 border-green-700 p-2"
							value={puzzle.title}
							onChange={(event) => setPuzzle({ ...puzzle, title: event.target.value })}
						/>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Difficulty
						<select
							className="mt-1 w-full rounded border-2 border-green-700 p-2 bg-white"
							value={puzzle.difficulty}
							onChange={(event) =>
								setPuzzle({ ...puzzle, difficulty: event.target.value as PuzzleDifficulty })
							}
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
							value={puzzle.avatarStylePreset}
							onChange={(event) =>
								setPuzzle({
									...puzzle,
									avatarStylePreset: event.target.value as AvatarStylePreset,
								})
							}
						>
							<option value="classic_cartoon">Classic Cartoon</option>
							<option value="storybook">Storybook</option>
							<option value="bold_comic">Bold Comic</option>
							<option value="soft_painterly">Soft Painterly</option>
						</select>
					</label>
					<label className="font-inter text-xs text-sky-900">
						Prefilled slot keys (comma separated)
						<input
							className="mt-1 w-full rounded border-2 border-green-700 p-2"
							value={puzzle.prefilledSlotKeys.join(', ')}
							onChange={(event) =>
								setPuzzle({
									...puzzle,
									prefilledSlotKeys: event.target.value
										.split(',')
										.map((entry) => entry.trim())
										.filter(Boolean),
								})
							}
						/>
					</label>
				</div>
				<div className="mt-3 flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => void save()}
						disabled={saving}
						className="rounded bg-green-700 px-4 py-2 font-inter text-sm text-white transition hover:bg-green-500 disabled:opacity-70"
					>
						{saving ? 'Saving...' : 'Save Puzzle'}
					</button>
					<button
						type="button"
						onClick={() => void setPublished(puzzle.status !== 'published')}
						disabled={publishing}
						className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white disabled:opacity-70"
					>
						{publishing
							? 'Updating...'
							: puzzle.status === 'published'
								? 'Unpublish (Move to Draft)'
								: 'Publish Puzzle'}
					</button>
					<button
						type="button"
						onClick={() => void regenerateClues()}
						disabled={regeneratingClues}
						className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white disabled:opacity-70"
					>
						{regeneratingClues ? 'Regenerating clues...' : 'Regenerate Clues'}
					</button>
					<button
						type="button"
						onClick={() => void regenerateAvatars()}
						disabled={regeneratingAvatars}
						className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white disabled:opacity-70"
					>
						{regeneratingAvatars ? 'Regenerating avatars...' : 'Regenerate Avatars'}
					</button>
					<button
						type="button"
						onClick={() => void rebuildLayout()}
						disabled={rebuildingLayout}
						className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white disabled:opacity-70"
					>
						{rebuildingLayout ? 'Rebuilding layout...' : 'Rebuild Layout'}
					</button>
				</div>
			</div>

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">People</h2>
					<button
						type="button"
						onClick={() =>
							setPuzzle({
								...puzzle,
								people: [
									...puzzle.people,
									{
										personCode: `p${puzzle.people.length + 1}`,
										fullName: 'New Person',
										gender: 'female',
										age: 30,
										generation: 1,
										occupation: '',
										hobby: '',
										avatarPrompt: '',
										avatarUrl: '',
										targetSlotKey: slotKeys[0] ?? '',
									},
								],
							})
						}
						className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Add Person
					</button>
				</div>
				<div className="mt-3 space-y-3">
					{puzzle.people.map((person, index) => (
						<div key={`${person.personCode}_${index}`} className="rounded border border-sky-200 p-3">
							<div className="grid gap-2 md:grid-cols-4">
								<label className="font-inter text-xs text-sky-900">
									Code
									<input
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.personCode}
										onChange={(event) =>
											updatePerson(index, { personCode: event.target.value })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Name
									<input
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.fullName}
										onChange={(event) =>
											updatePerson(index, { fullName: event.target.value })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Gender
									<select
										className="mt-1 w-full rounded border border-sky-300 p-2 bg-white"
										value={person.gender}
										onChange={(event) =>
											updatePerson(index, {
												gender: event.target.value as EditorPuzzle['people'][number]['gender'],
											})
										}
									>
										<option value="female">female</option>
										<option value="male">male</option>
									</select>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Age
									<input
										type="number"
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.age}
										onChange={(event) =>
											updatePerson(index, { age: Number(event.target.value) })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Generation
									<input
										type="number"
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.generation}
										onChange={(event) =>
											updatePerson(index, { generation: Number(event.target.value) })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Occupation
									<input
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.occupation}
										onChange={(event) =>
											updatePerson(index, { occupation: event.target.value })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Hobby
									<input
										className="mt-1 w-full rounded border border-sky-300 p-2"
										value={person.hobby}
										onChange={(event) =>
											updatePerson(index, { hobby: event.target.value })
										}
									/>
								</label>
								<label className="font-inter text-xs text-sky-900">
									Target Slot
									<select
										className="mt-1 w-full rounded border border-sky-300 p-2 bg-white"
										value={person.targetSlotKey}
										onChange={(event) =>
											updatePerson(index, { targetSlotKey: event.target.value })
										}
									>
										{slotKeys.map((slotKey) => (
											<option key={slotKey} value={slotKey}>
												{slotKey}
											</option>
										))}
									</select>
								</label>
							</div>
							<label className="mt-2 block font-inter text-xs text-sky-900">
								Avatar Prompt
								<input
									className="mt-1 w-full rounded border border-sky-300 p-2"
									value={person.avatarPrompt}
									onChange={(event) =>
										updatePerson(index, { avatarPrompt: event.target.value })
									}
								/>
							</label>
							<label className="mt-2 block font-inter text-xs text-sky-900">
								Avatar URL
								<input
									className="mt-1 w-full rounded border border-sky-300 p-2"
									value={person.avatarUrl}
									onChange={(event) =>
										updatePerson(index, { avatarUrl: event.target.value })
									}
								/>
							</label>
							<button
								type="button"
								onClick={() =>
									setPuzzle({
										...puzzle,
										people: puzzle.people.filter((_, personIndex) => personIndex !== index),
									})
								}
								className="mt-2 rounded border-2 border-orange px-3 py-1 text-sm font-inter text-orange transition hover:bg-orange hover:text-white"
							>
								Remove Person
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Relationships</h2>
					<button
						type="button"
						onClick={() =>
							setPuzzle({
								...puzzle,
								relationships: [
									...puzzle.relationships,
									{
										fromPersonCode: personCodes[0] ?? '',
										toPersonCode: personCodes[1] ?? personCodes[0] ?? '',
										relationshipType: 'parent',
									},
								],
							})
						}
						className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Add Relationship
					</button>
				</div>
				<div className="mt-3 space-y-2">
					{puzzle.relationships.map((relationship, index) => (
						<div key={`${relationship.fromPersonCode}_${relationship.toPersonCode}_${index}`} className="grid gap-2 md:grid-cols-4">
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={relationship.fromPersonCode}
								onChange={(event) =>
									updateRelationship(index, { fromPersonCode: event.target.value })
								}
							>
								{personCodes.map((code) => (
									<option key={code} value={code}>
										{code}
									</option>
								))}
							</select>
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={relationship.relationshipType}
								onChange={(event) =>
									updateRelationship(index, {
										relationshipType: event.target.value as RelationshipType,
									})
								}
							>
								{relationshipOptions.map((entry) => (
									<option key={entry} value={entry}>
										{entry}
									</option>
								))}
							</select>
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={relationship.toPersonCode}
								onChange={(event) =>
									updateRelationship(index, { toPersonCode: event.target.value })
								}
							>
								{personCodes.map((code) => (
									<option key={code} value={code}>
										{code}
									</option>
								))}
							</select>
							<button
								type="button"
								onClick={() =>
									setPuzzle({
										...puzzle,
										relationships: puzzle.relationships.filter(
											(_, relationshipIndex) => relationshipIndex !== index
										),
									})
								}
								className="rounded border-2 border-orange px-2 py-1 text-sm font-inter text-orange transition hover:bg-orange hover:text-white"
							>
								Remove
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Clues</h2>
					<button
						type="button"
						onClick={() =>
							setPuzzle({
								...puzzle,
								clues: [
									...puzzle.clues,
									{
										clueText: 'New clue',
										clueBand: puzzle.difficulty,
										sortOrder: puzzle.clues.length,
									},
								],
							})
						}
						className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Add Clue
					</button>
				</div>
				<div className="mt-3 space-y-2">
					{puzzle.clues.map((clue, index) => (
						<div key={`${index}_${clue.clueText.slice(0, 8)}`} className="grid gap-2 md:grid-cols-[1fr_170px_70px]">
							<input
								className="rounded border border-sky-300 p-2 font-inter text-sm"
								value={clue.clueText}
								onChange={(event) => updateClue(index, { clueText: event.target.value })}
							/>
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={clue.clueBand}
								onChange={(event) =>
									updateClue(index, { clueBand: event.target.value as PuzzleDifficulty })
								}
							>
								<option value="easy">easy</option>
								<option value="intermediate">intermediate</option>
								<option value="hard">hard</option>
							</select>
							<button
								type="button"
								onClick={() =>
									setPuzzle({
										...puzzle,
										clues: puzzle.clues.filter((_, clueIndex) => clueIndex !== index),
									})
								}
								className="rounded border-2 border-orange px-2 py-1 text-sm font-inter text-orange transition hover:bg-orange hover:text-white"
							>
								Del
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Slots</h2>
					<button
						type="button"
						onClick={() =>
							setPuzzle({
								...puzzle,
								slots: [
									...puzzle.slots,
									{
										slotKey: `slot_${puzzle.slots.length + 1}`,
										generation: 0,
										x: 50,
										y: 50,
										isLocked: false,
										label: null,
									},
								],
							})
						}
						className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Add Slot
					</button>
				</div>
				<div className="mt-3 space-y-2">
					{puzzle.slots.map((slot, index) => (
						<div key={`${slot.slotKey}_${index}`} className="grid gap-2 md:grid-cols-7">
							<input
								className="rounded border border-sky-300 p-2 font-inter text-xs"
								value={slot.slotKey}
								onChange={(event) => updateSlot(index, { slotKey: event.target.value })}
							/>
							<input
								type="number"
								className="rounded border border-sky-300 p-2 font-inter text-xs"
								value={slot.generation}
								onChange={(event) =>
									updateSlot(index, { generation: Number(event.target.value) })
								}
							/>
							<input
								type="number"
								step="0.01"
								className="rounded border border-sky-300 p-2 font-inter text-xs"
								value={slot.x}
								onChange={(event) => updateSlot(index, { x: Number(event.target.value) })}
							/>
							<input
								type="number"
								step="0.01"
								className="rounded border border-sky-300 p-2 font-inter text-xs"
								value={slot.y}
								onChange={(event) => updateSlot(index, { y: Number(event.target.value) })}
							/>
							<label className="font-inter text-xs text-sky-900 flex items-center gap-2">
								<input
									type="checkbox"
									checked={slot.isLocked}
									onChange={(event) =>
										updateSlot(index, { isLocked: event.target.checked })
									}
								/>
								locked
							</label>
							<input
								className="rounded border border-sky-300 p-2 font-inter text-xs"
								value={slot.label ?? ''}
								onChange={(event) => updateSlot(index, { label: event.target.value || null })}
							/>
							<button
								type="button"
								onClick={() =>
									setPuzzle({
										...puzzle,
										slots: puzzle.slots.filter((_, slotIndex) => slotIndex !== index),
									})
								}
								className="rounded border-2 border-orange px-2 py-1 text-sm font-inter text-orange transition hover:bg-orange hover:text-white"
							>
								Del
							</button>
						</div>
					))}
				</div>
			</div>

			<div className="rounded-lg border-2 border-green-700 bg-white p-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Slot Links</h2>
					<button
						type="button"
						onClick={() =>
							setPuzzle({
								...puzzle,
								slotLinks: [
									...puzzle.slotLinks,
									{
										fromSlotKey: slotKeys[0] ?? '',
										toSlotKey: slotKeys[1] ?? slotKeys[0] ?? '',
										linkType: 'parent_child',
									},
								],
							})
						}
						className="rounded border-2 border-green-700 px-3 py-1 text-sm font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Add Link
					</button>
				</div>
				<div className="mt-3 space-y-2">
					{puzzle.slotLinks.map((slotLink, index) => (
						<div key={`${slotLink.fromSlotKey}_${slotLink.toSlotKey}_${index}`} className="grid gap-2 md:grid-cols-4">
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={slotLink.fromSlotKey}
								onChange={(event) =>
									updateSlotLink(index, { fromSlotKey: event.target.value })
								}
							>
								{slotKeys.map((slotKey) => (
									<option key={slotKey} value={slotKey}>
										{slotKey}
									</option>
								))}
							</select>
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={slotLink.linkType}
								onChange={(event) =>
									updateSlotLink(index, {
										linkType: event.target.value as 'spouse' | 'parent_child',
									})
								}
							>
								<option value="parent_child">parent_child</option>
								<option value="spouse">spouse</option>
							</select>
							<select
								className="rounded border border-sky-300 p-2 font-inter text-sm bg-white"
								value={slotLink.toSlotKey}
								onChange={(event) =>
									updateSlotLink(index, { toSlotKey: event.target.value })
								}
							>
								{slotKeys.map((slotKey) => (
									<option key={slotKey} value={slotKey}>
										{slotKey}
									</option>
								))}
							</select>
							<button
								type="button"
								onClick={() =>
									setPuzzle({
										...puzzle,
										slotLinks: puzzle.slotLinks.filter(
											(_, slotLinkIndex) => slotLinkIndex !== index
										),
									})
								}
								className="rounded border-2 border-orange px-2 py-1 text-sm font-inter text-orange transition hover:bg-orange hover:text-white"
							>
								Remove
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
