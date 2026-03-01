import LoginForm from './login-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sanitizeNextPath } from '@/lib/auth/redirect'

export default async function LoginPage({
	searchParams,
}: {
	searchParams?: Promise<{ next?: string }>
}) {
	const resolvedSearchParams = searchParams ? await searchParams : undefined
	const nextPath = sanitizeNextPath(resolvedSearchParams?.next)

	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		redirect(nextPath)
	}

	return <LoginForm nextPath={nextPath} />
}
