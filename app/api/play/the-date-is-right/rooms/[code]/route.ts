import { NextResponse } from 'next/server'
import { getDateIsRightRoomByCode } from '@/lib/date-is-right/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ code: string }> }
) {
	try {
		const { code } = await params
		const room = await getDateIsRightRoomByCode(code)

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
