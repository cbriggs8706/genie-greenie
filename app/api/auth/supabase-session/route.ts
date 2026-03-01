import { createServerClient } from '@supabase/ssr'
import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	})
	const googleIdToken = (token as Record<string, unknown> | null)?.googleIdToken

	if (typeof googleIdToken !== 'string') {
		return NextResponse.json(
			{ error: 'Missing Google ID token in NextAuth session.' },
			{ status: 401 }
		)
	}

	const response = NextResponse.json({ ok: true })
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL || '',
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						request.cookies.set(name, value)
						response.cookies.set(name, value, options)
					})
				},
			},
		}
	)

	const { error } = await supabase.auth.signInWithIdToken({
		provider: 'google',
		token: googleIdToken,
	})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}

	return response
}
