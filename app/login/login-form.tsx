'use client'

import { createClient, supabaseConfigured } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function GoogleLogo() {
	return (
		<svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
			<path
				fill="#FFC107"
				d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.2 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.95 3.05l5.66-5.66C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z"
			/>
			<path
				fill="#FF3D00"
				d="M6.31 14.69l6.57 4.82C14.66 15.06 18.97 12 24 12c3.06 0 5.84 1.15 7.95 3.05l5.66-5.66C34.05 6.05 29.27 4 24 4c-7.68 0-14.38 4.34-17.69 10.69z"
			/>
			<path
				fill="#4CAF50"
				d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.19-5.24C29.15 35.17 26.7 36 24 36c-5.18 0-9.62-3.32-11.28-7.93l-6.52 5.02C9.47 39.56 16.2 44 24 44z"
			/>
			<path
				fill="#1976D2"
				d="M43.61 20.08H42V20H24v8h11.3c-.79 2.27-2.23 4.25-4.08 5.56l.01-.01 6.19 5.24C36.97 39.19 44 34 44 24c0-1.34-.14-2.65-.39-3.92z"
			/>
		</svg>
	)
}

export default function LoginForm() {
	const router = useRouter()
	const [message, setMessage] = useState<string | null>(null)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [pending, setPending] = useState(false)
	const [showEmailLogin, setShowEmailLogin] = useState(false)

	async function handleGoogleSignIn() {
		if (!supabaseConfigured()) {
			setMessage('Supabase env vars are missing.')
			return
		}

		const supabase = createClient()
		const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
		const normalizedSiteUrl = configuredSiteUrl?.replace(/\/+$/, '')
		const redirectBase = normalizedSiteUrl || window.location.origin

		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${redirectBase}/auth/callback?next=/dashboard`,
			},
		})

		if (error) {
			setMessage(error.message)
		}
	}

	async function handleEmailSignIn() {
		if (!supabaseConfigured()) {
			setMessage('Supabase env vars are missing.')
			return
		}
		if (!email || !password) {
			setMessage('Enter your email and password.')
			return
		}

		setPending(true)
		setMessage(null)
		const supabase = createClient()
		const { error } = await supabase.auth.signInWithPassword({ email, password })
		setPending(false)

		if (error) {
			setMessage(error.message)
			return
		}

		router.push('/dashboard')
		router.refresh()
	}

	async function handleEmailSignUp() {
		if (!supabaseConfigured()) {
			setMessage('Supabase env vars are missing.')
			return
		}
		if (!email || !password) {
			setMessage('Enter your email and password.')
			return
		}

		setPending(true)
		setMessage(null)
		const supabase = createClient()
		const { error } = await supabase.auth.signUp({ email, password })
		setPending(false)

		if (error) {
			setMessage(error.message)
			return
		}

		setMessage(
			'Account created. If email confirmation is enabled, check your inbox before signing in.'
		)
	}

	return (
		<div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-semibold text-slate-900">Login</h1>
			<p className="mt-2 text-sm text-slate-600">
				Continue with Google to access your dashboard quickly, or use
				email/password below.
			</p>

			<button
				type="button"
				className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
				onClick={() => void handleGoogleSignIn()}
				disabled={pending}
			>
				<GoogleLogo />
				Continue with Google
			</button>

			<div className="mt-4">
				<button
					type="button"
					onClick={() => setShowEmailLogin((current) => !current)}
					className="text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
				>
					{showEmailLogin
						? 'Hide email/password login'
						: 'Use email and password instead'}
				</button>
			</div>

			{showEmailLogin ? (
				<div className="mt-4 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
					<label className="block text-sm font-medium text-slate-700" htmlFor="email">
						Email (username)
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
						placeholder="you@example.com"
					/>
					<label
						className="block text-sm font-medium text-slate-700"
						htmlFor="password"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					/>
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							onClick={() => void handleEmailSignIn()}
							disabled={pending}
							className="rounded-md bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{pending ? 'Please wait...' : 'Sign in'}
						</button>
						<button
							type="button"
							onClick={() => void handleEmailSignUp()}
							disabled={pending}
							className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{pending ? 'Please wait...' : 'Create account'}
						</button>
					</div>
				</div>
			) : null}

			{message ? (
				<p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{message}
				</p>
			) : null}
		</div>
	)
}
