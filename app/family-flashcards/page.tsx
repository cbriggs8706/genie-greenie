import { redirect } from 'next/navigation'
import FamilyFlashcards from '@/components/family/family-flashcards'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'

export default async function FamilyFlashcardsPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/login?next=${encodeURIComponent('/family-flashcards')}`)
	}

	if (!isAdminUser(user)) {
		redirect('/dashboard')
	}

	return (
		<section>
			<FamilyFlashcards />
		</section>
	)
}
