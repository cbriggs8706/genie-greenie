import { NextResponse } from 'next/server'
import { submitAncestorFeudGuess } from '@/lib/ancestor-feud/server'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
		const body = (await request.json().catch(() => null)) as
			| { playerId?: string; guessText?: string; roundIndex?: number }
			| null
		const playerId = body?.playerId
		const guessText = body?.guessText
		const roundIndex = body?.roundIndex

		if (
			!playerId ||
			typeof guessText !== 'string' ||
			typeof roundIndex !== 'number' ||
			!Number.isInteger(roundIndex)
		) {
			return NextResponse.json(
				{ error: 'playerId, guessText, and roundIndex are required.' },
				{ status: 400 }
			)
		}

		const room = await submitAncestorFeudGuess(
			code,
			playerId,
			guessText.trim(),
			roundIndex
		)

		return NextResponse.json({ room })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not submit guess.' },
			{ status: 500 }
		)
	}
}
