import Link from 'next/link'
import { redirect } from 'next/navigation'
import TimelineGamesManager from '@/components/dashboard/timeline-games-manager'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'
import { listTimelineGamesAdmin } from '@/lib/timeline-games/server'

export default async function DashboardPlayPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/login?next=${encodeURIComponent('/dashboard/play')}`)
	}

	if (!isAdminUser(user)) {
		redirect('/dashboard')
	}

	const games = await listTimelineGamesAdmin()

	return (
		<section className="space-y-4">
			<Link
				href="/dashboard"
				className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
			>
				Back to Dashboard
			</Link>
			<div>
				<h1 className="font-Young_Serif text-3xl text-sky-900">Play Timeline Games</h1>
				<p className="mt-2 font-inter text-sky-900">
					Create and publish timeline games for the new Play section.
				</p>
			</div>
			<TimelineGamesManager initialGames={games} />
		</section>
	)
}
