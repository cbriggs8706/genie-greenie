import { randomBytes, createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user || !isAdminUser(user)) return null
	return user
}

function hashApiKey(apiKey: string) {
	return createHash('sha256').update(apiKey).digest('hex')
}

export async function GET() {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const admin = createAdminClient()
	const { data, error } = await admin
		.from('partner_api_keys')
		.select('id,label,is_active,created_at,last_used_at')
		.order('created_at', { ascending: false })

	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ keys: data ?? [] })
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = (await request.json().catch(() => null)) as { label?: string } | null
	if (!body?.label) {
		return NextResponse.json({ error: 'label is required' }, { status: 400 })
	}

	const rawApiKey = randomBytes(24).toString('hex')
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('partner_api_keys')
		.insert({
			label: body.label.trim(),
			api_key_hash: hashApiKey(rawApiKey),
			is_active: true,
		})
		.select('id,label')
		.single()

	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	return NextResponse.json({
		key: {
			id: data.id,
			label: data.label,
			apiKey: rawApiKey,
			prefix: rawApiKey.slice(0, 8),
		},
	})
}
