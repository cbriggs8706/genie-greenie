import Link from 'next/link'
import { redirect } from 'next/navigation'
import MicroskillsAssignmentView from '@/components/dashboard/microskills-assignment-view'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardMicroskillAssignmentPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/login')
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
				<Link
					href="/dashboard/microskills"
					className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
				>
					Back to LMS Microskills
				</Link>
			</div>
			<div>
				<h1 className="font-Young_Serif text-3xl text-sky-900">
					Microskill Assignment Catalog
				</h1>
				<p className="mt-2 font-inter text-sky-900">
					View all available microskills with full details and links, then select the ones
					to assign to consultants.
				</p>
			</div>
			<MicroskillsAssignmentView />
		</section>
	)
}
