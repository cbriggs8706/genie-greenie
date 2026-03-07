import { NextResponse } from 'next/server'
import { startDateIsRightRoom } from '@/lib/date-is-right/server'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
		const body = (await request.json().catch(() => null)) as { playerId?: string } | null

		if (!body?.playerId) {
			return NextResponse.json({ error: 'playerId is required.' }, { status: 400 })
		}

		const room = await startDateIsRightRoom(code, body.playerId)
		return NextResponse.json({ room })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not start room.'
		return NextResponse.json({ error: message }, { status: 400 })
	}
}
