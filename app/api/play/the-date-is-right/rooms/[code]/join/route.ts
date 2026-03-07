import { NextResponse } from 'next/server'
import { joinDateIsRightRoom } from '@/lib/date-is-right/server'
import { containsProfanity, sanitizeNickname } from '@/lib/date-is-right/utils'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
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

		const joined = await joinDateIsRightRoom(code, nickname)
		return NextResponse.json({
			room: joined.room,
			playerId: joined.player.id,
		})
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not join room.'
		return NextResponse.json(
			{ error: message },
			{ status: message === 'Room not found.' ? 404 : 400 }
		)
	}
}
