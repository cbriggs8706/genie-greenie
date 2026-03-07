import { NextResponse } from 'next/server'
import { getAncestorFeudRoomByCode } from '@/lib/ancestor-feud/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
		const room = await getAncestorFeudRoomByCode(code)

		if (!room) {
			return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
		}

		return NextResponse.json({ room })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not load room.' },
			{ status: 500 }
		)
	}
}
