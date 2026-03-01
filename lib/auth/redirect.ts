export function sanitizeNextPath(
	nextPath: string | null | undefined,
	fallback = '/dashboard'
) {
	const value = nextPath?.trim()
	if (!value) return fallback
	if (!value.startsWith('/')) return fallback
	if (value.startsWith('//')) return fallback
	return value
}
