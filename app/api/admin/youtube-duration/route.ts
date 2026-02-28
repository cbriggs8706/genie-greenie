import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user || !isAdminUser(user)) return null
	return user
}

function extractYoutubeVideoId(url: string) {
	const trimmed = url.trim()
	if (!trimmed) return null

	const patterns = [
		/(?:youtube\.com\/watch\?[^#]*v=)([a-zA-Z0-9_-]{6,})/,
		/(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
		/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
		/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,})/,
	]

	for (const pattern of patterns) {
		const match = trimmed.match(pattern)
		if (match) return match[1]
	}

	return null
}

function parseIsoDurationToSeconds(value: string) {
	const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
	if (!match) return null
	const hours = Number(match[1] ?? '0')
	const minutes = Number(match[2] ?? '0')
	const seconds = Number(match[3] ?? '0')
	const totalSeconds = hours * 3600 + minutes * 60 + seconds
	if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return null
	return Math.ceil(totalSeconds)
}

async function detectDurationWithoutApiKey(videoId: string) {
	const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
	const response = await fetch(watchUrl, {
		cache: 'no-store',
		headers: {
			'user-agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		},
	})
	if (!response.ok) return null

	const html = await response.text()
	const approxMsMatch = html.match(/"approxDurationMs":"(\d+)"/)
	if (approxMsMatch) {
		const approxMs = Number(approxMsMatch[1])
		if (Number.isFinite(approxMs) && approxMs > 0) {
			return Math.ceil(approxMs / 1000)
		}
	}

	const lengthSecondsMatch = html.match(/"lengthSeconds":"(\d+)"/)
	if (lengthSecondsMatch) {
		const seconds = Number(lengthSecondsMatch[1])
		if (Number.isFinite(seconds) && seconds > 0) return Math.ceil(seconds)
	}

	return null
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = (await request.json().catch(() => null)) as { url?: string } | null
	if (!body?.url) {
		return NextResponse.json({ error: 'url is required' }, { status: 400 })
	}

	const videoId = extractYoutubeVideoId(body.url)
	if (!videoId) {
		return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
	}

	const apiKey = process.env.YOUTUBE_API_KEY
	if (!apiKey) {
		const fallbackDuration = await detectDurationWithoutApiKey(videoId)
		if (fallbackDuration) {
			return NextResponse.json({ durationSeconds: fallbackDuration })
		}
		return NextResponse.json(
			{
				error:
					'Could not auto-detect YouTube duration. Set YOUTUBE_API_KEY or enter duration manually.',
			},
			{ status: 422 }
		)
	}

	const apiUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
	apiUrl.searchParams.set('part', 'contentDetails')
	apiUrl.searchParams.set('id', videoId)
	apiUrl.searchParams.set('key', apiKey)

	const response = await fetch(apiUrl.toString(), { cache: 'no-store' })
	if (!response.ok) {
		return NextResponse.json({ error: 'Could not fetch YouTube metadata' }, { status: 502 })
	}

	const payload = (await response.json()) as {
		items?: Array<{ contentDetails?: { duration?: string } }>
	}
	const durationIso = payload.items?.[0]?.contentDetails?.duration
	if (!durationIso) {
		return NextResponse.json({ error: 'YouTube duration not found' }, { status: 404 })
	}

	const durationSeconds = parseIsoDurationToSeconds(durationIso)
	if (!durationSeconds) {
		const fallbackDuration = await detectDurationWithoutApiKey(videoId)
		if (fallbackDuration) {
			return NextResponse.json({ durationSeconds: fallbackDuration })
		}
		return NextResponse.json({ error: 'Could not parse YouTube duration' }, { status: 422 })
	}

	return NextResponse.json({ durationSeconds })
}
