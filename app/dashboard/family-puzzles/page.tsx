import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'
import FamilyPuzzlesCatalog from '@/components/dashboard/family-puzzles-catalog'

export default async function DashboardFamilyPuzzlesPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/login?next=${encodeURIComponent('/dashboard/family-puzzles')}`)
	}

	if (!isAdminUser(user)) {
		redirect('/dashboard')
	}

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap gap-2">
				<Link
					href="/dashboard"
					className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
				>
					Back to Dashboard
				</Link>
			</div>
			<div>
				<h1 className="font-Young_Serif text-3xl text-sky-900">Family Tree Puzzles</h1>
				<p className="mt-2 font-inter text-sky-900">
					Generate puzzles by difficulty, then refine every person, clue, relationship, and
					slot before publishing.
				</p>
			</div>
			<FamilyPuzzlesCatalog />
		</section>
	)
}
