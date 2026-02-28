import { NextResponse } from 'next/server'
import { getPublicMicroskillBySlug } from '@/lib/learn/public'

export async function GET(
	_request: Request,
	context: { params: Promise<{ slug: string }> }
) {
	const { slug } = await context.params
	try {
		const microskill = await getPublicMicroskillBySlug(slug)
		if (!microskill) {
			return NextResponse.json({ error: 'Microskill not found' }, { status: 404 })
		}
		return NextResponse.json({ microskill })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
