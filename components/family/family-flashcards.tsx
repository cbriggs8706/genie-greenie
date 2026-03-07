'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { HiXMark } from 'react-icons/hi2'
import { Settings, UserRound } from 'lucide-react'
import { H1 } from '@/components/headings'
import {
	buildFamilyFlashcards,
	defaultFamilyFlashcardSettings,
	familyFlashcardFieldLabels,
	getFamilySearchMockBundle,
} from '@/lib/familysearch/flashcards'
import type {
	FamilyFlashcard,
	FamilyFlashcardSettings,
	FamilySearchFlashcardField,
} from '@/lib/familysearch/types'

const STORAGE_KEY = 'genie-greenie-family-flashcards'

const fieldOptions = Object.keys(
	familyFlashcardFieldLabels
) as FamilySearchFlashcardField[]

const shuffleCards = (cards: FamilyFlashcard[]): FamilyFlashcard[] => {
	const next = [...cards]

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
	}

	return next
}

const toStoredSettings = (value: unknown): FamilyFlashcardSettings | null => {
	if (!value || typeof value !== 'object') {
		return null
	}

	const candidate = value as Partial<FamilyFlashcardSettings>
	const generations =
		typeof candidate.generations === 'number' &&
		candidate.generations >= 1 &&
		candidate.generations <= 4
			? candidate.generations
			: defaultFamilyFlashcardSettings.generations

	const normalizeFields = (
		fields: unknown,
		fallback: FamilySearchFlashcardField[]
	): FamilySearchFlashcardField[] => {
		if (!Array.isArray(fields)) {
			return fallback
		}

		const filtered = fields.filter((field): field is FamilySearchFlashcardField =>
			fieldOptions.includes(field as FamilySearchFlashcardField)
		)

		return filtered.length > 0 ? filtered : fallback
	}

	return {
		pid: defaultFamilyFlashcardSettings.pid,
		generations,
		frontFields: normalizeFields(
			candidate.frontFields,
			defaultFamilyFlashcardSettings.frontFields
		),
		backFields: normalizeFields(
			candidate.backFields,
			defaultFamilyFlashcardSettings.backFields
		),
	}
}

export default function FamilyFlashcards() {
	const bundle = getFamilySearchMockBundle()
	const [settings, setSettings] = useState<FamilyFlashcardSettings>(
		defaultFamilyFlashcardSettings
	)
	const [studyDeck, setStudyDeck] = useState<FamilyFlashcard[]>([])
	const [showBack, setShowBack] = useState(false)
	const [ready, setReady] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [isAdvancing, setIsAdvancing] = useState(false)
	const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY)
			if (!raw) {
				setReady(true)
				return
			}

			const parsed = JSON.parse(raw) as unknown
			const stored = toStoredSettings(parsed)
			if (stored) {
				setSettings(stored)
			}
		} catch {
			// Ignore malformed local storage and fall back to defaults.
		} finally {
			setReady(true)
		}
	}, [])

	useEffect(() => {
		return () => {
			if (advanceTimeoutRef.current) {
				clearTimeout(advanceTimeoutRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (!ready) {
			return
		}

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
	}, [ready, settings])

	const cards = useMemo(
		() =>
			buildFamilyFlashcards({
				ancestry: bundle.ancestry,
				portraits: bundle.portraits,
				settings,
			}),
		[bundle.ancestry, bundle.portraits, settings]
	)
	const currentCard = studyDeck[0] || null
	const completedCount = cards.length - studyDeck.length
	const totalCount = cards.length
	const progressPercent =
		totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

	useEffect(() => {
		setStudyDeck(shuffleCards(cards))
		setShowBack(false)
		setIsAdvancing(false)
	}, [cards])

	const updateFieldSelection = (
		side: 'frontFields' | 'backFields',
		field: FamilySearchFlashcardField
	) => {
		setSettings((current) => {
			const existing = current[side]
			const nextFields = existing.includes(field)
				? existing.filter((entry) => entry !== field)
				: [...existing, field]

			return {
				...current,
				[side]: nextFields.length > 0 ? nextFields : existing,
			}
		})
	}

	const queueAdvance = (
		getNextDeck: (current: FamilyFlashcard[]) => FamilyFlashcard[]
	) => {
		if (advanceTimeoutRef.current) {
			clearTimeout(advanceTimeoutRef.current)
		}

		setIsAdvancing(true)
		setShowBack(false)

		advanceTimeoutRef.current = setTimeout(() => {
			setStudyDeck((current) => getNextDeck(current))
			setIsAdvancing(false)
			advanceTimeoutRef.current = null
		}, 220)
	}

	const handleCorrect = () => {
		queueAdvance((current) => current.slice(1))
	}

	const handleMissed = () => {
		queueAdvance((current) => {
			if (current.length <= 1) {
				return current
			}

			const [first, ...rest] = current
			const insertionIndex = Math.floor(Math.random() * rest.length) + 1
			const next = [...rest]
			next.splice(insertionIndex, 0, first)
			return next
		})
	}

	const restartDeck = () => {
		setStudyDeck(shuffleCards(cards))
		setShowBack(false)
	}

	const renderCardFields = (
		card: FamilyFlashcard,
		fields: FamilySearchFlashcardField[]
	) => {
		return fields.map((field) => {
			if (field === 'photo') {
				return (
					<div key={field} className="flex min-h-full items-center justify-center">
						{card.portraitUrl ? (
							<Image
								src={card.portraitUrl}
								alt={card.name}
								width={960}
								height={640}
								className="h-72 w-full object-contain object-center sm:h-80"
							/>
						) : (
							<div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 text-center text-sky-900 sm:h-80">
								<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
									<UserRound className="h-10 w-10 text-sky-500" aria-hidden="true" />
								</div>
								<p className="font-inter text-base sm:text-lg">No photo available</p>
							</div>
						)}
					</div>
				)
			}

			return (
				<div
					key={field}
					className="rounded-xl border border-sky-200 bg-white/90 p-4 text-center shadow-sm"
				>
					<p className="text-xs uppercase tracking-[0.2em] text-sky-700">
						{familyFlashcardFieldLabels[field]}
					</p>
					<p className="mt-2 text-lg text-sky-950 sm:text-xl">
						{card.fields[field] || '-'}
					</p>
				</div>
			)
		})
	}

	const renderCardFace = (
		card: FamilyFlashcard,
		fields: FamilySearchFlashcardField[],
		side: 'front' | 'back'
	) => {
		return (
			<div
				className="col-start-1 row-start-1 flex h-full flex-col rounded-[28px] bg-white p-4 transition-all duration-200 [backface-visibility:hidden] sm:p-6"
				style={{
					transform: side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
					opacity: showBack === (side === 'back') ? 1 : 0,
					pointerEvents: showBack === (side === 'back') ? 'auto' : 'none',
					visibility: showBack === (side === 'back') ? 'visible' : 'hidden',
				}}
			>
				<div className="flex items-center justify-center">
					<div className="grid w-full gap-4 place-items-center">
						{renderCardFields(card, fields)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<H1 className="mb-0 text-center text-4xl md:text-6xl">
					Family Flashcards
				</H1>
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => setSettingsOpen(true)}
						className="rounded-full border border-sky-300 bg-white/80 p-2.5 text-sky-800 shadow-sm transition hover:border-green-700 hover:text-green-700"
						aria-label="Open flashcard settings"
					>
						<Settings className="h-5 w-5" />
					</button>
				</div>
			</div>

			<p className="mx-auto max-w-2xl text-center font-inter text-sm text-sky-900">
				Flip each card, decide whether you knew it, and keep studying until the
				entire deck is mastered.
			</p>

			{currentCard ? (
				<div className="space-y-4">
					<button
						type="button"
						onClick={() => {
							if (!isAdvancing) {
								setShowBack((value) => !value)
							}
						}}
						disabled={isAdvancing}
						className="block w-full rounded-[28px] border-2 border-green-700 bg-white text-left shadow-lg disabled:cursor-default"
						style={{ perspective: '1600px' }}
					>
						<div
							className="grid w-full rounded-[28px] transition-transform duration-200"
							style={{
								transformStyle: 'preserve-3d',
								transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
							}}
						>
							{renderCardFace(currentCard, settings.frontFields, 'front')}
							{renderCardFace(currentCard, settings.backFields, 'back')}
						</div>
					</button>

					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={handleMissed}
							disabled={isAdvancing}
							className="min-h-12 rounded-xl border-2 border-orange bg-white px-4 py-3 font-inter text-base text-orange transition hover:bg-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
						>
							Missed it
						</button>
						<button
							type="button"
							onClick={handleCorrect}
							disabled={isAdvancing}
							className="min-h-12 rounded-xl bg-green-700 px-4 py-3 font-inter text-base text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Got it right
						</button>
					</div>

					<div className="rounded-xl border border-sky-200 bg-white/80 p-4 shadow-sm">
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm text-sky-900">
								{completedCount} of {totalCount} mastered
							</p>
							<p className="text-sm text-sky-900">
								{studyDeck.length} remaining
							</p>
						</div>
						<div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100">
							<div
								className="h-full rounded-full bg-green-700 transition-all duration-300"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="rounded-[28px] border-2 border-green-700 bg-white p-8 text-center shadow-lg">
						<h3 className="font-Young_Serif text-3xl text-sky-900">Deck complete</h3>
						<p className="mt-3 text-sky-900">
							You worked through every card in this sample deck.
						</p>
						<button
							type="button"
							onClick={restartDeck}
							className="mt-5 rounded bg-green-700 px-5 py-3 text-white transition hover:bg-green-500"
						>
							Study again
						</button>
					</div>

					<div className="rounded-xl border border-sky-200 bg-white/80 p-4 shadow-sm">
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm text-sky-900">
								{completedCount} of {totalCount} mastered
							</p>
							<p className="text-sm text-sky-900">
								{studyDeck.length} remaining
							</p>
						</div>
						<div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100">
							<div
								className="h-full rounded-full bg-green-700 transition-all duration-300"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				</div>
			)}

			<Dialog as="div" open={settingsOpen} onClose={setSettingsOpen} className="relative z-40">
				<div className="fixed inset-0 bg-sky-900/40" aria-hidden="true" />
				<div className="fixed inset-0 overflow-y-auto p-4">
					<div className="flex min-h-full items-end justify-center sm:items-center">
						<Dialog.Panel className="w-full max-w-lg rounded-3xl border-2 border-green-700 bg-white p-5 shadow-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<Dialog.Title className="font-Young_Serif text-2xl text-sky-900">
										Flashcard Settings
									</Dialog.Title>
									<p className="mt-2 text-sm text-sky-900">
										Adjust the study deck and what appears on each side of the
										card.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setSettingsOpen(false)}
									className="rounded-full p-2 text-sky-800 transition hover:bg-sky-100"
									aria-label="Close settings"
								>
									<HiXMark className="h-6 w-6" />
								</button>
							</div>

							<div className="mt-5 space-y-5">
								<div>
									<label
										htmlFor="family-generations"
										className="font-Young_Serif text-lg text-sky-900"
									>
										Generations
									</label>
									<select
										id="family-generations"
										value={settings.generations}
										onChange={(event) =>
											setSettings((current) => ({
												...current,
												generations: Number(event.target.value),
											}))
										}
										className="mt-2 w-full rounded-lg border-2 border-green-700 bg-white px-3 py-2 font-inter text-sky-900"
									>
										{[1, 2, 3, 4].map((value) => (
											<option key={value} value={value}>
												{value}
											</option>
										))}
									</select>
								</div>

								<div>
									<p className="font-Young_Serif text-lg text-sky-900">Front of card</p>
									<div className="mt-3 space-y-2">
										{fieldOptions.map((field) => (
											<label
												key={`front-${field}`}
												className="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 font-inter text-sm text-sky-900"
											>
												<input
													type="checkbox"
													checked={settings.frontFields.includes(field)}
													onChange={() => updateFieldSelection('frontFields', field)}
													className="h-4 w-4 rounded border-sky-400 text-green-700"
												/>
												<span>{familyFlashcardFieldLabels[field]}</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<p className="font-Young_Serif text-lg text-sky-900">Back of card</p>
									<div className="mt-3 space-y-2">
										{fieldOptions.map((field) => (
											<label
												key={`back-${field}`}
												className="flex cursor-pointer items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 font-inter text-sm text-sky-900"
											>
												<input
													type="checkbox"
													checked={settings.backFields.includes(field)}
													onChange={() => updateFieldSelection('backFields', field)}
													className="h-4 w-4 rounded border-sky-400 text-green-700"
												/>
												<span>{familyFlashcardFieldLabels[field]}</span>
											</label>
										))}
									</div>
								</div>
							</div>

							<div className="mt-6 flex gap-3">
								<button
									type="button"
									onClick={() => {
										setSettings(defaultFamilyFlashcardSettings)
										setSettingsOpen(false)
									}}
									className="flex-1 rounded border-2 border-green-700 px-4 py-3 text-green-700 transition hover:bg-green-500 hover:text-white"
								>
									Reset
								</button>
								<button
									type="button"
									onClick={() => setSettingsOpen(false)}
									className="flex-1 rounded bg-green-700 px-4 py-3 text-white transition hover:bg-green-500"
								>
									Done
								</button>
							</div>
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</div>
	)
}
