import { createAdminClient } from '@/lib/supabase/admin'
import type {
	AncestorFeudGuess,
	AncestorFeudPlayer,
	AncestorFeudRoomSnapshot,
	AncestorFeudRoomStatus,
} from '@/lib/ancestor-feud/types'
import { getAncestorFeudRounds } from '@/lib/familysearch/ancestor-feud'

type RoomRow = {
	id: string
	code: string
	status: AncestorFeudRoomStatus
	current_round_index: number
	rounds: AncestorFeudRoomSnapshot['rounds']
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
	guess_text: string
	created_at: string
}

function mapPlayer(row: PlayerRow): AncestorFeudPlayer {
	return {
		id: row.id,
		roomId: row.room_id,
		nickname: row.nickname,
		isHost: row.is_host,
		joinedAt: row.joined_at,
	}
}

function mapGuess(row: GuessRow): AncestorFeudGuess {
	return {
		id: row.id,
		roomId: row.room_id,
		playerId: row.player_id,
		roundIndex: row.round_index,
		guessText: row.guess_text,
		createdAt: row.created_at,
	}
}

export async function getAncestorFeudRoomByCode(code: string) {
	const admin = createAdminClient()
	const normalizedCode = code.trim().toUpperCase()

	const { data, error } = await admin
		.from('ancestor_feud_rooms')
		.select('id, code, status, current_round_index, rounds, host_player_id, created_at, updated_at')
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
				.from('ancestor_feud_players')
				.select('id, room_id, nickname, is_host, joined_at')
				.eq('room_id', room.id)
				.order('joined_at', { ascending: true }),
			admin
				.from('ancestor_feud_guesses')
				.select('id, room_id, player_id, round_index, guess_text, created_at')
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
			hostPlayerId: room.host_player_id,
			createdAt: room.created_at,
			updatedAt: room.updated_at,
		},
		players: (players ?? []).map((player) => mapPlayer(player as PlayerRow)),
		guesses: (guesses ?? []).map((guess) => mapGuess(guess as GuessRow)),
		rounds: Array.isArray(room.rounds) ? room.rounds : [],
	} satisfies AncestorFeudRoomSnapshot
}

export async function createAncestorFeudRoom(code: string, nickname: string) {
	const admin = createAdminClient()
	const rounds = getAncestorFeudRounds()

	const { data: roomData, error: roomError } = await admin
		.from('ancestor_feud_rooms')
		.insert({
			code,
			status: 'lobby',
			current_round_index: 0,
			rounds,
		})
		.select('id, code, status, current_round_index, rounds, host_player_id, created_at, updated_at')
		.single()

	if (roomError) throw new Error(roomError.message)
	const room = roomData as RoomRow

	const { data: playerData, error: playerError } = await admin
		.from('ancestor_feud_players')
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
		.from('ancestor_feud_rooms')
		.update({ host_player_id: player.id })
		.eq('id', room.id)

	if (hostError) throw new Error(hostError.message)

	return getAncestorFeudRoomByCode(code)
}

export async function joinAncestorFeudRoom(code: string, nickname: string) {
	const room = await getAncestorFeudRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.status !== 'lobby') {
		throw new Error('This room has already started.')
	}

	const existingNickname = room.players.find(
		(player) => player.nickname.toLowerCase() === nickname.toLowerCase()
	)
	if (existingNickname) {
		throw new Error('That nickname is already taken in this room.')
	}

	const admin = createAdminClient()
	const { data: playerData, error } = await admin
		.from('ancestor_feud_players')
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
		room: await getAncestorFeudRoomByCode(code),
	}
}

export async function startAncestorFeudRoom(code: string, playerId: string) {
	const room = await getAncestorFeudRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.hostPlayerId !== playerId) throw new Error('Only the host can start the room.')
	if (room.players.length < 2) throw new Error('At least two players are required.')

	const admin = createAdminClient()
	const { error } = await admin
		.from('ancestor_feud_rooms')
		.update({ status: 'playing', current_round_index: 0 })
		.eq('id', room.room.id)

	if (error) throw new Error(error.message)

	return getAncestorFeudRoomByCode(code)
}

export async function submitAncestorFeudGuess(
	code: string,
	playerId: string,
	guessText: string,
	roundIndex: number
) {
	const room = await getAncestorFeudRoomByCode(code)
	if (!room) throw new Error('Room not found.')
	if (room.room.status !== 'playing') throw new Error('This room is not accepting guesses.')
	if (room.room.currentRoundIndex !== roundIndex) throw new Error('This round is no longer active.')
	if (!room.players.some((player) => player.id === playerId)) {
		throw new Error('Player not found in this room.')
	}

	const admin = createAdminClient()
	const { error } = await admin.from('ancestor_feud_guesses').insert({
		room_id: room.room.id,
		player_id: playerId,
		round_index: roundIndex,
		guess_text: guessText,
	})

	if (error) {
		if (error.code === '23505') {
			throw new Error('You already guessed this round.')
		}
		throw new Error(error.message)
	}

	return getAncestorFeudRoomByCode(code)
}

export async function advanceAncestorFeudRoom(code: string, playerId: string) {
	const room = await getAncestorFeudRoomByCode(code)
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
		.from('ancestor_feud_rooms')
		.update({
			status: isFinalRound ? 'finished' : 'playing',
			current_round_index: isFinalRound ? currentRoundIndex : currentRoundIndex + 1,
		})
		.eq('id', room.room.id)

	if (error) throw new Error(error.message)

	return getAncestorFeudRoomByCode(code)
}
