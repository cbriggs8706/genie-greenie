'use client'

import { FormEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { SendHorizontal, Settings } from 'lucide-react'
import { HiXMark } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { H1 } from '@/components/headings'
import {
	findAncestorFeudAnswer,
	getAncestorFeudRounds,
} from '@/lib/familysearch/ancestor-feud'

const MAX_STRIKES = 3

function getPlayerStorageKey(code: string) {
	return `ancestor-feud-player:${code.toUpperCase()}`
}

function persistPlayer(code: string, playerId: string, nickname: string) {
	window.localStorage.setItem(
		getPlayerStorageKey(code),
		JSON.stringify({ playerId, nickname })
	)
}

export default function AncestorFeud() {
	const router = useRouter()
	const rounds = useMemo(() => getAncestorFeudRounds(), [])
	const [roundIndex, setRoundIndex] = useState(0)
	const [guess, setGuess] = useState('')
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [settingsMode, setSettingsMode] = useState<'solo' | 'host' | 'join'>('solo')
	const [hostNickname, setHostNickname] = useState('')
	const [joinNickname, setJoinNickname] = useState('')
	const [roomCode, setRoomCode] = useState('')
	const [createError, setCreateError] = useState('')
	const [joinError, setJoinError] = useState('')
	const [busyAction, setBusyAction] = useState<'create' | 'join' | null>(null)
	const [guessedAnswerIdsByRound, setGuessedAnswerIdsByRound] = useState<
		Record<string, string[]>
	>({})
	const [strikesByRound, setStrikesByRound] = useState<Record<string, string[]>>({})
	const [status, setStatus] = useState('Guess the survey board one answer at a time.')

	const round = rounds[roundIndex]
	const guessedAnswerIds = guessedAnswerIdsByRound[round.id] || []
	const strikes = strikesByRound[round.id] || []
	const revealedAnswers = round.answers.filter((answer) =>
		guessedAnswerIds.includes(answer.id)
	)
	const revealedPoints = revealedAnswers.reduce(
		(total, answer) => total + answer.count,
		0
	)
	const boardComplete = revealedAnswers.length === round.answers.length
	const strikesReached = strikes.length >= MAX_STRIKES

	const switchRound = (nextRoundIndex: number) => {
		setRoundIndex(nextRoundIndex)
		setSettingsOpen(false)
		setGuess('')
		setStatus('Guess the survey board one answer at a time.')
	}

	const submitGuess = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedGuess = guess.trim()
		if (!trimmedGuess) {
			setStatus('Enter a guess first.')
			return
		}

		if (boardComplete || strikesReached) {
			setStatus('Reset the round or move to another board.')
			return
		}

		const existingMatch = findAncestorFeudAnswer(round, trimmedGuess, [])
		if (existingMatch && guessedAnswerIds.includes(existingMatch.id)) {
			setStatus(`You already found "${existingMatch.label}".`)
			setGuess('')
			return
		}

		const match = findAncestorFeudAnswer(round, trimmedGuess, guessedAnswerIds)

		if (!match) {
			setStrikesByRound((current) => ({
				...current,
				[round.id]: [...(current[round.id] || []), trimmedGuess],
			}))
			setStatus(`No match for "${trimmedGuess}".`)
			setGuess('')
			return
		}

		setGuessedAnswerIdsByRound((current) => ({
			...current,
			[round.id]: [...(current[round.id] || []), match.id],
		}))
		setStatus(`Matched "${match.label}" for ${match.count} point${match.count === 1 ? '' : 's'}.`)
		setGuess('')
	}

	const revealBoard = () => {
		setGuessedAnswerIdsByRound((current) => ({
			...current,
			[round.id]: round.answers.map((answer) => answer.id),
		}))
		setStatus('Board revealed.')
	}

	const resetRound = () => {
		setGuessedAnswerIdsByRound((current) => ({
			...current,
			[round.id]: [],
		}))
		setStrikesByRound((current) => ({
			...current,
			[round.id]: [],
		}))
		setGuess('')
		setStatus('Round reset.')
	}

	const createRoom = async () => {
		setCreateError('')
		setBusyAction('create')

		try {
			const response = await fetch('/api/play/ancestor-feud/rooms', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nickname: hostNickname }),
			})
			const payload = (await response.json().catch(() => null)) as
				| { error?: string; room?: { room: { code: string } }; playerId?: string | null }
				| null

			if (!response.ok || !payload?.room?.room?.code || !payload.playerId) {
				throw new Error(payload?.error || 'Could not create room.')
			}

			persistPlayer(payload.room.room.code, payload.playerId, hostNickname)
			router.push(`/ancestor-feud/room/${payload.room.room.code}`)
		} catch (error) {
			setCreateError(error instanceof Error ? error.message : 'Could not create room.')
		} finally {
			setBusyAction(null)
		}
	}

	const joinRoom = async () => {
		setJoinError('')
		setBusyAction('join')

		try {
			const normalizedCode = roomCode.trim().toUpperCase()
			const response = await fetch(`/api/play/ancestor-feud/rooms/${normalizedCode}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nickname: joinNickname }),
			})
			const payload = (await response.json().catch(() => null)) as
				| { error?: string; room?: { room: { code: string } }; playerId?: string | null }
				| null

			if (!response.ok || !payload?.room?.room?.code || !payload.playerId) {
				throw new Error(payload?.error || 'Could not join room.')
			}

			persistPlayer(payload.room.room.code, payload.playerId, joinNickname)
			router.push(`/ancestor-feud/room/${payload.room.room.code}`)
		} catch (error) {
			setJoinError(error instanceof Error ? error.message : 'Could not join room.')
		} finally {
			setBusyAction(null)
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col items-center gap-3 md:relative md:min-h-12 md:flex-row md:justify-end">
				<H1 className="mb-0 text-center text-4xl md:pointer-events-none md:absolute md:inset-x-0 md:text-6xl">
					Ancestor Feud
				</H1>
				<button
					type="button"
					onClick={() => setSettingsOpen(true)}
					className="rounded-full border border-sky-300 bg-white/80 p-2.5 text-sky-800 shadow-sm transition hover:border-green-700 hover:text-green-700 md:ml-auto"
					aria-label="Open Ancestor Feud settings"
				>
					<Settings className="h-5 w-5" />
				</button>
			</div>
			<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
				Survey-style family history guessing powered by the sample FamilySearch tree.
				Spot naming patterns, occupations, and migration clues as you uncover the
				board.
			</p>

			<div className="mt-8 sm:px-2">
				<div className="mt-6">
					<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
						Survey board
					</p>
					<h2 className="mt-2 font-Young_Serif text-3xl text-sky-900">
						{round.prompt}
					</h2>
					<p className="mt-3 font-inter text-sm text-sky-900">
						{round.description}
					</p>

					<form className="relative mt-4" onSubmit={submitGuess}>
						<input
							type="text"
							value={guess}
							onChange={(event) => setGuess(event.target.value)}
							placeholder="Type a survey guess"
							className="w-full rounded-full border-2 border-green-700 py-3 pl-4 pr-16 font-inter text-sky-900 outline-none transition focus:border-green-500"
						/>
						<button
							type="submit"
							className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-green-700 text-white transition hover:bg-green-500"
							aria-label="Submit guess"
						>
							<SendHorizontal className="h-5 w-5" />
						</button>
					</form>

					{strikes.length > 0 ? (
						<div className="mt-3 rounded-xl bg-sky-50 p-4">
							<div className="flex justify-center gap-2">
								{Array.from({ length: MAX_STRIKES }).map((_, index) => {
									const used = index < strikes.length

									return (
										<div
											key={index}
											className={`flex h-11 w-11 items-center justify-center rounded-full font-Young_Serif text-2xl ${
												used ? 'bg-orange text-white' : 'bg-sky-100 text-sky-700'
											}`}
										>
											X
										</div>
									)
								})}
							</div>
							<p className="mt-3 text-center font-inter text-xs text-sky-800">
								Missed guesses: {strikes.join(', ')}
							</p>
						</div>
					) : null}

					<div className="mt-4 grid gap-3 lg:grid-cols-2">
						{round.answers.map((answer, index) => {
							const revealed = guessedAnswerIds.includes(answer.id)

							return (
								<div
									key={answer.id}
									className="grid grid-cols-[56px_minmax(0,1fr)_72px] items-center gap-3 rounded-xl border-2 border-green-700 bg-white p-3 shadow-sm"
								>
									<div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-800 font-Young_Serif text-xl text-white">
										{index + 1}
									</div>
									<div className="min-w-0">
										{revealed ? (
											<>
												<p className="font-Young_Serif text-2xl text-sky-900">
													{answer.label}
												</p>
												<div className="mt-2 flex flex-wrap gap-2">
													{answer.portraitUrls.slice(0, 3).map((portraitUrl, portraitIndex) => (
														<div
															key={`${answer.id}-${portraitIndex}`}
															className="overflow-hidden rounded-full border-2 border-green-700 bg-sky-100"
														>
															<Image
																src={portraitUrl}
																alt={answer.label}
																width={48}
																height={48}
																className="h-12 w-12 object-cover"
															/>
														</div>
													))}
												</div>
											</>
										) : (
											<div className="h-14 rounded-lg bg-sky-100/80" />
										)}
									</div>
									<div className="text-right font-Young_Serif text-3xl text-orange">
										{revealed ? answer.count : '...'}
									</div>
								</div>
							)
						})}
					</div>
				</div>

				<div className="mt-6">
					<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
						Current score
					</p>
					<div className="mt-4 grid gap-3 text-center sm:grid-cols-3">
						<div className="rounded-lg bg-sky-100 p-3">
							<p className="font-Young_Serif text-3xl text-sky-900">{revealedPoints}</p>
							<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
								Points
							</p>
						</div>
						<div className="rounded-lg bg-sky-100 p-3">
							<p className="font-Young_Serif text-3xl text-sky-900">
								{revealedAnswers.length}
							</p>
							<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
								Found
							</p>
						</div>
						<div className="rounded-lg bg-sky-100 p-3">
							<p className="font-Young_Serif text-3xl text-sky-900">
								{MAX_STRIKES - Math.min(strikes.length, MAX_STRIKES)}
							</p>
							<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
								Lives
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-8 rounded-xl bg-sky-50 p-4">
				<p className="font-inter text-sm text-sky-900">
					Solo play is the default view. Use the settings cog to switch survey boards
					or host and join a private multiplayer room.
				</p>
			</div>

			<Dialog as="div" open={settingsOpen} onClose={setSettingsOpen} className="relative z-40">
				<div className="fixed inset-0 bg-sky-900/40" aria-hidden="true" />
				<div className="fixed inset-0 overflow-y-auto p-4">
					<div className="flex min-h-full items-end justify-center sm:items-center">
						<Dialog.Panel className="w-full max-w-lg rounded-3xl border-2 border-green-700 bg-white p-5 shadow-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<Dialog.Title className="font-Young_Serif text-2xl text-sky-900">
										Ancestor Feud Settings
									</Dialog.Title>
									<p className="mt-2 text-sm text-sky-900">
										Keep playing solo, host a private room, or join one with a
										code.
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
									<p className="font-Young_Serif text-lg text-sky-900">Mode</p>
									<div className="mt-3 flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => setSettingsMode('solo')}
											className={`rounded-full border-2 px-4 py-2 font-inter text-sm transition ${
												settingsMode === 'solo'
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
											}`}
										>
											Solo boards
										</button>
										<button
											type="button"
											onClick={() => setSettingsMode('host')}
											className={`rounded-full border-2 px-4 py-2 font-inter text-sm transition ${
												settingsMode === 'host'
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
											}`}
										>
											Host private room
										</button>
										<button
											type="button"
											onClick={() => setSettingsMode('join')}
											className={`rounded-full border-2 px-4 py-2 font-inter text-sm transition ${
												settingsMode === 'join'
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
											}`}
										>
											Join room
										</button>
									</div>
								</div>

								{settingsMode === 'solo' ? (
									<div className="space-y-3">
										<div className="grid gap-2 sm:grid-cols-3">
											<button
												type="button"
												onClick={resetRound}
												className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
											>
												Reset round
											</button>
											<button
												type="button"
												onClick={revealBoard}
												className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
											>
												Show board
											</button>
											<button
												type="button"
												onClick={() => switchRound((roundIndex + 1) % rounds.length)}
												className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
											>
												Next board
											</button>
										</div>
										{rounds.map((entry, index) => {
											const guessedCount = guessedAnswerIdsByRound[entry.id]?.length || 0
											const selected = index === roundIndex

											return (
												<button
													key={entry.id}
													type="button"
													onClick={() => switchRound(index)}
													className={`w-full rounded-xl border-2 p-4 text-left transition ${
														selected
															? 'border-green-700 bg-green-700 text-white'
															: 'border-green-700 bg-white text-green-700 hover:bg-green-500 hover:text-white'
													}`}
												>
													<span className="block font-Young_Serif text-xl">{entry.title}</span>
													<span className="mt-1 block font-inter text-sm">
														{entry.prompt}
													</span>
													<span className="mt-2 block font-inter text-xs uppercase tracking-[0.18em]">
														{guessedCount}/{entry.answers.length} answers found
													</span>
												</button>
											)
										})}
									</div>
								) : null}

								{settingsMode === 'host' ? (
									<div>
										<label className="font-Young_Serif text-lg text-sky-900">
											Host nickname
										</label>
										<input
											value={hostNickname}
											onChange={(event) => setHostNickname(event.target.value)}
											maxLength={24}
											className="mt-3 w-full rounded-lg border-2 border-green-700 px-4 py-3 font-inter text-sky-900 outline-none transition focus:border-green-500"
											placeholder="Host nickname"
										/>
										{createError ? (
											<p className="mt-3 font-inter text-sm text-red-600">{createError}</p>
										) : null}
										<button
											type="button"
											onClick={createRoom}
											disabled={busyAction === 'create'}
											className="mt-4 w-full rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
										>
											{busyAction === 'create' ? 'Creating room...' : 'Create room'}
										</button>
									</div>
								) : null}

								{settingsMode === 'join' ? (
									<div className="space-y-3">
										<label className="font-Young_Serif text-lg text-sky-900">
											Room code
										</label>
										<input
											value={roomCode}
											onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
											maxLength={6}
											className="w-full rounded-lg border-2 border-green-700 px-4 py-3 font-Young_Serif uppercase tracking-[0.18em] text-sky-900 outline-none transition focus:border-green-500"
											placeholder="Room code"
										/>
										<input
											value={joinNickname}
											onChange={(event) => setJoinNickname(event.target.value)}
											maxLength={24}
											className="w-full rounded-lg border-2 border-green-700 px-4 py-3 font-inter text-sky-900 outline-none transition focus:border-green-500"
											placeholder="Nickname"
										/>
										{joinError ? (
											<p className="font-inter text-sm text-red-600">{joinError}</p>
										) : null}
										<button
											type="button"
											onClick={joinRoom}
											disabled={busyAction === 'join'}
											className="w-full rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
										>
											{busyAction === 'join' ? 'Joining room...' : 'Join room'}
										</button>
									</div>
								) : null}
							</div>
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</div>
	)
}
