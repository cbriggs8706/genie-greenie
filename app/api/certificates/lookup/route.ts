import { NextResponse } from 'next/server'
import {
	authenticatePartnerApiKey,
	lookupCertificatesByEmail,
} from '@/lib/learn/progress'

export async function POST(request: Request) {
	const apiKey = request.headers.get('x-api-key')
	if (!apiKey) {
		return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
	}

	const partner = await authenticatePartnerApiKey(apiKey)
	if (!partner) {
		return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
	}

	const body = (await request.json().catch(() => ({}))) as { email?: string }
	if (!body.email) {
		return NextResponse.json({ error: 'email is required' }, { status: 400 })
	}

	const result = await lookupCertificatesByEmail(body.email, partner.id)
	return NextResponse.json({ email: result.emailNormalized, certificates: result.certificates })
}
