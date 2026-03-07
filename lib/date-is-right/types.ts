export type DateIsRightFactKind = 'birth' | 'death' | 'marriage'

export type DateIsRightEvent = {
	id: string
	personId: string
	personName: string
	relationship: string
	portraitUrl: string | null
	factKind: DateIsRightFactKind
	factLabel: string
	year: number
	originalDate: string
	place: string
	prompt: string
	clue: string
}

export type DateIsRightPlayer = {
	id: string
	roomId: string
	nickname: string
	isHost: boolean
	joinedAt: string
}

export type DateIsRightGuess = {
	id: string
	roomId: string
	playerId: string
	roundIndex: number
	guessYear: number
	createdAt: string
}

export type DateIsRightRoomStatus = 'lobby' | 'playing' | 'finished'

export type DateIsRightRoomSnapshot = {
	room: {
		id: string
		code: string
		status: DateIsRightRoomStatus
		currentRoundIndex: number
		totalRounds: number
		minYear: number
		maxYear: number
		hostPlayerId: string | null
		createdAt: string
		updatedAt: string
	}
	players: DateIsRightPlayer[]
	guesses: DateIsRightGuess[]
	rounds: DateIsRightEvent[]
}

export type DateIsRightRoundResult = {
	playerId: string
	guessYear: number
	answerYear: number
	diff: number
	wentOver: boolean
	score: number
}
