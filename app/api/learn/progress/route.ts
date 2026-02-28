import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProgressForMicroskill } from '@/lib/learn/progress'

export async function GET(request: Request) {
	const microskillSlug = new URL(request.url).searchParams.get('microskillSlug')
	if (!microskillSlug) {
		return NextResponse.json({ error: 'microskillSlug is required' }, { status: 400 })
	}

	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const progress = await getProgressForMicroskill({
		userId: user.id,
		slug: microskillSlug,
	})

	if (!progress) {
		return NextResponse.json({ error: 'Microskill not found' }, { status: 404 })
	}

	return NextResponse.json(progress)
}
