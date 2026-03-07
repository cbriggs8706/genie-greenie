'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { Settings } from 'lucide-react'
import { HiXMark } from 'react-icons/hi2'
import { H1 } from '@/components/headings'
import { getTwoTruthsOneLieRounds } from '@/lib/familysearch/two-truths-one-lie'

const relationshipLabels = {
	parent: 'parent',
	child: 'child',
	sibling: 'sibling',
} as const

const shuffleStatements = <T,>(items: T[]): T[] => {
	const next = [...items]

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
	}

	return next
}

const shuffleRounds = <T,>(items: T[]): T[] => {
	const next = [...items]

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
	}

	return next
}

export default function TwoTruthsOneLie() {
	const rounds = useMemo(() => getTwoTruthsOneLieRounds(), [])
	const generationOptions = [2, 3, 4]
	const [roundOrderByGeneration] = useState<Record<number, string[]>>(() =>
		Object.fromEntries(
			generationOptions.map((generation) => [
				generation,
				shuffleRounds(
					rounds
						.filter((round) => round.generation <= generation)
						.map((round) => round.id)
				),
			])
		)
	)
	const [statementOrderByRound] = useState<Record<string, string[]>>(() =>
		Object.fromEntries(
			rounds.map((round) => [
				round.id,
				shuffleStatements(round.statements).map((statement) => statement.id),
			])
		)
	)
	const [selectedGenerations, setSelectedGenerations] = useState(
		() => generationOptions[generationOptions.length - 1] || 4
	)
	const [roundIndex, setRoundIndex] = useState(0)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [selectedByRound, setSelectedByRound] = useState<Record<string, string>>({})
	const [revealedByRound, setRevealedByRound] = useState<Record<string, boolean>>({})

	const activeRounds = useMemo(() => {
		const orderedIds = roundOrderByGeneration[selectedGenerations] || []
		const roundsById = new Map(rounds.map((round) => [round.id, round]))

		return orderedIds
			.map((roundId) => roundsById.get(roundId))
			.filter((entry): entry is (typeof rounds)[number] => Boolean(entry))
	}, [roundOrderByGeneration, rounds, selectedGenerations])
	const safeRoundIndex = Math.min(roundIndex, Math.max(activeRounds.length - 1, 0))
	const round = activeRounds[safeRoundIndex]

	if (!round) {
		return (
			<div className="space-y-4">
				<H1 className="mb-4">Two Truths, One Lie</H1>
				<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
					No sample rounds are available yet.
				</p>
			</div>
		)
	}

	const selectedStatementId = selectedByRound[round.id]
	const hasAnswered = Boolean(selectedStatementId)
	const revealed = revealedByRound[round.id] || false
	const correctCount = activeRounds.filter(
		(entry) => selectedByRound[entry.id] === entry.lieStatementId
	).length
	const orderedStatements =
		statementOrderByRound[round.id]
			?.map((statementId) =>
				round.statements.find((statement) => statement.id === statementId)
			)
			.filter((statement): statement is (typeof round.statements)[number] =>
				Boolean(statement)
			) || round.statements

	const selectStatement = (statementId: string) => {
		if (hasAnswered) {
			return
		}

		setSelectedByRound((current) => ({
			...current,
			[round.id]: statementId,
		}))
		setRevealedByRound((current) => ({
			...current,
			[round.id]: true,
		}))
	}

	const goToRound = (nextRoundIndex: number) => {
		setRoundIndex(nextRoundIndex)
	}

	const changeGenerations = (nextGenerations: number) => {
		setSelectedGenerations(nextGenerations)
		setRoundIndex(0)
	}

	const resetRound = () => {
		setSelectedByRound((current) => {
			const next = { ...current }
			delete next[round.id]
			return next
		})
		setRevealedByRound((current) => {
			const next = { ...current }
			delete next[round.id]
			return next
		})
	}

	const revealAnswer = () => {
		setRevealedByRound((current) => ({
			...current,
			[round.id]: true,
		}))
	}

	const selectedIsCorrect = selectedStatementId === round.lieStatementId

	return (
		<div className="space-y-4">
			<div className="flex flex-col items-center gap-3">
				<H1 className="mb-0 text-center text-4xl md:text-6xl">
					Two Truths, One Lie
				</H1>
				<div className="flex w-full justify-center">
					<button
						type="button"
						onClick={() => setSettingsOpen(true)}
						className="rounded-full border border-sky-300 bg-white/80 p-2.5 text-sky-800 shadow-sm transition hover:border-green-700 hover:text-green-700"
						aria-label="Open two truths one lie settings"
					>
						<Settings className="h-5 w-5" />
					</button>
				</div>
			</div>
			<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
				Study one ancestor at a time, then spot which fact was pulled from an
				adjacent relative in the FamilySearch-style tree.
			</p>

			<div className="mt-8 sm:px-2">
				<div className="rounded-xl border-2 border-green-700 bg-white p-4 shadow-lg md:p-6">
					<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
						{round.title}
					</p>
					<h2 className="mt-2 font-Young_Serif text-3xl text-sky-900">
						{round.prompt}
					</h2>

					<div className="mt-6 flex flex-col items-center text-center">
						<div className="overflow-hidden rounded-xl border-2 border-green-700 bg-sky-100">
							{round.personPortraitUrl ? (
								<Image
									src={round.personPortraitUrl}
									alt={round.personName}
									width={480}
									height={480}
									className="h-40 w-40 object-cover sm:h-64 sm:w-64 md:h-72 md:w-72"
								/>
							) : (
								<div className="flex h-40 w-40 items-center justify-center bg-sky-100 font-inter text-sky-800 sm:h-64 sm:w-64 md:h-72 md:w-72">
									No photo
								</div>
							)}
						</div>
						<p className="mt-4 font-Young_Serif text-3xl text-sky-900">
							{round.personName}
						</p>
					</div>

					<div className="mt-6 space-y-3">
						{orderedStatements.map((statement, index) => {
							const isSelected = selectedStatementId === statement.id
							const isLie = statement.id === round.lieStatementId
							const showResult = revealed && (isSelected || isLie)

							return (
								<button
									key={statement.id}
									type="button"
									onClick={() => selectStatement(statement.id)}
									disabled={hasAnswered}
									className={`w-full rounded-lg border-2 px-4 py-4 text-left font-inter transition ${
										showResult && isLie
											? 'border-orange bg-orange text-white'
											: showResult && isSelected && !isLie
												? 'border-sky-800 bg-sky-800 text-white'
												: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white disabled:cursor-default disabled:hover:bg-white disabled:hover:text-sky-900'
									}`}
								>
									<span className="mr-3 font-Young_Serif text-xl">
										{index + 1}.
									</span>
									{statement.text}
								</button>
							)
						})}
					</div>

					{hasAnswered ? (
						<div className="mt-5 flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => goToRound((safeRoundIndex + 1) % activeRounds.length)}
								className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
							>
								Next ancestor
							</button>
						</div>
					) : null}

					{revealed ? (
						<div className="mt-5 bg-sky-50 p-4">
							<p className="font-Young_Serif text-2xl text-sky-900">
								{hasAnswered
									? selectedIsCorrect
										? 'Correct'
										: 'Not quite'
									: 'Lie revealed'}
							</p>
							<p className="mt-2 font-inter text-sm text-sky-900">
								The lie came from {round.adjacentPersonName}, who is {round.personName}
								&apos;s {relationshipLabels[round.adjacentRelationship]}.
							</p>
						</div>
					) : null}
				</div>

				<div className="mt-6">
					<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
						Progress
					</p>
					<div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100">
						<div
							className="h-full rounded-full bg-green-700 transition-all duration-300"
							style={{
								width: `${((safeRoundIndex + 1) / activeRounds.length) * 100}%`,
							}}
						/>
					</div>
					<p className="mt-3 font-inter text-sm text-sky-900">
						Round {safeRoundIndex + 1} of {activeRounds.length}. {correctCount} of{' '}
						{activeRounds.length} lies found so far.
					</p>
					<p className="mt-1 font-inter text-sm text-sky-900">
						Showing {selectedGenerations} generation
						{selectedGenerations === 1 ? '' : 's'}.
					</p>
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
										Choose how many generations to include in the round deck.
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
												changeGenerations(generation)
												setSettingsOpen(false)
											}}
											className={`rounded-xl border-2 px-4 py-3 text-left font-inter transition ${
												selectedGenerations === generation
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 bg-white text-sky-900 hover:bg-green-700 hover:text-white'
											}`}
										>
											{generation} generation{generation === 1 ? '' : 's'}
										</button>
									))}
								</div>
							</div>

							<div className="mt-6 space-y-3">
								<p className="font-Young_Serif text-lg text-sky-900">Round Controls</p>
								<div className="grid gap-2">
									<button
										type="button"
										onClick={() => {
											resetRound()
											setSettingsOpen(false)
										}}
										className="rounded-xl border-2 border-green-700 bg-white px-4 py-3 text-left font-inter text-sky-900 transition hover:bg-green-700 hover:text-white"
									>
										Reset round
									</button>
									<button
										type="button"
										onClick={() => {
											revealAnswer()
											setSettingsOpen(false)
										}}
										className="rounded-xl border-2 border-green-700 bg-white px-4 py-3 text-left font-inter text-sky-900 transition hover:bg-green-700 hover:text-white"
									>
										Reveal lie
									</button>
								</div>
							</div>
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</div>
	)
}
