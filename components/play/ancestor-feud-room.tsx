'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Copy } from 'lucide-react'
import { H1 } from '@/components/headings'
import { createClient, supabaseConfigured } from '@/lib/supabase/client'
import type {
	AncestorFeudGuess,
	AncestorFeudRoomSnapshot,
	AncestorFeudRoundResult,
} from '@/lib/ancestor-feud/types'
import { scoreAncestorFeudGuess } from '@/lib/familysearch/ancestor-feud'

function getPlayerStorageKey(code: string) {
	return `ancestor-feud-player:${code.toUpperCase()}`
}

function readStoredPlayer(code: string) {
	if (typeof window === 'undefined') return null

	try {
		const raw = window.localStorage.getItem(getPlayerStorageKey(code))
		if (!raw) return null
		const parsed = JSON.parse(raw) as { playerId?: string; nickname?: string }
		return parsed.playerId ? parsed : null
	} catch {
		return null
	}
}

function persistPlayer(code: string, playerId: string, nickname: string) {
	window.localStorage.setItem(
		getPlayerStorageKey(code),
		JSON.stringify({ playerId, nickname })
	)
}

async function fetchRoomSnapshot(code: string) {
	const response = await fetch(`/api/play/ancestor-feud/rooms/${code}`, {
		cache: 'no-store',
	})
	const payload = (await response.json().catch(() => null)) as
		| { error?: string; room?: AncestorFeudRoomSnapshot }
		| null

	if (!response.ok || !payload?.room) {
		throw new Error(payload?.error || 'Could not load room.')
	}

	return payload.room
}

export default function AncestorFeudRoom({ code }: { code: string }) {
	const normalizedCode = code.toUpperCase()
	const [room, setRoom] = useState<AncestorFeudRoomSnapshot | null>(null)
	const [playerId, setPlayerId] = useState<string | null>(null)
	const [joinNickname, setJoinNickname] = useState('')
	const [guessText, setGuessText] = useState('')
	const [joinError, setJoinError] = useState('')
	const [actionError, setActionError] = useState('')
	const [busyAction, setBusyAction] = useState<'join' | 'start' | 'guess' | 'advance' | null>(
		null
	)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		const stored = readStoredPlayer(normalizedCode)
		setPlayerId(stored?.playerId || null)
		if (stored?.nickname) {
			setJoinNickname(stored.nickname)
		}
		void fetchRoomSnapshot(normalizedCode)
			.then((snapshot) => setRoom(snapshot))
			.catch((error: unknown) => {
				setActionError(error instanceof Error ? error.message : 'Could not load room.')
			})
	}, [normalizedCode])

	const roomId = room?.room.id ?? null

	useEffect(() => {
		if (!roomId || !supabaseConfigured()) return

		const supabase = createClient()
		const channel = supabase
			.channel(`ancestor-feud-room:${roomId}`)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'ancestor_feud_rooms', filter: `id=eq.${roomId}` },
				() => void fetchRoomSnapshot(normalizedCode).then(setRoom).catch(() => {})
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'ancestor_feud_players',
					filter: `room_id=eq.${roomId}`,
				},
				() => void fetchRoomSnapshot(normalizedCode).then(setRoom).catch(() => {})
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'ancestor_feud_guesses',
					filter: `room_id=eq.${roomId}`,
				},
				() => void fetchRoomSnapshot(normalizedCode).then(setRoom).catch(() => {})
			)
			.subscribe()

		return () => {
			void supabase.removeChannel(channel)
		}
	}, [normalizedCode, roomId])

	const currentRound = room?.rounds[room.room.currentRoundIndex] ?? null
	const currentRoundGuesses = useMemo(
		() =>
			room?.guesses.filter((guess) => guess.roundIndex === room.room.currentRoundIndex) ?? [],
		[room]
	)
	const me = room?.players.find((player) => player.id === playerId) ?? null
	const hasGuessed = currentRoundGuesses.some((guess) => guess.playerId === playerId)
	const allGuessed = room ? currentRoundGuesses.length >= room.players.length && room.players.length > 0 : false
	const canJoin = room?.room.status === 'lobby' && !playerId
	const isHost = Boolean(me?.isHost)

	const roundResults = useMemo(() => {
		if (!room || !currentRound) return []

		return currentRoundGuesses
			.map((guess) => {
				const player = room.players.find((entry) => entry.id === guess.playerId)
				if (!player) return null
				return {
					playerId: player.id,
					nickname: player.nickname,
					guessText: guess.guessText,
					...scoreAncestorFeudGuess(currentRound, guess.guessText),
				}
			})
			.filter(
				(entry): entry is AncestorFeudRoundResult & { nickname: string } => Boolean(entry)
			)
			.sort((left, right) => right.score - left.score || left.nickname.localeCompare(right.nickname))
	}, [currentRound, currentRoundGuesses, room])

	const leaderboard = useMemo(() => {
		if (!room) return []

		const scoreByPlayer = new Map(
			room.players.map((player) => [player.id, { nickname: player.nickname, totalScore: 0 }])
		)

		room.guesses.forEach((guess: AncestorFeudGuess) => {
			const round = room.rounds[guess.roundIndex]
			const bucket = scoreByPlayer.get(guess.playerId)
			if (!round || !bucket) return
			bucket.totalScore += scoreAncestorFeudGuess(round, guess.guessText).score
		})

		return [...scoreByPlayer.entries()]
			.map(([currentPlayerId, entry]) => ({
				playerId: currentPlayerId,
				nickname: entry.nickname,
				totalScore: entry.totalScore,
			}))
			.sort((left, right) => right.totalScore - left.totalScore || left.nickname.localeCompare(right.nickname))
	}, [room])

	const submitJoin = async () => {
		setJoinError('')
		setBusyAction('join')

		try {
			const response = await fetch(`/api/play/ancestor-feud/rooms/${normalizedCode}/join`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nickname: joinNickname }),
			})
			const payload = (await response.json().catch(() => null)) as
				| { error?: string; playerId?: string; room?: AncestorFeudRoomSnapshot }
				| null

			if (!response.ok || !payload?.playerId) {
				throw new Error(payload?.error || 'Could not join room.')
			}

			persistPlayer(normalizedCode, payload.playerId, joinNickname)
			setPlayerId(payload.playerId)
			setRoom(payload.room ?? (await fetchRoomSnapshot(normalizedCode)))
		} catch (error) {
			setJoinError(error instanceof Error ? error.message : 'Could not join room.')
		} finally {
			setBusyAction(null)
		}
	}

	const runAction = async (
		path: 'start' | 'guess' | 'advance',
		body: Record<string, unknown>
	) => {
		setActionError('')
		setBusyAction(path)

		try {
			const response = await fetch(`/api/play/ancestor-feud/rooms/${normalizedCode}/${path}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			const payload = (await response.json().catch(() => null)) as
				| { error?: string; room?: AncestorFeudRoomSnapshot }
				| null

			if (!response.ok) {
				throw new Error(payload?.error || `Could not ${path}.`)
			}

			if (payload?.room) {
				setRoom(payload.room)
				if (path === 'guess') {
					setGuessText('')
				}
			}
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Action failed.')
		} finally {
			setBusyAction(null)
		}
	}

	if (!room) {
		return <p className="font-inter text-sky-900">Loading room...</p>
	}

	return (
		<div className="space-y-4">
			<Link
				href="/ancestor-feud"
				className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
			>
				Back to game hub
			</Link>

			<H1 className="mb-4">Ancestor Feud</H1>
			<p className="mx-auto max-w-3xl text-center font-inter text-sky-900">
				Private room <span className="font-Young_Serif">{normalizedCode}</span>. Share
				the code, then have everyone guess the same survey answer from the family tree.
			</p>

			<div className="mt-8 sm:px-2">
				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(normalizedCode)
								setCopied(true)
								window.setTimeout(() => setCopied(false), 1500)
							} catch {}
						}}
						className="rounded-full border-2 border-green-700 bg-green-700 px-4 py-2 text-left text-white transition hover:bg-green-500"
					>
						<span className="flex items-center gap-2 font-Young_Serif text-lg">
							{normalizedCode}
							<Copy className="h-4 w-4" />
						</span>
						<span className="block font-inter text-xs uppercase tracking-[0.18em]">
							{copied ? 'Copied' : 'Copy room code'}
						</span>
					</button>
					{room.players.map((player) => (
						<div
							key={player.id}
							className="rounded-full border-2 border-green-700 bg-white px-4 py-2 text-left text-green-700"
						>
							<span className="block font-Young_Serif text-lg">{player.nickname}</span>
							<span className="block font-inter text-xs uppercase tracking-[0.18em]">
								{player.isHost ? 'Host' : 'Player'}
							</span>
						</div>
					))}
				</div>

				<div className="mt-6">
					<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
						Leaderboard
					</p>
					<div className="mt-4 grid gap-3 text-center sm:grid-cols-3">
						{leaderboard.slice(0, 3).map((entry) => (
							<div key={entry.playerId} className="rounded-lg bg-sky-100 p-3">
								<p className="font-Young_Serif text-3xl text-sky-900">
									{entry.totalScore}
								</p>
								<p className="font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
									{entry.nickname}
								</p>
							</div>
						))}
					</div>
				</div>

				{room.room.status === 'lobby' ? (
					<>
						<div className="mt-5 rounded-xl bg-sky-50 p-4">
							<p className="font-inter text-sm text-sky-900">
								Players can join until the host starts the game.
							</p>
						</div>

						{canJoin ? (
							<div className="mt-5 space-y-3">
								<input
									value={joinNickname}
									onChange={(event) => setJoinNickname(event.target.value)}
									maxLength={24}
									className="w-full rounded-lg border-2 border-green-700 px-4 py-3 font-inter text-sky-900 outline-none transition focus:border-green-500"
									placeholder="Nickname"
								/>
								<button
									type="button"
									onClick={submitJoin}
									disabled={busyAction === 'join'}
									className="w-full rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
								>
									{busyAction === 'join' ? 'Joining...' : 'Join room'}
								</button>
								{joinError ? (
									<p className="font-inter text-sm text-red-600">{joinError}</p>
								) : null}
							</div>
						) : null}

						{isHost ? (
							<div className="mt-4 flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => void runAction('start', { playerId })}
									disabled={busyAction === 'start' || room.players.length < 2}
									className="rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
								>
									{busyAction === 'start' ? 'Starting...' : 'Start game'}
								</button>
							</div>
						) : null}
					</>
				) : currentRound ? (
					<>
						<div className="mt-5 rounded-xl bg-sky-50 p-4">
							<p className="font-inter text-sm text-sky-900">
								{allGuessed
									? 'All guesses are in. Reveal the round and move on.'
									: `${currentRoundGuesses.length} of ${room.players.length} guesses are locked in.`}
							</p>
						</div>

						<div className="mt-6">
							<p className="font-inter text-xs uppercase tracking-[0.26em] text-sky-700">
								Survey board
							</p>
							<h2 className="mt-2 font-Young_Serif text-3xl text-sky-900">
								{currentRound.prompt}
							</h2>
							<p className="mt-3 font-inter text-sm text-sky-900">
								Each player submits one answer guess this round.
							</p>

							<div className="mt-5 h-3 overflow-hidden rounded-full bg-sky-100">
								<div
									className="h-full rounded-full bg-green-700 transition-all duration-300"
									style={{
										width: `${((room.room.currentRoundIndex + (allGuessed || room.room.status === 'finished' ? 1 : 0)) / room.room.totalRounds) * 100}%`,
									}}
								/>
							</div>

							{room.room.status === 'playing' && !allGuessed ? (
								<div className="mt-5 space-y-3">
									<input
										value={guessText}
										onChange={(event) => setGuessText(event.target.value)}
										className="w-full rounded-lg border-2 border-green-700 px-4 py-3 font-inter text-sky-900 outline-none transition focus:border-green-500"
										placeholder="Type your best survey guess"
										disabled={hasGuessed}
									/>
									<p className="font-inter text-sm text-sky-900">
										Think Family Feud style: one strong answer worth the most points.
									</p>
								</div>
							) : null}
						</div>

						<div className="mt-4 flex flex-wrap gap-2">
							{room.room.status === 'playing' && !allGuessed ? (
								<button
									type="button"
									onClick={() =>
										void runAction('guess', {
											playerId,
											guessText,
											roundIndex: room.room.currentRoundIndex,
										})
									}
									disabled={!playerId || hasGuessed || !guessText.trim() || busyAction === 'guess'}
									className="rounded-lg bg-green-700 px-4 py-3 font-inter text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-300"
								>
									{busyAction === 'guess'
										? 'Locking guess...'
										: hasGuessed
											? 'Guess locked'
											: 'Lock guess'}
								</button>
							) : null}
							{isHost && allGuessed && room.room.status !== 'finished' ? (
								<button
									type="button"
									onClick={() => void runAction('advance', { playerId })}
									disabled={busyAction === 'advance'}
									className="rounded-lg border-2 border-green-700 px-3 py-2 font-inter text-green-700 transition hover:bg-green-500 hover:text-white"
								>
									{busyAction === 'advance'
										? 'Advancing...'
										: room.room.currentRoundIndex >= room.room.totalRounds - 1
											? 'Finish game'
											: 'Next round'}
								</button>
							) : null}
						</div>

						{allGuessed || room.room.status === 'finished' ? (
							<div className="mt-5 space-y-3">
								<p className="font-Young_Serif text-2xl text-sky-900">
									Top answer: {currentRound.answers[0]?.label ?? 'No answer'}
								</p>
								<div className="grid gap-3 lg:grid-cols-2">
									{roundResults.map((result, index) => (
										<div
											key={result.playerId}
											className="grid grid-cols-[56px_minmax(0,1fr)_72px] items-center gap-3 rounded-xl border-2 border-green-700 bg-white p-3 shadow-sm"
										>
											<div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-800 font-Young_Serif text-xl text-white">
												{index + 1}
											</div>
											<div className="min-w-0">
												<p className="font-Young_Serif text-2xl text-sky-900">
													{result.nickname}
												</p>
												<p className="mt-1 font-inter text-sm text-sky-900">
													Guessed: {result.guessText}
												</p>
												<p className="mt-1 font-inter text-sm text-sky-900">
													{result.isMatch
														? `Matched ${result.matchedLabel}`
														: 'No board match'}
												</p>
												{result.portraitUrls.length > 0 ? (
													<div className="mt-2 flex flex-wrap gap-2">
														{result.portraitUrls.slice(0, 3).map((portraitUrl, portraitIndex) => (
															<div
																key={`${result.playerId}-${portraitIndex}`}
																className="overflow-hidden rounded-full border-2 border-green-700 bg-sky-100"
															>
																<Image
																	src={portraitUrl}
																	alt={result.matchedLabel || result.guessText}
																	width={40}
																	height={40}
																	className="h-10 w-10 object-cover"
																/>
															</div>
														))}
													</div>
												) : null}
											</div>
											<div className="text-right font-Young_Serif text-3xl text-orange">
												{result.score}
											</div>
										</div>
									))}
								</div>
							</div>
						) : null}
					</>
				) : null}

				{actionError ? (
					<div className="mt-5 rounded-xl bg-sky-50 p-4">
						<p className="font-inter text-sm text-red-600">{actionError}</p>
					</div>
				) : null}
			</div>
		</div>
	)
}
