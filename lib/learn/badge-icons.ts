import dynamicIconImports from 'lucide-react/dynamicIconImports'

export type IconName = keyof typeof dynamicIconImports

export const DEFAULT_BADGE_ICON: IconName = 'award'

const allIconNames = Object.keys(dynamicIconImports) as IconName[]
const iconNameSet = new Set<string>(allIconNames)

function toKebabCase(input: string) {
	return input
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase()
}

export const BADGE_ICONS = [...allIconNames].sort((a, b) => a.localeCompare(b))

export function sanitizeBadgeIconName(value: unknown): IconName {
	if (typeof value !== 'string') return DEFAULT_BADGE_ICON
	const trimmed = value.trim()
	if (!trimmed) return DEFAULT_BADGE_ICON
	if (iconNameSet.has(trimmed)) return trimmed as IconName

	const normalized = toKebabCase(trimmed)
	if (iconNameSet.has(normalized)) return normalized as IconName

	return DEFAULT_BADGE_ICON
}
