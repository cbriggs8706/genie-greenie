'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { Settings } from 'lucide-react'
import { HiXMark } from 'react-icons/hi2'
import { H1 } from '@/components/headings'
import {
	type CouplesGameQuestionKind,
	type CouplesGameRound,
	getCouplesGameRounds,
} from '@/lib/familysearch/couples-game'

const STORAGE_KEY = 'genie-greenie-couples-game-settings'
const generationOptions = [2, 3, 4]

type CouplesGameSettings = {
	generations: number
}

type CouplesGameOption = {
	id: string
	label: string
	isCorrect: boolean
}

const defaultSettings: CouplesGameSettings = {
	generations: 4,
}

const questionKindOrder: CouplesGameQuestionKind[] = [
	'whereMet',
	'older',
	'diedFirst',
	'children',
]

const shuffleItems = <T,>(items: T[]): T[] => {
	const next = [...items]

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
	}

	return next
}

const shuffleRoundIds = (rounds: CouplesGameRound[]): string[] =>
	shuffleItems(rounds.map((round) => round.id))

const shuffleQuestionKinds = (): CouplesGameQuestionKind[] =>
	shuffleItems(questionKindOrder)

const toStoredSettings = (value: unknown): CouplesGameSettings | null => {
	if (!value || typeof value !== 'object') {
		return null
	}

	const candidate = value as Partial<CouplesGameSettings>
	if (
		typeof candidate.generations !== 'number' ||
		!generationOptions.includes(candidate.generations)
	) {
		return defaultSettings
	}

	return {
		generations: candidate.generations,
	}
}

const getQuestion = (round: CouplesGameRound, kind: CouplesGameQuestionKind) =>
	round.questions.find((question) => question.kind === kind) || round.questions[0]

const formatChildrenLabel = (count: number): string =>
	count === 1 ? '1 child' : `${count} children`

const parseChildrenCount = (answer: string): number | null => {
	const match = answer.match(/^(\d+)\s+child(?:ren)?$/)
	return match ? Number.parseInt(match[1], 10) : null
}

const buildOptions = (
	activeRounds: CouplesGameRound[],
	round: CouplesGameRound,
	kind: CouplesGameQuestionKind
): CouplesGameOption[] => {
	const correctQuestion = getQuestion(round, kind)

	if (kind === 'older' || kind === 'diedFirst') {
		const contextualLabels = [
			round.husbandName,
			round.wifeName,
			kind === 'older' ? 'They were the same age.' : 'Same recorded date',
			kind === 'older'
				? 'Not enough birth-date information is recorded.'
				: 'No recorded death dates',
		]
		const labels = Array.from(new Set(contextualLabels))

		return shuffleItems(
			labels.map((label, index) => ({
				id: `${round.id}-${kind}-context-${index}`,
				label,
				isCorrect: label === correctQuestion.answer,
			}))
		)
	}

	const preferredPool = round.relatedCoupleIds
		.map((roundId) => activeRounds.find((entry) => entry.id === roundId))
		.filter((entry): entry is CouplesGameRound => Boolean(entry))
	const fallbackPool = activeRounds.filter((entry) => entry.id !== round.id)
	const pool = [...preferredPool, ...fallbackPool]

	const distractors: CouplesGameOption[] = []
	const usedLabels = new Set([correctQuestion.answer])

	for (const candidateRound of pool) {
		const candidateQuestion = getQuestion(candidateRound, kind)
		if (!candidateQuestion || usedLabels.has(candidateQuestion.answer)) {
			continue
		}

		usedLabels.add(candidateQuestion.answer)
		distractors.push({
			id: `${candidateRound.id}-${kind}`,
			label: candidateQuestion.answer,
			isCorrect: false,
		})

		if (distractors.length === 3) {
			break
		}
	}

	const correctOption: CouplesGameOption = {
		id: `${round.id}-${kind}-correct`,
		label: correctQuestion.answer,
		isCorrect: true,
	}

	if (kind === 'children') {
		const childCount = parseChildrenCount(correctQuestion.answer)

		if (childCount !== null) {
			const extraCounts = shuffleItems(
				Array.from({ length: 5 }, (_, index) => index).filter(
					(count) => count !== childCount
				)
			).slice(0, 2)

			for (const count of extraCounts) {
				const label = formatChildrenLabel(count)
				if (usedLabels.has(label)) {
					continue
				}

				usedLabels.add(label)
				distractors.push({
					id: `${round.id}-${kind}-dev-${count}`,
					label,
					isCorrect: false,
				})
			}
		}
	}

	return shuffleItems([correctOption, ...distractors]).slice(0, 4)
}

const CouplesRingsIcon = () => {
	return (
		<svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
			<circle cx="32" cy="32" r="32" fill="#233D4D" />
			<circle
				cx="25"
				cy="34"
				r="10"
				fill="none"
				stroke="#FFF6C8"
				strokeWidth="4"
			/>
			<circle
				cx="39"
				cy="28"
				r="10"
				fill="none"
				stroke="#FCBF49"
				strokeWidth="4"
			/>
		</svg>
	)
}

export default function TheCouplesGame() {
	const allRounds = useMemo(() => getCouplesGameRounds(), [])
	const [settings, setSettings] = useState<CouplesGameSettings>(defaultSettings)
	const [ready, setReady] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [questionIndex, setQuestionIndex] = useState(0)
	const [selectedByPrompt, setSelectedByPrompt] = useState<Record<string, string>>({})
	const [revealedByPrompt, setRevealedByPrompt] = useState<Record<string, boolean>>({})
	const [roundOrderByGeneration, setRoundOrderByGeneration] = useState<Record<number, string[]>>(
		{}
	)
	const [questionOrderByRound, setQuestionOrderByRound] = useState<
		Record<string, CouplesGameQuestionKind[]>
	>({})

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY)
			if (raw) {
				const parsed = JSON.parse(raw) as unknown
				const stored = toStoredSettings(parsed)
				if (stored) {
					setSettings(stored)
				}
			}
		} catch {
			// Ignore malformed local state and use defaults.
		} finally {
			setReady(true)
		}
	}, [])

	useEffect(() => {
		if (!ready) {
			return
		}

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
	}, [ready, settings])

	const activeRounds = useMemo(
		() =>
			allRounds.filter((round) => round.generation <= settings.generations),
		[allRounds, settings.generations]
	)
	const orderedRounds = useMemo(() => {
		const orderedIds = roundOrderByGeneration[settings.generations]
		const roundsById = new Map(activeRounds.map((round) => [round.id, round]))

		if (!orderedIds?.length) {
			return activeRounds
		}

		return orderedIds
			.map((roundId) => roundsById.get(roundId))
			.filter((round): round is CouplesGameRound => Boolean(round))
	}, [activeRounds, roundOrderByGeneration, settings.generations])
	const optionsByPrompt = useMemo(() => {
		return Object.fromEntries(
			orderedRounds.flatMap((round) =>
				(questionOrderByRound[round.id] || questionKindOrder).map((kind) => [
					`${round.id}-${kind}`,
					buildOptions(orderedRounds, round, kind),
				] as const)
			)
		)
	}, [orderedRounds, questionOrderByRound])
	const promptDeck = useMemo(
		() =>
			shuffleItems(
				orderedRounds.flatMap((round) =>
					(questionOrderByRound[round.id] || questionKindOrder).map((kind) => ({
						roundId: round.id,
						kind,
					}))
				)
			),
		[orderedRounds, questionOrderByRound]
	)

	useEffect(() => {
		if (allRounds.length === 0) {
			return
		}

		setRoundOrderByGeneration((current) => {
			const next = { ...current }
			let changed = false

			for (const generation of generationOptions) {
				if (next[generation]?.length) {
					continue
				}

				next[generation] = shuffleRoundIds(
					allRounds.filter((round) => round.generation <= generation)
				)
				changed = true
			}

			return changed ? next : current
		})

		setQuestionOrderByRound((current) => {
			const next = { ...current }
			let changed = false

			for (const round of allRounds) {
				if (next[round.id]?.length) {
					continue
				}

				next[round.id] = shuffleQuestionKinds()
				changed = true
			}

			return changed ? next : current
		})
	}, [allRounds])

	useEffect(() => {
		setQuestionIndex(0)
	}, [settings.generations])

	if (orderedRounds.length === 0 || promptDeck.length === 0) {
		return (
			<div className="space-y-4">
				<H1 className="mb-4">The Couples Game</H1>
				<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
					No couples are available for the selected generations.
				</p>
			</div>
		)
	}

	const safeQuestionIndex = Math.min(questionIndex, Math.max(promptDeck.length - 1, 0))
	const activePrompt = promptDeck[safeQuestionIndex]
	const round =
		orderedRounds.find((entry) => entry.id === activePrompt?.roundId) || orderedRounds[0]
	const kind = activePrompt?.kind || 'whereMet'
	const question = getQuestion(round, kind)
	const promptKey = `${round.id}-${kind}`
	const selectedOptionId = selectedByPrompt[promptKey]
	const revealed = revealedByPrompt[promptKey] || false
	const options = optionsByPrompt[promptKey] || []
	const selectedOption = options.find((option) => option.id === selectedOptionId) || null
	const correctOption = options.find((option) => option.isCorrect) || null
	const answeredCount = Object.keys(revealedByPrompt).filter((key) =>
		orderedRounds.some((entry) => key.startsWith(`${entry.id}-`))
	).length
	const totalPrompts = promptDeck.length

	const selectOption = (optionId: string) => {
		if (revealed) {
			return
		}

		setSelectedByPrompt((current) => ({
			...current,
			[promptKey]: optionId,
		}))
		setRevealedByPrompt((current) => ({
			...current,
			[promptKey]: true,
		}))
	}

	const goToNext = () => {
		setQuestionIndex((current) => (current + 1) % Math.max(promptDeck.length, 1))
	}

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<H1 className="mb-0 text-center text-4xl md:text-6xl">
					The Couples Game
				</H1>
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => setSettingsOpen(true)}
						className="rounded-full border border-sky-300 bg-white/80 p-2.5 text-sky-800 shadow-sm transition hover:border-green-700 hover:text-green-700"
						aria-label="Open couples game settings"
					>
						<Settings className="h-5 w-5" />
					</button>
				</div>
			</div>
			<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
				Study one couple at a time, then answer a Newlywed Game style question with
				multiple-choice options drawn from nearby family branches in the sample tree.
			</p>

			<div className="rounded-xl border-2 border-green-700 bg-white p-4 shadow-lg md:p-6">
				<div className="grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] md:items-center md:gap-4">
					<div className="text-center">
						<div className="mx-auto overflow-hidden rounded-2xl border-2 border-green-700 bg-sky-100">
							{round.husbandPortraitUrl ? (
								<Image
									src={round.husbandPortraitUrl}
									alt={round.husbandName}
									width={320}
									height={320}
									className="h-32 w-full object-cover md:h-56"
								/>
							) : (
								<div className="flex h-32 items-center justify-center font-inter text-sky-800 md:h-56">
									No photo
								</div>
							)}
						</div>
						<p className="mt-3 font-Young_Serif text-lg text-sky-900 md:mt-4 md:text-3xl">
							{round.husbandName}
						</p>
					</div>

					<div className="flex items-center justify-center pt-10 md:pt-0">
						<div className="text-center">
							<div className="flex items-center justify-center">
								<CouplesRingsIcon />
							</div>
						</div>
					</div>

					<div className="text-center">
						<div className="mx-auto overflow-hidden rounded-2xl border-2 border-green-700 bg-sky-100">
							{round.wifePortraitUrl ? (
								<Image
									src={round.wifePortraitUrl}
									alt={round.wifeName}
									width={320}
									height={320}
									className="h-32 w-full object-cover md:h-56"
								/>
							) : (
								<div className="flex h-32 items-center justify-center font-inter text-sky-800 md:h-56">
									No photo
								</div>
							)}
						</div>
						<p className="mt-3 font-Young_Serif text-lg text-sky-900 md:mt-4 md:text-3xl">
							{round.wifeName}
						</p>
					</div>
				</div>
			</div>

			<div className="rounded-xl border-2 border-green-700 bg-white p-6 shadow-lg">
				<h2 className="mt-2 font-Young_Serif text-3xl text-sky-900">
					{question.prompt}
				</h2>

				<div className="mt-6 grid gap-3">
					{options.map((option, index) => {
						const isSelected = option.id === selectedOptionId
						const showCorrect = revealed && option.isCorrect
						const showWrong = revealed && isSelected && !option.isCorrect

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => selectOption(option.id)}
								disabled={revealed}
								className={`w-full rounded-lg border-2 px-4 py-4 text-left font-inter transition ${
									showCorrect
										? 'border-green-700 bg-green-700 text-white'
										: showWrong
											? 'border-orange bg-orange text-white'
											: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white disabled:cursor-default disabled:hover:bg-white disabled:hover:text-sky-900'
								}`}
							>
								<span className="mr-3 font-Young_Serif text-xl">{index + 1}.</span>
								{option.label}
							</button>
						)
					})}
				</div>

				{revealed && correctOption ? (
					<div className="mt-5 rounded-xl bg-sky-50 p-4">
						<p className="font-Young_Serif text-2xl text-sky-900">
							{selectedOption?.isCorrect ? 'Correct' : 'Not quite'}
						</p>
						<p className="mt-2 font-inter text-sm text-sky-900">
							Correct answer: {correctOption.label}
						</p>
					</div>
				) : null}

				<div className="mt-5 flex flex-wrap gap-2">
					<button
						type="button"
						onClick={goToNext}
						className="rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500"
					>
						Next question
					</button>
				</div>
			</div>

			<div className="rounded-xl border border-sky-200 bg-white/80 p-4 shadow-sm">
				<div className="flex items-center justify-between gap-4">
					<p className="text-sm text-sky-900">
						{answeredCount} of {totalPrompts} answered
					</p>
				</div>
				<div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100">
					<div
						className="h-full rounded-full bg-green-700 transition-all duration-300"
						style={{
							width: `${((safeQuestionIndex + 1) / totalPrompts) * 100}%`,
						}}
					/>
				</div>
			</div>

			<Dialog as="div" open={settingsOpen} onClose={setSettingsOpen} className="relative z-40">
				<div className="fixed inset-0 bg-sky-900/40" aria-hidden="true" />
				<div className="fixed inset-0 overflow-y-auto p-4">
					<div className="flex min-h-full items-end justify-center sm:items-center">
						<Dialog.Panel className="w-full max-w-md rounded-3xl border-2 border-green-700 bg-white p-5 shadow-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<Dialog.Title className="font-Young_Serif text-2xl text-sky-900">
										Game Settings
									</Dialog.Title>
									<p className="mt-2 text-sm text-sky-900">
										Choose how many generations to include in the couple deck.
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

							<div className="mt-5 space-y-3">
								<p className="font-Young_Serif text-lg text-sky-900">Generations</p>
								<div className="grid gap-2">
									{generationOptions.map((generation) => (
										<button
											key={generation}
											type="button"
											onClick={() => {
												setSettings({ generations: generation })
												setSettingsOpen(false)
											}}
											className={`rounded-xl border-2 px-4 py-3 text-left font-inter transition ${
												settings.generations === generation
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white'
											}`}
										>
											{generation} generation{generation === 1 ? '' : 's'}
										</button>
									))}
								</div>
							</div>
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</div>
	)
}
