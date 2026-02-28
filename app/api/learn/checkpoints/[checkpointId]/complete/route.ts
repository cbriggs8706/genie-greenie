import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { markCheckpointComplete } from '@/lib/learn/progress'

export async function POST(
	request: Request,
	context: { params: Promise<{ checkpointId: string }> }
) {
	const { checkpointId } = await context.params
	const body = (await request.json().catch(() => ({}))) as { microskillId?: number }
	if (!checkpointId || typeof body.microskillId !== 'number') {
		return NextResponse.json(
			{ error: 'checkpointId and microskillId are required' },
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

	const result = await markCheckpointComplete({
		userId: user.id,
		email: user.email,
		microskillId: body.microskillId,
		checkpointId,
	})

	if ('error' in result) {
		return NextResponse.json({ error: result.error }, { status: result.status })
	}

	return NextResponse.json({ certificateIssued: Boolean(result.certificate) })
}
