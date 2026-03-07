import { NextResponse } from 'next/server'
import { getPublishedTimelineGameBySlug } from '@/lib/timeline-games/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params

	try {
		const game = await getPublishedTimelineGameBySlug(slug)
		if (!game) {
			return NextResponse.json({ error: 'Game not found.' }, { status: 404 })
		}
		return NextResponse.json({ game })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not load game.' },
			{ status: 500 }
		)
	}
}
