import type { AvatarStylePreset, PuzzlePerson } from '@/lib/family-puzzles/types'

export const AVATAR_STYLE_PRESETS: AvatarStylePreset[] = [
	'classic_cartoon',
	'storybook',
	'bold_comic',
	'soft_painterly',
]

const DICEBEAR_PRESET_MAP: Record<
	AvatarStylePreset,
	{ styles: string[]; backgrounds: string[] }
> = {
	classic_cartoon: {
		styles: ['personas', 'adventurer-neutral', 'notionists-neutral'],
		backgrounds: ['fef08a,16a34a', '93c5fd,10b981', 'fde68a,60a5fa'],
	},
	storybook: {
		styles: ['lorelei-neutral', 'thumbs', 'fun-emoji'],
		backgrounds: ['fbcfe8,fde68a', 'c7d2fe,a7f3d0', 'fecaca,fdba74'],
	},
	bold_comic: {
		styles: ['bottts-neutral', 'pixel-art-neutral', 'adventurer-neutral'],
		backgrounds: ['fb7185,7c3aed', 'f97316,ea580c', '0ea5e9,1d4ed8'],
	},
	soft_painterly: {
		styles: ['notionists-neutral', 'open-peeps', 'personas'],
		backgrounds: ['bfdbfe,ddd6fe', 'a7f3d0,67e8f9', 'fde68a,f9a8d4'],
	},
}

function toSlug(value: string) {
	return encodeURIComponent(value.trim().toLowerCase().replace(/\s+/g, '-'))
}

function hashString(value: string) {
	let hash = 0
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index)
		hash |= 0
	}
	return Math.abs(hash)
}

export function buildFallbackAvatar(
	person: Pick<PuzzlePerson, 'fullName' | 'personCode'>,
	avatarStylePreset: AvatarStylePreset = 'classic_cartoon'
) {
	const seedText = `${person.personCode}-${person.fullName}`
	const seed = hashString(seedText)
	const preset = DICEBEAR_PRESET_MAP[avatarStylePreset] ?? DICEBEAR_PRESET_MAP.classic_cartoon
	const style = preset.styles[seed % preset.styles.length]
	const backgroundColor = preset.backgrounds[seed % preset.backgrounds.length]
	return `https://api.dicebear.com/9.x/${style}/png?seed=${toSlug(seedText)}&size=512&backgroundType=gradientLinear&backgroundColor=${backgroundColor}`
}

export async function generateAvatarWithAI(
	person: Pick<PuzzlePerson, 'fullName' | 'gender' | 'occupation' | 'hobby' | 'avatarPrompt' | 'personCode'>,
	avatarStylePreset: AvatarStylePreset = 'classic_cartoon'
) {
	const provider = (process.env.FAMILY_AVATAR_PROVIDER || 'dicebear').toLowerCase()
	if (provider !== 'openai') {
		return buildFallbackAvatar(person, avatarStylePreset)
	}

	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		return buildFallbackAvatar(person, avatarStylePreset)
	}

	const seed = hashString(`${person.personCode}:${person.fullName}`)
	const presetLine =
		avatarStylePreset === 'storybook'
			? 'Use whimsical storybook cartoon styling with textured brush strokes.'
			: avatarStylePreset === 'bold_comic'
				? 'Use bold comic-book outlines, saturated colors, and high contrast shading.'
				: avatarStylePreset === 'soft_painterly'
					? 'Use soft painterly shading with gentle gradients and expressive eyes.'
					: 'Use polished classic family-game cartoon styling.'
	const skinTones = [
		'very fair skin',
		'fair skin',
		'light olive skin',
		'medium skin tone',
		'deep brown skin tone',
		'rich dark skin tone',
	]
	const hairStyles = [
		'short textured hair',
		'curly hair',
		'wavy shoulder-length hair',
		'neatly tied-back hair',
		'fade haircut',
		'long straight hair',
	]
	const clothingStyles = [
		'teal cardigan',
		'golden sweater',
		'navy shirt with light jacket',
		'patterned blouse',
		'orange hoodie',
		'green collared shirt',
	]
	const expression = ['friendly smile', 'thoughtful expression', 'confident smile'][seed % 3]
	const prompt = [
		'Create a polished cartoon portrait avatar with attractive facial detail (eyes, eyebrows, nose, mouth, hairline).',
		presetLine,
		'Style reference: polished family-game character art, never doodle or stick-figure style.',
		'Render in full color, modern 2D character illustration, clean line art, soft shading, warm lighting.',
		'Composition: centered head-and-shoulders portrait, circular crop framing, plain uncluttered background.',
		'No text, no logos, no watermark, no distortion, no extra people, no body cut-off at eyes/chin.',
		`Character traits: ${skinTones[seed % skinTones.length]}, ${hairStyles[(seed + 2) % hairStyles.length]}, ${clothingStyles[(seed + 4) % clothingStyles.length]}, ${expression}.`,
		`${person.fullName} is ${person.gender}, occupation: ${person.occupation}, hobby: ${person.hobby}.`,
		person.avatarPrompt,
	].join(' ')

	try {
		const response = await fetch('https://api.openai.com/v1/images/generations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-image-1',
				prompt,
				size: '1024x1024',
			}),
		})

		if (!response.ok) {
			return buildFallbackAvatar(person, avatarStylePreset)
		}

		const payload = (await response.json()) as {
			data?: Array<{ b64_json?: string; url?: string }>
		}
		const image = payload.data?.[0]
		if (image?.b64_json) {
			return `data:image/png;base64,${image.b64_json}`
		}
		if (image?.url) {
			return image.url
		}
		return buildFallbackAvatar(person, avatarStylePreset)
	} catch {
		return buildFallbackAvatar(person, avatarStylePreset)
	}
}
