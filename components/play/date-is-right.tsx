'use client'

import { Dialog } from '@headlessui/react'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { H1 } from '@/components/headings'
import { DateIsRightEventCard } from '@/components/play/date-is-right-event-card'
import { getGuessYearBounds, getInitialGuessYear, scoreGuess } from '@/lib/date-is-right/utils'
import { buildDateIsRightRounds } from '@/lib/familysearch/date-is-right'

const SINGLE_PLAYER_ROUNDS = 8

function buildSinglePlayerSession() {
	const rounds = buildDateIsRightRounds(SINGLE_PLAYER_ROUNDS)
	const { minYear, maxYear } = getGuessYearBounds(rounds.map((round) => round.year))

	return {
		rounds,
		minYear,
		maxYear,
		roundIndex: 0,
		guessYear: rounds[0] ? getInitialGuessYear(rounds[0].year, minYear, maxYear) : minYear,
		submittedGuess: null as number | null,
		score: 0,
	}
}

function getPlayerStorageKey(code: string) {
	return `date-is-right-player:${code.toUpperCase()}`
}

function persistPlayer(code: string, playerId: string, nickname: string) {
	window.localStorage.setItem(
		getPlayerStorageKey(code),
		JSON.stringify({ playerId, nickname })
	)
}

function GameSlider({
	value,
	min,
	max,
	onChange,
	disabled,
}: {
	value: number
	min: number
	max: number
	onChange: (next: number) => void
	disabled?: boolean
}) {
	const sliderPercent = max === min ? 0 : (value - min) / (max - min)

	return (
		<div>
			<div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-sky-700">
				<span>{min}</span>
				<span>Year guess</span>
				<span>{max}</span>
			</div>
			<div className="relative mt-3">
				<input
					type="range"
					min={min}
					max={max}
					value={value}
					disabled={disabled}
					onChange={(event) => onChange(Number(event.target.value))}
					className="date-is-right-slider w-full cursor-pointer appearance-none disabled:cursor-not-allowed"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-green-700 text-2xl text-white shadow-lg ring-2 ring-green-700/20"
					style={{
						left: `calc((100% - 56px) * ${sliderPercent.toFixed(4)} + 28px)`,
					}}
				>
					?
				</div>
			</div>
			<div className="mt-4 rounded-lg bg-sky-100 p-3 text-center">
				<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">Your guess</p>
				<p className="font-Young_Serif text-3xl text-sky-900">{value}</p>
			</div>
		</div>
	)
}

function SinglePlayerPanel() {
	const [session, setSession] = useState(buildSinglePlayerSession)
	const { rounds, minYear, maxYear, roundIndex, guessYear, submittedGuess, score } = session

	const currentRound = rounds[roundIndex] ?? null
	const result =
		currentRound && submittedGuess !== null
			? scoreGuess(submittedGuess, currentRound.year)
			: null

	if (!currentRound) {
		return <p className="font-inter text-sky-900">Loading single-player round...</p>
	}

	const isFinished = roundIndex === rounds.length - 1 && submittedGuess !== null

	return (
		<div className="mt-8 sm:px-2">
			<div className="mt-6">
				<div>
					<DateIsRightEventCard event={currentRound} />
				</div>

				<div className="mt-5">
					<GameSlider
						value={guessYear}
						min={minYear}
						max={maxYear}
						onChange={(next) =>
							setSession((current) => ({
								...current,
								guessYear: next,
							}))
						}
						disabled={submittedGuess !== null}
					/>
					<p className="mt-4 font-inter text-sm text-sky-900">
						Move the slider to the closest year without going over.
					</p>
				</div>
			</div>

			{result ? (
				<div className="mt-5 rounded-xl bg-sky-50 p-4">
					<p className="font-Young_Serif text-2xl text-sky-900">Correct year: {currentRound.year}</p>
					<p className="mt-2 font-inter text-sm text-sky-900">
						{submittedGuess === currentRound.year
							? 'Exact match.'
							: result.wentOver
								? `You went over by ${result.diff} year${result.diff === 1 ? '' : 's'}.`
								: `You stayed under by ${result.diff} year${result.diff === 1 ? '' : 's'}.`}
					</p>
					<p className="mt-2 font-inter text-sm text-sky-900">
						Original date: {currentRound.originalDate}
					</p>
					<p className="mt-3 font-inter text-sm font-semibold text-green-700">
						Round score: {result.score}
					</p>
				</div>
			) : null}

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => {
						if (!currentRound || submittedGuess !== null) return
						const nextResult = scoreGuess(guessYear, currentRound.year)
						setSession((current) => ({
							...current,
							submittedGuess: current.guessYear,
							score: current.score + nextResult.score,
						}))
					}}
					disabled={submittedGuess !== null}
					className="rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					Lock guess
				</button>
				{submittedGuess !== null && !isFinished ? (
					<button
						type="button"
						onClick={() =>
							setSession((current) => ({
								...current,
								roundIndex: current.roundIndex + 1,
								submittedGuess: null,
								guessYear: current.rounds[current.roundIndex + 1]
									? getInitialGuessYear(
											current.rounds[current.roundIndex + 1].year,
											current.minYear,
											current.maxYear
										)
									: current.guessYear,
							}))
						}
						className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Next round
					</button>
				) : null}
				{isFinished ? (
					<button
						type="button"
						onClick={() => setSession(buildSinglePlayerSession())}
						className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Play again
					</button>
				) : null}
			</div>

			<div className="mt-8">
				<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
					Current score
				</p>
				<div className="mt-3 rounded-xl bg-sky-100 p-3 sm:hidden">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="font-inter text-[11px] uppercase tracking-[0.18em] text-sky-700">
								Points
							</p>
							<p className="font-Young_Serif text-3xl leading-none text-sky-900">{score}</p>
						</div>
						<div className="text-right">
							<p className="font-inter text-[11px] uppercase tracking-[0.18em] text-sky-700">
								Progress
							</p>
							<p className="font-inter text-sm text-sky-900">
								Round {roundIndex + 1} of {rounds.length}
							</p>
						</div>
					</div>
				</div>
				<div className="mt-4 hidden gap-3 text-center sm:grid sm:grid-cols-3">
					<div className="rounded-lg bg-sky-100 p-3">
						<p className="font-Young_Serif text-3xl text-sky-900">{score}</p>
						<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
							Points
						</p>
					</div>
					<div className="rounded-lg bg-sky-100 p-3">
						<p className="font-Young_Serif text-3xl text-sky-900">{roundIndex + 1}</p>
						<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
							Round
						</p>
					</div>
					<div className="rounded-lg bg-sky-100 p-3">
						<p className="font-Young_Serif text-3xl text-sky-900">{rounds.length}</p>
						<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
							Total
						</p>
					</div>
				</div>
				<div className="mt-5 h-3 overflow-hidden rounded-full bg-sky-100">
					<div
						className="h-full rounded-full bg-green-700 transition-all duration-300"
						style={{
							width: `${((roundIndex + (submittedGuess !== null ? 1 : 0)) / rounds.length) * 100}%`,
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default function DateIsRightLanding() {
	const router = useRouter()
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [roomMode, setRoomMode] = useState<'host' | 'join'>('host')
	const [hostNickname, setHostNickname] = useState('')
	const [joinNickname, setJoinNickname] = useState('')
	const [roomCode, setRoomCode] = useState('')
	const [createError, setCreateError] = useState('')
	const [joinError, setJoinError] = useState('')
	const [busyAction, setBusyAction] = useState<'create' | 'join' | null>(null)

	const createRoom = async () => {
		setCreateError('')
		setBusyAction('create')

		try {
			const response = await fetch('/api/play/the-date-is-right/rooms', {
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
			router.push(`/the-date-is-right/room/${payload.room.room.code}`)
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
			const response = await fetch(`/api/play/the-date-is-right/rooms/${normalizedCode}/join`, {
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
			router.push(`/the-date-is-right/room/${payload.room.room.code}`)
		} catch (error) {
			setJoinError(error instanceof Error ? error.message : 'Could not join room.')
		} finally {
			setBusyAction(null)
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:relative sm:min-h-12 sm:flex-row sm:items-center sm:justify-end">
				<H1 className="mb-0 text-center text-4xl sm:pointer-events-none sm:absolute sm:inset-x-0 md:text-6xl">
					The Date Is Right
				</H1>
				<button
					type="button"
					onClick={() => setSettingsOpen(true)}
					className="self-center rounded-full border border-sky-300 bg-white/80 p-2.5 text-sky-800 shadow-sm transition hover:border-green-700 hover:text-green-700 sm:self-end"
					aria-label="Open game settings"
				>
					<Settings className="h-5 w-5" />
				</button>
			</div>
			<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
				Guess FamilySearch-style family-history years without going over. Play solo
				by default, or switch to a private room from settings.
			</p>

			<SinglePlayerPanel />

			<div className="mt-8 rounded-xl bg-sky-50 p-4">
				<p className="font-inter text-sm text-sky-900">
					Solo play is the default view. Use the settings cog to start a private
					room or join one with a nickname.
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
										Game Settings
									</Dialog.Title>
									<p className="mt-2 text-sm text-sky-900">
										Keep playing solo, host a private room, or join a room with a
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
											onClick={() => setRoomMode('host')}
											className={`rounded-full border-2 px-4 py-2 font-inter text-sm transition ${
												roomMode === 'host'
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
											}`}
										>
											Host private room
										</button>
										<button
											type="button"
											onClick={() => setRoomMode('join')}
											className={`rounded-full border-2 px-4 py-2 font-inter text-sm transition ${
												roomMode === 'join'
													? 'border-green-700 bg-green-700 text-white'
													: 'border-green-700 text-green-700 hover:bg-green-500 hover:text-white'
											}`}
										>
											Join room
										</button>
									</div>
								</div>

								<div className="rounded-xl bg-sky-50 p-4">
									<p className="font-Young_Serif text-lg text-sky-900">Solo play</p>
									<p className="mt-2 text-sm text-sky-900">
										Nothing extra to set up. Close this dialog and keep playing.
									</p>
								</div>

								{roomMode === 'host' ? (
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
								) : (
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
								)}
							</div>
						</Dialog.Panel>
					</div>
				</div>
			</Dialog>
		</div>
	)
}
