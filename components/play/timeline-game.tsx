'use client'

import { useEffect, useMemo, useState } from 'react'
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import type { TimelineGame } from '@/lib/timeline-games/types'

const MAX_ATTEMPTS = 3

type StoredTimelineGameState = {
	attemptsUsed: number
	solved: boolean
	order: number[]
	lastScore: number | null
}

function shuffle<T>(input: T[]) {
	const next = [...input]
	for (let index = next.length - 1; index > 0; index -= 1) {
		const targetIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
	}
	return next
}

function buildStartingOrder(ids: number[], correctOrder: number[]) {
	const shuffled = shuffle(ids)
	if (shuffled.every((id, index) => id === correctOrder[index]) && shuffled.length > 1) {
		return arrayMove(shuffled, 0, 1)
	}
	return shuffled
}

function SortableEventCard({
	id,
	label,
	index,
	canEdit,
	canMoveDown,
	onMoveUp,
	onMoveDown,
}: {
	id: number
	label: string
	index: number
	canEdit: boolean
	canMoveDown: boolean
	onMoveUp: () => void
	onMoveDown: () => void
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id, disabled: !canEdit })

	return (
		<li
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			className={`rounded-lg border-2 border-green-700 bg-white p-4 shadow-lg ${
				isDragging ? 'opacity-80 ring-2 ring-sky-300' : ''
			}`}
		>
			<div className="flex items-start gap-3">
				<div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 font-Young_Serif text-lg text-sky-900">
					{index + 1}
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-inter text-base leading-6 text-sky-900">{label}</p>
					<div className="mt-3 flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={onMoveUp}
							disabled={!canEdit || index === 0}
							className="rounded border border-green-700 px-2 py-1 text-green-700 transition hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
						>
							<ArrowUp className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={onMoveDown}
							disabled={!canEdit || !canMoveDown}
							className="rounded border border-green-700 px-2 py-1 text-green-700 transition hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
						>
							<ArrowDown className="h-4 w-4" />
						</button>
						<button
							type="button"
							{...attributes}
							{...listeners}
							disabled={!canEdit}
							className="ml-auto inline-flex items-center gap-2 rounded border border-sky-300 bg-sky-50 px-3 py-1.5 font-inter text-xs text-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
							aria-label={`Drag to move ${label}`}
						>
							<GripVertical className="h-4 w-4" />
							Drag
						</button>
					</div>
				</div>
			</div>
		</li>
	)
}

export default function TimelineGamePlayer({ game }: { game: TimelineGame }) {
	const correctOrder = useMemo(
		() =>
			[...game.events]
				.sort((left, right) => left.year - right.year || left.sortOrder - right.sortOrder)
				.map((entry) => entry.id),
		[game.events]
	)
	const eventsById = useMemo(
		() => new Map(game.events.map((entry) => [entry.id, entry])),
		[game.events]
	)
	const storageKey = `timeline-game:${game.slug}:${game.updatedAt}`
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 120, tolerance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const [order, setOrder] = useState<number[]>([])
	const [attemptsUsed, setAttemptsUsed] = useState(0)
	const [solved, setSolved] = useState(false)
	const [lastScore, setLastScore] = useState<number | null>(null)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let active = true

		async function hydrateFromStorage() {
			const savedValue = window.localStorage.getItem(storageKey)
			if (savedValue) {
				try {
					const saved = JSON.parse(savedValue) as StoredTimelineGameState
					const validOrder =
						Array.isArray(saved.order) &&
						saved.order.length === game.events.length &&
						saved.order.every((id) => eventsById.has(id))
					if (validOrder) {
						if (!active) return
						setOrder(saved.order)
						setAttemptsUsed(Math.min(MAX_ATTEMPTS, saved.attemptsUsed ?? 0))
						setSolved(Boolean(saved.solved))
						setLastScore(typeof saved.lastScore === 'number' ? saved.lastScore : null)
						setReady(true)
						return
					}
				} catch {}
			}

			if (!active) return
			setOrder(buildStartingOrder(game.events.map((entry) => entry.id), correctOrder))
			setReady(true)
		}

		void hydrateFromStorage()

		return () => {
			active = false
		}
	}, [correctOrder, eventsById, game.events, storageKey])

	useEffect(() => {
		if (!ready || order.length === 0) return

		const payload: StoredTimelineGameState = {
			attemptsUsed,
			solved,
			order,
			lastScore,
		}
		window.localStorage.setItem(storageKey, JSON.stringify(payload))
	}, [attemptsUsed, lastScore, order, ready, solved, storageKey])

	function moveItem(fromIndex: number, toIndex: number) {
		setOrder((current) => {
			if (fromIndex < 0 || toIndex < 0 || fromIndex >= current.length || toIndex >= current.length) {
				return current
			}
			return arrayMove(current, fromIndex, toIndex)
		})
	}

	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id || solved || attemptsUsed >= MAX_ATTEMPTS) return

		setOrder((current) => {
			const oldIndex = current.indexOf(Number(active.id))
			const newIndex = current.indexOf(Number(over.id))
			if (oldIndex === -1 || newIndex === -1) return current
			return arrayMove(current, oldIndex, newIndex)
		})
	}

	function shuffleCards() {
		if (solved || attemptsUsed >= MAX_ATTEMPTS) return
		setOrder(buildStartingOrder(order, correctOrder))
	}

	function submitAttempt() {
		if (solved || attemptsUsed >= MAX_ATTEMPTS) return

		const score = order.reduce((count, id, index) => {
			return count + (id === correctOrder[index] ? 1 : 0)
		}, 0)
		const isCorrect = score === correctOrder.length
		setAttemptsUsed((current) => current + 1)
		setLastScore(score)
		setSolved(isCorrect)
	}

	const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - attemptsUsed)
	const revealAnswers = solved || attemptsRemaining === 0
	const canEdit = ready && !solved && attemptsRemaining > 0

	if (!ready) {
		return <p className="font-inter text-sm text-sky-900">Loading your timeline game...</p>
	}

	return (
		<div className="space-y-6">
			<div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="font-Young_Serif text-2xl text-sky-900">Arrange The Events</p>
						<p className="mt-1 font-inter text-sm text-sky-900">
							Drag the cards from earliest to latest year. You get {MAX_ATTEMPTS}{' '}
							total submissions on this device.
						</p>
					</div>
					<div className="rounded-full bg-green-700 px-4 py-2 text-center font-inter text-sm text-white">
						Attempts remaining: {attemptsRemaining}
					</div>
				</div>
			</div>

			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
				<SortableContext items={order} strategy={verticalListSortingStrategy}>
					<ol className="space-y-3">
						{order.map((id, index) => {
							const event = eventsById.get(id)
							if (!event) return null
							return (
								<SortableEventCard
									key={id}
									id={id}
									index={index}
									label={event.event}
									canEdit={canEdit}
									canMoveDown={index < order.length - 1}
									onMoveUp={() => moveItem(index, index - 1)}
									onMoveDown={() => moveItem(index, index + 1)}
								/>
							)
						})}
					</ol>
				</SortableContext>
			</DndContext>

			<div className="flex flex-wrap gap-3">
				<button
					type="button"
					onClick={shuffleCards}
					disabled={!canEdit}
					className="rounded border-2 border-green-700 px-4 py-2 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
				>
					Shuffle Cards
				</button>
				<button
					type="button"
					onClick={submitAttempt}
					disabled={!canEdit}
					className="rounded bg-green-700 px-5 py-2 font-inter text-sm text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					Submit Order
				</button>
			</div>

			{lastScore !== null ? (
				<div
					className={`rounded-lg px-4 py-3 font-inter text-sm ${
						solved
							? 'border border-green-700 bg-green-50 text-sky-900'
							: 'border border-darkyellow bg-lightyellow text-sky-900'
					}`}
				>
					{solved
						? `Correct. You placed all ${correctOrder.length} events in order.`
						: `You placed ${lastScore} of ${correctOrder.length} events in the correct position.`}
				</div>
			) : null}

			{revealAnswers ? (
				<div className="rounded-lg border-2 border-green-700 bg-white p-4 shadow-lg">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Correct Timeline</h2>
					<ol className="mt-4 space-y-3">
						{[...game.events]
							.sort((left, right) => left.year - right.year || left.sortOrder - right.sortOrder)
							.map((event) => (
								<li
									key={event.id}
									className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3"
								>
									<p className="font-Young_Serif text-xl text-green-700">{event.year}</p>
									<p className="mt-1 font-inter text-sm text-sky-900">{event.event}</p>
								</li>
							))}
					</ol>
				</div>
			) : null}
		</div>
	)
}
