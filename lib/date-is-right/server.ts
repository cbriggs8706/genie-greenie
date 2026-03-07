import { createAdminClient } from '@/lib/supabase/admin'
import type {
	DateIsRightEvent,
	DateIsRightGuess,
	DateIsRightPlayer,
	DateIsRightRoomSnapshot,
	DateIsRightRoomStatus,
} from '@/lib/date-is-right/types'
import { getGuessYearBounds } from '@/lib/date-is-right/utils'
import { buildDateIsRightRounds } from '@/lib/familysearch/date-is-right'

type RoomRow = {
	id: string
	code: string
	status: DateIsRightRoomStatus
	current_round_index: number
	min_year: number
	max_year: number
	rounds: DateIsRightEvent[]
	host_player_id: string | null
	created_at: string
	updated_at: string
}

type PlayerRow = {
	id: string
	room_id: string
	nickname: string
	is_host: boolean
	joined_at: string
}

type GuessRow = {
	id: string
	room_id: string
	player_id: string
	round_index: number
	guess_year: number
	created_at: string
}

function mapPlayer(row: PlayerRow): DateIsRightPlayer {
	return {
		id: row.id,
		roomId: row.room_id,
		nickname: row.nickname,
		isHost: row.is_host,
		joinedAt: row.joined_at,
	}
}

function mapGuess(row: GuessRow): DateIsRightGuess {
	return {
		id: row.id,
		roomId: row.room_id,
		playerId: row.player_id,
		roundIndex: row.round_index,
		guessYear: row.guess_year,
		createdAt: row.created_at,
	}
}

export async function getDateIsRightRoomByCode(code: string) {
	const admin = createAdminClient()
	const normalizedCode = code.trim().toUpperCase()

	const { data, error } = await admin
		.from('date_is_right_rooms')
		.select(
			'id, code, status, current_round_index, min_year, max_year, rounds, host_player_id, created_at, updated_at'
		)
		.eq('code', normalizedCode)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	const room = data as RoomRow | null
	if (!room) return null

	const [{ data: players, error: playersError }, { data: guesses, error: guessesError }] =
		await Promise.all([
			admin
				.from('date_is_right_players')
				.select('id, room_id, nickname, is_host, joined_at')
				.eq('room_id', room.id)
				.order('joined_at', { ascending: true }),
			admin
				.from('date_is_right_guesses')
				.select('id, room_id, player_id, round_index, guess_year, created_at')
				.eq('room_id', room.id)
				.order('created_at', { ascending: true }),
		])

	if (playersError) throw new Error(playersError.message)
	if (guessesError) throw new Error(guessesError.message)

	return {
		room: {
			id: room.id,
			code: room.code,
			status: room.status,
			currentRoundIndex: room.current_round_index,
			totalRounds: Array.isArray(room.rounds) ? room.rounds.length : 0,
			minYear: room.min_year,
			maxYear: room.max_year,
			hostPlayerId: room.host_player_id,
			createdAt: room.created_at,
			updatedAt: room.updated_at,
		},
		players: (players ?? []).map((player) => mapPlayer(player as PlayerRow)),
		guesses: (guesses ?? []).map((guess) => mapGuess(guess as GuessRow)),
		rounds: Array.isArray(room.rounds) ? room.rounds : [],
	} satisfies DateIsRightRoomSnapshot
}

export async function createDateIsRightRoom(code: string, nickname: string) {
	const admin = createAdminClient()
	const rounds = buildDateIsRightRounds(8)
	const { minYear, maxYear } = getGuessYearBounds(rounds.map((round) => round.year))

	const { data: roomData, error: roomError } = await admin
		.from('date_is_right_rooms')
		.insert({
			code,
			status: 'lobby',
			current_round_index: 0,
			min_year: minYear,
			max_year: maxYear,
			rounds,
		})
		.select(
			'id, code, status, current_round_index, min_year, max_year, rounds, host_player_id, created_at, updated_at'
		)
		.single()

	if (roomError) throw new Error(roomError.message)
	const room = roomData as RoomRow

	const { data: playerData, error: playerError } = await admin
		.from('date_is_right_players')
		.insert({
			room_id: room.id,
			nickname,
			is_host: true,
		})
		.select('id, room_id, nickname, is_host, joined_at')
		.single()

	if (playerError) throw new Error(playerError.message)
	const player = playerData as PlayerRow

	const { error: hostError } = await admin
		.from('date_is_right_rooms')
		.update({ host_player_id: player.id })
		.eq('id', room.id)

	if (hostError) throw new Error(hostError.message)

	return getDateIsRightRoomByCode(code)
}

export async function joinDateIsRightRoom(code: string, nickname: string) {
	const room = await getDateIsRightRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.status !== 'lobby') {
		throw new Error('This room has already started.')
	}

	const admin = createAdminClient()
	const existingNickname = room.players.find(
		(player) => player.nickname.toLowerCase() === nickname.toLowerCase()
	)
	if (existingNickname) {
		throw new Error('That nickname is already taken in this room.')
	}

	const { data: playerData, error } = await admin
		.from('date_is_right_players')
		.insert({
			room_id: room.room.id,
			nickname,
			is_host: false,
		})
		.select('id, room_id, nickname, is_host, joined_at')
		.single()

	if (error) throw new Error(error.message)
	const player = playerData as PlayerRow

	return {
		player: mapPlayer(player),
		room: await getDateIsRightRoomByCode(code),
	}
}

export async function startDateIsRightRoom(code: string, playerId: string) {
	const room = await getDateIsRightRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.hostPlayerId !== playerId) throw new Error('Only the host can start the room.')
	if (room.players.length < 2) throw new Error('At least two players are required.')

	const admin = createAdminClient()
	const { error } = await admin
		.from('date_is_right_rooms')
		.update({ status: 'playing', current_round_index: 0 })
		.eq('id', room.room.id)

	if (error) throw new Error(error.message)

	return getDateIsRightRoomByCode(code)
}

export async function submitDateIsRightGuess(
	code: string,
	playerId: string,
	guessYear: number,
	roundIndex: number
) {
	const room = await getDateIsRightRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.status !== 'playing') throw new Error('This room is not accepting guesses.')
	if (room.room.currentRoundIndex !== roundIndex) throw new Error('This round is no longer active.')
	if (!room.players.some((player) => player.id === playerId)) {
		throw new Error('Player not found in this room.')
	}
	const currentRound = room.rounds[roundIndex]
	if (!currentRound) {
		throw new Error('This round could not be found.')
	}
	if (guessYear < room.room.minYear || guessYear > room.room.maxYear) {
		throw new Error('Guess is outside the allowed range.')
	}

	const admin = createAdminClient()
	const { error } = await admin.from('date_is_right_guesses').insert({
		room_id: room.room.id,
		player_id: playerId,
		round_index: roundIndex,
		guess_year: guessYear,
	})

	if (error) {
		if (error.code === '23505') {
			throw new Error('You already guessed this round.')
		}
		throw new Error(error.message)
	}

	return getDateIsRightRoomByCode(code)
}

export async function advanceDateIsRightRoom(code: string, playerId: string) {
	const room = await getDateIsRightRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.hostPlayerId !== playerId) throw new Error('Only the host can advance the room.')
	if (room.room.status !== 'playing') throw new Error('This room is not active.')

	const currentRoundIndex = room.room.currentRoundIndex
	const guessesThisRound = room.guesses.filter((guess) => guess.roundIndex === currentRoundIndex)
	if (guessesThisRound.length < room.players.length) {
		throw new Error('Wait for every player to guess before advancing.')
	}

	const isFinalRound = currentRoundIndex >= room.room.totalRounds - 1
	const admin = createAdminClient()
	const { error } = await admin
		.from('date_is_right_rooms')
		.update({
			status: isFinalRound ? 'finished' : 'playing',
			current_round_index: isFinalRound ? currentRoundIndex : currentRoundIndex + 1,
		})
		.eq('id', room.room.id)

	if (error) throw new Error(error.message)

	return getDateIsRightRoomByCode(code)
}
