import Link from 'next/link'
import { redirect } from 'next/navigation'
import MicroskillCuration from '@/components/dashboard/microskill-curation'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardMicroskillDetailPage({
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
		redirect(`/login?next=${encodeURIComponent(`/dashboard/microskills/${id}`)}`)
	}

	if (!isAdminUser(user)) {
		redirect('/dashboard')
	}

	const microskillId = Number(id)
	if (!Number.isFinite(microskillId)) {
		redirect('/dashboard/microskills')
	}

	return (
		<section className="space-y-4">
			<Link
				href="/dashboard/microskills"
				className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
			>
				Back to Microskills
			</Link>
			<MicroskillCuration microskillId={microskillId} />
		</section>
	)
}
