import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'
import {
	createTimelineGame,
	listTimelineGamesAdmin,
} from '@/lib/timeline-games/server'
import {
	normalizeTimelineEvents,
	slugifyTimelineGame,
	validateTimelineGameInput,
} from '@/lib/timeline-games/types'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user || !isAdminUser(user)) return null
	return user
}

export async function GET() {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const games = await listTimelineGamesAdmin()
		return NextResponse.json({ games })
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Could not load timeline games.' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as
		| {
				title?: string
				slug?: string
				description?: string
				sourcePrompt?: string | null
				isPublished?: boolean
				events?: unknown
		  }
		| null

	const payload = {
		title: body?.title?.trim() ?? '',
		slug: slugifyTimelineGame(body?.slug?.trim() || body?.title?.trim() || ''),
		description: body?.description?.trim() ?? '',
		sourcePrompt: body?.sourcePrompt?.trim() || null,
		isPublished: body?.isPublished === true,
		events: normalizeTimelineEvents(body?.events),
	}

	const validationError = validateTimelineGameInput(payload)
	if (validationError) {
		return NextResponse.json({ error: validationError }, { status: 400 })
	}

	try {
		const game = await createTimelineGame(payload)
		return NextResponse.json({ game }, { status: 201 })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Could not create timeline game.'
		const status = message.includes('duplicate key') ? 409 : 500
		return NextResponse.json({ error: message }, { status })
	}
}
