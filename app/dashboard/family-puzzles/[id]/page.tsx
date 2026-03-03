import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'
import FamilyPuzzleEditor from '@/components/dashboard/family-puzzle-editor'

export default async function DashboardFamilyPuzzleDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/login?next=${encodeURIComponent(`/dashboard/family-puzzles/${id}`)}`)
	}

	if (!isAdminUser(user)) {
		redirect('/dashboard')
	}

	const puzzleId = Number(id)
	if (!Number.isFinite(puzzleId)) {
		redirect('/dashboard/family-puzzles')
	}

	return (
		<section className="space-y-4">
			<Link
				href="/dashboard/family-puzzles"
				className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
			>
				Back to Family Puzzles
			</Link>
			<FamilyPuzzleEditor puzzleId={puzzleId} />
		</section>
	)
}
