import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'
import { normalizeTimelineEvents, slugifyTimelineGame } from '@/lib/timeline-games/types'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user || !isAdminUser(user)) return null
	return user
}

type OpenAIResponse = {
	choices?: Array<{
		message?: {
			content?: string
		}
	}>
	error?: {
		message?: string
	}
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as { prompt?: string } | null
	const prompt = body?.prompt?.trim() ?? ''

	if (!prompt) {
		return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 })
	}

	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 })
	}

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: process.env.OPENAI_TIMELINE_MODEL || 'gpt-4.1-mini',
				messages: [
					{
						role: 'system',
						content:
							'You generate timeline game drafts. Return only valid JSON. Build concise, factual year-event pairs. Prefer distinct years when possible. Keep event descriptions short enough to fit on mobile cards.',
					},
					{
						role: 'user',
						content: `Create a timeline game draft for this request: ${prompt}`,
					},
				],
				response_format: {
					type: 'json_schema',
					json_schema: {
						name: 'timeline_game_draft',
						schema: {
							type: 'object',
							additionalProperties: false,
							properties: {
								title: { type: 'string' },
								description: { type: 'string' },
								events: {
									type: 'array',
									minItems: 3,
									items: {
										type: 'object',
										additionalProperties: false,
										properties: {
											year: { type: 'integer' },
											event: { type: 'string' },
										},
										required: ['year', 'event'],
									},
								},
							},
							required: ['title', 'description', 'events'],
						},
					},
				},
			}),
			cache: 'no-store',
		})

		const payload = (await response.json()) as OpenAIResponse
		if (!response.ok) {
			return NextResponse.json(
				{ error: payload.error?.message ?? 'OpenAI request failed.' },
				{ status: 500 }
			)
		}

		const content = payload.choices?.[0]?.message?.content ?? ''
		const parsed = JSON.parse(content) as {
			title?: string
			description?: string
			events?: unknown
		}

		const events = normalizeTimelineEvents(parsed.events)
		if (!parsed.title?.trim() || events.length < 3) {
			return NextResponse.json({ error: 'AI returned an incomplete timeline draft.' }, { status: 502 })
		}

		return NextResponse.json({
			draft: {
				title: parsed.title.trim(),
				slug: slugifyTimelineGame(parsed.title),
				description: parsed.description?.trim() ?? '',
				sourcePrompt: prompt,
				events,
			},
		})
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Could not generate timeline game.',
			},
			{ status: 500 }
		)
	}
}
