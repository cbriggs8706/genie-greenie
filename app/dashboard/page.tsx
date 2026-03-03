import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { sanitizeBadgeIconName } from '@/lib/learn/badge-icons'
import { getMicroskillBadgesForUser } from '@/lib/learn/progress'
import { DynamicIcon } from 'lucide-react/dynamic'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SignOutButton from './sign-out-button'

export default async function DashboardPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/login?next=${encodeURIComponent('/dashboard')}`)
	}

	const canEditMicroskills = isAdminUser(user)
	const badges = await getMicroskillBadgesForUser(user.id)
	const badgesByCategory = badges.reduce<Record<string, typeof badges>>((acc, badge) => {
		if (!acc[badge.category]) {
			acc[badge.category] = []
		}
		acc[badge.category].push(badge)
		return acc
	}, {})
	const categories = Object.entries(badgesByCategory)
		.filter(([, value]) => value.length > 0)
		.sort(([leftCategory, leftBadges], [rightCategory, rightBadges]) => {
			const leftSort = Math.min(...leftBadges.map((badge) => badge.categorySort))
			const rightSort = Math.min(...rightBadges.map((badge) => badge.categorySort))
			return leftSort - rightSort || leftCategory.localeCompare(rightCategory)
		})

	return (
		<section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
			<p className="mt-2 text-sm text-slate-600">
				You are signed in as <span className="font-medium">{user.email}</span>.
			</p>
			{canEditMicroskills ? (
				<div className="mt-6 rounded-lg border-2 border-green-700 bg-green-50 p-4">
					<p className="text-sm text-sky-900">
						Admin tools are available for your account.
					</p>
					<Link
						href="/dashboard/microskills"
						className="mt-3 inline-flex rounded bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
					>
						Open LMS Curation
					</Link>
					<Link
						href="/dashboard/microskills/assign"
						className="mt-3 ml-2 inline-flex rounded border-2 border-green-700 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Open Assignment Catalog
					</Link>
					<Link
						href="/dashboard/family-puzzles"
						className="mt-3 ml-2 inline-flex rounded border-2 border-green-700 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-500 hover:text-white"
					>
						Open Family Puzzle Studio
					</Link>
				</div>
			) : null}
			{categories.length > 0 ? (
				<div className="mt-6 space-y-3">
					<h2 className="font-Young_Serif text-2xl text-sky-900">Your Microskill Badges</h2>
					{categories.map(([category, categoryBadges]) => (
						<div key={category} className="rounded-lg border-2 border-green-700 p-3">
							<h3 className="font-Young_Serif text-xl text-sky-900">{category}</h3>
							<div className="mt-2 grid grid-cols-1 gap-2">
								{categoryBadges.map((badge) => {
									return (
									<Link
										key={badge.microskillId}
										href={`/learn/${badge.microskillSlug}`}
										className={`rounded p-3 border-2 transition ${
											badge.status === 'renewal_required'
												? 'border-orange bg-lightyellow hover:bg-orange hover:text-white'
												: 'border-green-700 bg-green-700 text-white hover:bg-green-500'
										}`}
									>
										<div className="flex items-start gap-2">
											<DynamicIcon
												name={sanitizeBadgeIconName(badge.badgeIcon)}
												className="mt-0.5 h-5 w-5 shrink-0"
												aria-hidden="true"
											/>
											<div>
												<p className="font-Young_Serif text-lg">{badge.microskillTitle}</p>
												<p className="font-inter text-xs mt-1">
													{badge.status === 'renewal_required'
														? `Renewal needed (v${badge.earnedVersion} -> v${badge.currentVersion})`
														: `Earned (v${badge.earnedVersion})`}
												</p>
											</div>
										</div>
									</Link>
									)
								})}
							</div>
						</div>
					))}
				</div>
			) : null}
			<div className="mt-6">
				<SignOutButton />
			</div>
		</section>
	)
}
