import { sanitizeNextPath } from '@/lib/auth/redirect'
import NextAuthBridgeClient from './bridge-client'

export default async function NextAuthBridgePage({
	searchParams,
}: {
	searchParams?: Promise<{ next?: string }>
}) {
	const resolvedSearchParams = searchParams ? await searchParams : undefined
	const nextPath = sanitizeNextPath(resolvedSearchParams?.next)

	return <NextAuthBridgeClient nextPath={nextPath} />
}
