import { NextResponse } from 'next/server'
import { createDateIsRightRoom } from '@/lib/date-is-right/server'
import {
	containsProfanity,
	createRoomCode,
	sanitizeNickname,
} from '@/lib/date-is-right/utils'

export async function POST(request: Request) {
	try {
		const body = (await request.json().catch(() => null)) as { nickname?: string } | null
		const nickname = sanitizeNickname(body?.nickname || '')

		if (nickname.length < 2) {
			return NextResponse.json(
				{ error: 'Nickname must be at least 2 characters.' },
				{ status: 400 }
			)
		}

		if (containsProfanity(nickname)) {
			return NextResponse.json(
				{ error: 'Choose a different nickname.' },
				{ status: 400 }
			)
		}

		let lastError: Error | null = null
		for (let attempt = 0; attempt < 5; attempt += 1) {
			try {
				const code = createRoomCode()
				const room = await createDateIsRightRoom(code, nickname)
				if (!room) throw new Error('Could not create room.')
				const host = room.players.find((player) => player.isHost)
				return NextResponse.json({
					room,
					playerId: host?.id ?? null,
				})
			} catch (error) {
				lastError = error instanceof Error ? error : new Error('Could not create room.')
				if (!lastError.message.toLowerCase().includes('duplicate')) {
					throw lastError
				}
			}
		}

		throw lastError ?? new Error('Could not create room.')
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not create room.' },
			{ status: 500 }
		)
	}
}
