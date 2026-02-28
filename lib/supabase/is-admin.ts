type SupabaseUserLike = {
	email?: string | null
	app_metadata?: Record<string, unknown> | null
	user_metadata?: Record<string, unknown> | null
}

const normalize = (value: unknown): string => {
	return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

const hasAdminRole = (value: unknown): boolean => {
	if (Array.isArray(value)) {
		return value.some((entry) => normalize(entry) === 'admin')
	}

	return normalize(value) === 'admin'
}

export const isAdminUser = (user: SupabaseUserLike | null): boolean => {
	if (!user) {
		return false
	}

	const configuredAdmins = (process.env.ADMIN_EMAILS || '')
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean)

	const userEmail = (user.email || '').trim().toLowerCase()
	const isEmailAdmin =
		userEmail.length > 0 && configuredAdmins.includes(userEmail)

	return (
		isEmailAdmin ||
		hasAdminRole(user.app_metadata?.role) ||
		hasAdminRole(user.app_metadata?.roles) ||
		hasAdminRole(user.user_metadata?.role) ||
		hasAdminRole(user.user_metadata?.roles)
	)
}
