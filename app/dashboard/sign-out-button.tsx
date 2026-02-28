'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
	const router = useRouter()
	const [pending, setPending] = useState(false)

	async function handleSignOut() {
		setPending(true)
		const supabase = createClient()
		await supabase.auth.signOut()
		router.push('/login')
		router.refresh()
	}

	return (
		<button
			type="button"
			onClick={() => void handleSignOut()}
			disabled={pending}
			className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{pending ? 'Signing out...' : 'Sign out'}
		</button>
	)
}
