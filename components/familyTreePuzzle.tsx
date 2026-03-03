'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PublicPuzzlePayload, PuzzleDifficulty } from '@/lib/family-puzzles/types'

type ValidationResult = {
	solved: boolean
	correctCount: number
	totalCount: number
	hasDuplicateSlot: boolean
}

const difficulties: PuzzleDifficulty[] = ['easy', 'intermediate', 'hard']

function normalizePlacements(
	payload: PublicPuzzlePayload
): Record<string, string> {
	return payload.prefilledAssignments.reduce<Record<string, string>>((acc, entry) => {
		acc[entry.personCode] = entry.slotKey
		return acc
	}, {})
}

export default function FamilyTreePuzzle() {
	const [difficulty, setDifficulty] = useState<PuzzleDifficulty>('easy')
	const [puzzle, setPuzzle] = useState<PublicPuzzlePayload | null>(null)
	const [loading, setLoading] = useState(true)
	const [placements, setPlacements] = useState<Record<string, string>>({})
	const [activePersonCode, setActivePersonCode] = useState<string | null>(null)
	const [draggingPersonCode, setDraggingPersonCode] = useState<string | null>(null)
	const [hoveredSlotKey, setHoveredSlotKey] = useState<string | null>(null)
	const [result, setResult] = useState<ValidationResult | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	useEffect(() => {
		void (async () => {
			setLoading(true)
			setMessage(null)
			setResult(null)
			const response = await fetch(`/api/family-puzzles?difficulty=${difficulty}`, {
				cache: 'no-store',
			})
			const payload = (await response.json().catch(() => ({}))) as {
				error?: string
				puzzle?: PublicPuzzlePayload | null
			}
			if (!response.ok) {
				setMessage(payload.error ?? 'Could not load puzzle.')
				setPuzzle(null)
				setLoading(false)
				return
			}
			if (!payload.puzzle) {
				setPuzzle(null)
				setPlacements({})
				setActivePersonCode(null)
				setMessage('No published puzzle available for this difficulty yet.')
				setLoading(false)
				return
			}
			setPuzzle(payload.puzzle)
			setPlacements(normalizePlacements(payload.puzzle))
			setActivePersonCode(null)
			setLoading(false)
		})()
	}, [difficulty])

	const slotMap = useMemo(
		() => new Map((puzzle?.slots ?? []).map((slot) => [slot.slotKey, slot])),
		[puzzle]
	)
	const connectorSegments = useMemo(() => {
		if (!puzzle) return [] as Array<{ x1: number; y1: number; x2: number; y2: number }>
		const nodeRadius = 4.2
		const spouseLinks = puzzle.slotLinks.filter((link) => link.linkType === 'spouse')
		const parentLinks = puzzle.slotLinks.filter((link) => link.linkType === 'parent_child')

		const spouseByPair = new Map<string, { leftSlot: string; rightSlot: string }>()
		const pairKey = (a: string, b: string) => [a, b].sort().join('::')
		for (const link of spouseLinks) {
			spouseByPair.set(pairKey(link.fromSlotKey, link.toSlotKey), {
				leftSlot: link.fromSlotKey,
				rightSlot: link.toSlotKey,
			})
		}

		const parentsByChild = new Map<string, Set<string>>()
		for (const link of parentLinks) {
			if (!parentsByChild.has(link.toSlotKey)) {
				parentsByChild.set(link.toSlotKey, new Set<string>())
			}
			parentsByChild.get(link.toSlotKey)!.add(link.fromSlotKey)
		}

		const childrenByPair = new Map<string, string[]>()
		for (const [childSlotKey, parents] of parentsByChild.entries()) {
			const parentList = Array.from(parents)
			if (parentList.length < 2) continue
			let matchedPairKey: string | null = null
			for (let index = 0; index < parentList.length; index += 1) {
				for (let nextIndex = index + 1; nextIndex < parentList.length; nextIndex += 1) {
					const candidateKey = pairKey(parentList[index], parentList[nextIndex])
					if (spouseByPair.has(candidateKey)) {
						matchedPairKey = candidateKey
						break
					}
				}
				if (matchedPairKey) break
			}
			if (!matchedPairKey) continue
			if (!childrenByPair.has(matchedPairKey)) {
				childrenByPair.set(matchedPairKey, [])
			}
			childrenByPair.get(matchedPairKey)!.push(childSlotKey)
		}

		const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
		for (const [key, pair] of spouseByPair.entries()) {
			const left = slotMap.get(pair.leftSlot)
			const right = slotMap.get(pair.rightSlot)
			if (!left || !right) continue
			const x1 = Math.min(left.x, right.x)
			const x2 = Math.max(left.x, right.x)
			const y = Number(((left.y + right.y) / 2).toFixed(2))
			segments.push({ x1, y1: y, x2, y2: y })

			const children = (childrenByPair.get(key) ?? [])
				.map((slotKey) => slotMap.get(slotKey))
				.filter(
					(slot): slot is { slotKey: string; generation: number; x: number; y: number; isLocked: boolean; label: string | null } =>
						Boolean(slot)
				)
				.sort((a, b) => a.x - b.x)
			if (children.length === 0) continue

			const midX = Number(((left.x + right.x) / 2).toFixed(2))
			const minChildTopY = Math.min(...children.map((child) => child.y - nodeRadius))
			const branchY = Number(Math.max(y + 5, minChildTopY - 6).toFixed(2))
			const firstChildX = children[0].x
			const lastChildX = children[children.length - 1].x

			segments.push({ x1: midX, y1: y, x2: midX, y2: branchY })
			segments.push({ x1: firstChildX, y1: branchY, x2: lastChildX, y2: branchY })
			for (const child of children) {
				segments.push({
					x1: child.x,
					y1: branchY,
					x2: child.x,
					y2: Number((child.y - nodeRadius).toFixed(2)),
				})
			}
		}

		return segments
	}, [puzzle, slotMap])
	const peopleMap = useMemo(
		() => new Map((puzzle?.people ?? []).map((person) => [person.personCode, person])),
		[puzzle]
	)
	const prefilledPersonCodes = useMemo(
		() => new Set((puzzle?.prefilledAssignments ?? []).map((entry) => entry.personCode)),
		[puzzle]
	)
	const personBySlot = useMemo(() => {
		const entries = Object.entries(placements).map(([personCode, slotKey]) => [slotKey, personCode] as const)
		return new Map(entries)
	}, [placements])

	const trayPeople = useMemo(() => {
		if (!puzzle) return []
		return puzzle.people.filter((person) => !placements[person.personCode])
	}, [puzzle, placements])

	function assignPerson(personCode: string, slotKey: string) {
		if (!puzzle) return
		const isLocked = puzzle.prefilledAssignments.some(
			(entry) => entry.slotKey === slotKey
		)
		if (isLocked) return

		setPlacements((prev) => {
			const next = { ...prev }
			const occupyingPersonCode = Object.entries(next).find(
				([candidatePersonCode, candidateSlotKey]) =>
					candidateSlotKey === slotKey && !prefilledPersonCodes.has(candidatePersonCode)
			)?.[0]
			if (occupyingPersonCode) {
				delete next[occupyingPersonCode]
			}
			next[personCode] = slotKey
			return next
		})
		setActivePersonCode(null)
	}

	function removeFromSlot(slotKey: string) {
		setPlacements((prev) => {
			const next = { ...prev }
			for (const [personCode, placedSlot] of Object.entries(next)) {
				if (placedSlot === slotKey && !prefilledPersonCodes.has(personCode)) {
					delete next[personCode]
				}
			}
			return next
		})
	}

	function resetUnfilledAssignments() {
		if (!puzzle) return
		setPlacements(normalizePlacements(puzzle))
		setResult(null)
		setActivePersonCode(null)
	}

	async function checkAnswer() {
		if (!puzzle) return
		setMessage(null)
		setResult(null)
		const response = await fetch(`/api/family-puzzles/${puzzle.id}/validate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ placements }),
		})
		const payload = (await response.json().catch(() => ({}))) as
			| ValidationResult
			| { error?: string }
		if (!response.ok) {
			const errorPayload = payload as { error?: string }
			setMessage(errorPayload.error ?? 'Could not validate puzzle.')
			return
		}
		const validation = payload as ValidationResult
		setResult(validation)
	}

	if (loading) {
		return <p className="font-inter text-sky-900">Loading family tree puzzle...</p>
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				{difficulties.map((entry) => (
					<button
						key={entry}
						type="button"
						onClick={() => setDifficulty(entry)}
						className={`rounded border-2 px-3 py-1 text-sm font-inter transition ${
							difficulty === entry
								? 'border-green-700 bg-green-700 text-white'
								: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
						}`}
					>
						{entry}
					</button>
				))}
			</div>

			{message ? (
				<p className="rounded-lg border-2 border-sky-300 bg-sky-100 p-3 font-inter text-sky-900">
					{message}
				</p>
			) : null}

			{puzzle ? (
				<>
					<div className="rounded-lg border-2 border-green-700 bg-white p-3 sm:p-4">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<h1 className="font-Young_Serif text-2xl sm:text-3xl text-sky-900">{puzzle.title}</h1>
							<p className="font-inter text-sm text-sky-900">
								Place each family member in the correct tree slot.
							</p>
						</div>
						<div className="mt-3 overflow-x-auto rounded-lg border border-sky-200 bg-slate-100">
							<div className="relative aspect-[16/11] min-h-[360px] min-w-[760px] sm:aspect-[4/3] sm:min-h-[480px]">
								<svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
								{connectorSegments.map((segment, index) => {
									return (
										<line
											key={`connector_${index}`}
											x1={segment.x1}
											y1={segment.y1}
											x2={segment.x2}
											y2={segment.y2}
											stroke="#1f2937"
											strokeWidth={1.2}
											strokeLinecap="round"
										/>
									)
								})}
								</svg>
								{puzzle.slots.map((slot) => {
								const personCode = personBySlot.get(slot.slotKey)
								const person = personCode ? peopleMap.get(personCode) : null
								const locked = puzzle.prefilledAssignments.some(
									(entry) => entry.slotKey === slot.slotKey
								)
								const canDrop = Boolean(activePersonCode || draggingPersonCode)
								const isHovered = hoveredSlotKey === slot.slotKey
								return (
									<div
										key={slot.slotKey}
										className="absolute"
										style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
										onDragOver={(event) => event.preventDefault()}
										onDragEnter={() => setHoveredSlotKey(slot.slotKey)}
										onDragLeave={() =>
											setHoveredSlotKey((current) =>
												current === slot.slotKey ? null : current
											)
										}
										onDrop={(event) => {
											event.preventDefault()
											const droppedPersonCode = event.dataTransfer.getData('text/plain')
											if (droppedPersonCode) {
												assignPerson(droppedPersonCode, slot.slotKey)
											}
											setHoveredSlotKey(null)
											setDraggingPersonCode(null)
										}}
										onClick={() => {
											if (activePersonCode && !locked) {
												assignPerson(activePersonCode, slot.slotKey)
											} else {
												removeFromSlot(slot.slotKey)
											}
										}}
									>
										<div
											className={`h-14 w-14 sm:h-20 sm:w-20 overflow-hidden rounded-full border-[3px] sm:border-4 transition ${
												person ? 'border-slate-700 bg-white' : 'border-orange bg-white'
											} ${
												isHovered && canDrop && !locked
													? 'ring-4 ring-green-400'
													: ''
											}`}
										>
											{person ? (
												<img
													src={person.avatarUrl || '/mascot.svg'}
													alt={person.fullName}
													className="h-full w-full object-cover"
												/>
											) : null}
										</div>
										{person ? (
											<p className="mt-1 rounded-full bg-black px-2 sm:px-3 py-0.5 text-center font-inter text-xs sm:text-sm text-white">
												{person.fullName}
												{locked ? ' *' : ''}
											</p>
										) : null}
									</div>
								)
								})}
							</div>
						</div>
						<div className="mt-3 rounded-lg border border-sky-200 bg-lightyellow p-3">
							<p className="font-Young_Serif text-xl text-sky-900">Character Tray</p>
							<div className="mt-2 flex gap-2 overflow-x-auto pb-2">
								{trayPeople.map((person) => (
									<button
										key={person.personCode}
										type="button"
										draggable
										onDragStart={(event) => {
											event.dataTransfer.setData('text/plain', person.personCode)
											setDraggingPersonCode(person.personCode)
										}}
										onDragEnd={() => {
											setDraggingPersonCode(null)
											setHoveredSlotKey(null)
										}}
										onClick={() => {
											setActivePersonCode((current) =>
												current === person.personCode ? null : person.personCode
											)
										}}
										className={`flex shrink-0 items-center gap-2 rounded border-2 px-2 py-1 font-inter text-sm transition ${
											activePersonCode === person.personCode
												? 'border-green-700 bg-green-700 text-white'
												: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white'
										}`}
									>
										<img
											src={person.avatarUrl || '/mascot.svg'}
											alt={person.fullName}
											className="h-8 w-8 rounded-full border border-slate-400 object-cover"
										/>
										{person.fullName}
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="rounded-lg border-2 border-green-700 bg-lightyellow p-4">
						<h2 className="font-Young_Serif text-2xl text-sky-900">Clues</h2>
						<ul className="mt-2 space-y-1 font-inter text-base text-green-700">
							{puzzle.clues.map((clue, index) => (
								<li key={`${clue.clueText.slice(0, 14)}_${index}`}>{clue.clueText}</li>
							))}
						</ul>
						<div className="mt-3 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() => void checkAnswer()}
								className="rounded bg-green-700 px-4 py-2 font-inter text-sm text-white transition hover:bg-green-500"
							>
								Check Answer
							</button>
							<button
								type="button"
								onClick={resetUnfilledAssignments}
								className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
							>
								Reset
							</button>
							{result ? (
								<p className="font-inter text-sm text-sky-900">
									{result.solved
										? 'Solved! Great job.'
										: `${result.correctCount}/${result.totalCount} correct`}
								</p>
							) : null}
						</div>
					</div>
				</>
			) : null}
		</div>
	)
}
