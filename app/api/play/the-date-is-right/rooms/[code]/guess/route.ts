import { NextResponse } from 'next/server'
import { submitDateIsRightGuess } from '@/lib/date-is-right/server'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
		const body = (await request.json().catch(() => null)) as {
			playerId?: string
			guessYear?: number
			roundIndex?: number
		} | null
		const playerId = body?.playerId
		const guessYear = body?.guessYear
		const roundIndex = body?.roundIndex

		if (
			!playerId ||
			typeof guessYear !== 'number' ||
			!Number.isInteger(guessYear) ||
			typeof roundIndex !== 'number' ||
			!Number.isInteger(roundIndex)
		) {
			return NextResponse.json(
				{ error: 'playerId, guessYear, and roundIndex are required.' },
				{ status: 400 }
			)
		}

		const room = await submitDateIsRightGuess(code, playerId, guessYear, roundIndex)
		return NextResponse.json({ room })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not submit guess.'
		return NextResponse.json({ error: message }, { status: 400 })
	}
}
