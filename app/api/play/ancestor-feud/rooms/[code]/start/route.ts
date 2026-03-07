import { NextResponse } from 'next/server'
import { startAncestorFeudRoom } from '@/lib/ancestor-feud/server'

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

		const room = await startAncestorFeudRoom(code, body.playerId)
		return NextResponse.json({ room })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not start room.' },
			{ status: 500 }
		)
	}
}
