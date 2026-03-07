import type { AncestorFeudRound } from '@/lib/familysearch/ancestor-feud'

export type AncestorFeudPlayer = {
	id: string
	roomId: string
	nickname: string
	isHost: boolean
	joinedAt: string
}

export type AncestorFeudGuess = {
	id: string
	roomId: string
	playerId: string
	roundIndex: number
	guessText: string
	createdAt: string
}

export type AncestorFeudRoomStatus = 'lobby' | 'playing' | 'finished'

export type AncestorFeudRoomSnapshot = {
	room: {
		id: string
		code: string
		status: AncestorFeudRoomStatus
		currentRoundIndex: number
		totalRounds: number
		hostPlayerId: string | null
		createdAt: string
		updatedAt: string
	}
	players: AncestorFeudPlayer[]
	guesses: AncestorFeudGuess[]
	rounds: AncestorFeudRound[]
}

export type AncestorFeudRoundResult = {
	playerId: string
	guessText: string
	score: number
	isMatch: boolean
	matchedAnswerId: string | null
	matchedLabel: string | null
	portraitUrls: string[]
}
