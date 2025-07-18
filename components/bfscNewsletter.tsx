'use client'

import { useState } from 'react'

export default function BFSCNewsletterSignup() {
	const [email, setEmail] = useState('')
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus('loading')

		const res = await fetch('/api/newsletter', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		})

		if (res.ok) {
			setStatus('success')
			setEmail('')
		} else {
			setStatus('error')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-2">
			<input
				type="email"
				placeholder="Your email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="border px-3 py-2 rounded w-full"
			/>
			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded"
				disabled={status === 'loading'}
			>
				{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
			</button>
			{status === 'success' && (
				<p className="text-green-600">
					Thanks for subscribing to the Burley FamilySearch Newsletter!
				</p>
			)}
			{status === 'error' && (
				<p className="text-red-600">Something went wrong. Try again.</p>
			)}
		</form>
	)
}
