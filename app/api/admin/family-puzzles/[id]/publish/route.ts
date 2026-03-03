import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user || !isAdminUser(user)) {
		return null
	}
	return user
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id: idValue } = await params
	const id = Number(idValue)
	if (!Number.isFinite(id)) {
		return NextResponse.json({ error: 'Invalid id.' }, { status: 400 })
	}

	const body = (await request.json().catch(() => null)) as { published?: boolean } | null
	const status = body?.published === false ? 'draft' : 'published'

	const admin = createAdminClient()
	const { error } = await admin
		.from('family_puzzles')
		.update({ status, updated_at: new Date().toISOString() })
		.eq('id', id)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ ok: true, status })
}
