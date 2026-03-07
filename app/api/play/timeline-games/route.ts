import { NextResponse } from 'next/server'
import { listPublishedTimelineGames } from '@/lib/timeline-games/server'

export async function GET() {
	try {
		const games = await listPublishedTimelineGames()
		return NextResponse.json({ games })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not load games.' },
			{ status: 500 }
		)
	}
}
