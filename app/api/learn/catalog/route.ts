import { NextResponse } from 'next/server'
import { getMicroskillsForCatalog } from '@/lib/learn/public'
import { createClient } from '@/lib/supabase/server'
import { getCompletedMicroskillIdsForUser } from '@/lib/learn/progress'

export async function GET() {
	try {
		const microskills = await getMicroskillsForCatalog()
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const completedMicroskillIds = user
			? await getCompletedMicroskillIdsForUser(user.id)
			: []

		return NextResponse.json({ microskills, completedMicroskillIds })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
