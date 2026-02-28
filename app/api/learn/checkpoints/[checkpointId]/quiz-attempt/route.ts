import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recordQuizAttempt } from '@/lib/learn/progress'

export async function POST(
	request: Request,
	context: { params: Promise<{ checkpointId: string }> }
) {
	const { checkpointId } = await context.params
	const body = (await request.json().catch(() => ({}))) as {
		microskillId?: number
		scorePercent?: number
	}

	if (
		!checkpointId ||
		typeof body.microskillId !== 'number' ||
		typeof body.scorePercent !== 'number'
	) {
		return NextResponse.json(
			{ error: 'checkpointId, microskillId, and scorePercent are required' },
			{ status: 400 }
		)
	}

	if (body.scorePercent < 0 || body.scorePercent > 100) {
		return NextResponse.json(
			{ error: 'scorePercent must be between 0 and 100' },
			{ status: 400 }
		)
	}

	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user?.id || !user.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await recordQuizAttempt({
		userId: user.id,
		email: user.email,
		microskillId: body.microskillId,
		checkpointId,
		scorePercent: body.scorePercent,
	})

	if ('error' in result) {
		return NextResponse.json({ error: result.error }, { status: result.status })
	}

	return NextResponse.json({
		passed: result.passed,
		passThreshold: result.passThreshold,
		certificateIssued: Boolean(result.certificate),
	})
}
