'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NextAuthBridgeClient({ nextPath }: { nextPath: string }) {
	const router = useRouter()
	const [message, setMessage] = useState('Completing sign-in...')

	useEffect(() => {
		let active = true

		const run = async () => {
			const response = await fetch('/api/auth/supabase-session', {
				method: 'POST',
				credentials: 'include',
			})
			const body = (await response.json().catch(() => null)) as
				| { error?: string }
				| null

			if (!active) return

			if (!response.ok) {
				setMessage(body?.error || 'Could not complete sign-in. Please try again.')
				return
			}

			await signOut({ redirect: false })
			router.replace(nextPath)
		}

		void run()

		return () => {
			active = false
		}
	}, [nextPath, router])

	return (
		<div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Signing you in</h1>
			<p className="mt-2 text-sm text-slate-600">{message}</p>
		</div>
	)
}
