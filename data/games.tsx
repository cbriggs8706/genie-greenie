export interface Games {
	category: string
	subCategory: string
	url: string
	title: string
	skillLevel: string
	description: string
}

export const games = [
	{
		category: 'Genealogical Research & Analysis',
		subCategory: 'Abbreviations',
		url: 'https://wordwall.net/embed/7f8e5e86b7b6471e8b3810c9cdb4d85d?themeId=1&templateId=5&fontStackId=0',
		title: 'Abbreviations',
		skillLevel: 'Beginner',
		description: 'Common abbreviations in early 20th century newspapers',
	},
	{
		category: 'Genealogical Research & Analysis',
		subCategory: 'Nicknames',
		url: 'https://wordwall.net/embed/134868bdd42746078ef0f2e9877531f7?themeId=41&templateId=76&fontStackId=0',
		title: 'Nicknames',
		skillLevel: 'Beginner',
		description: 'Common nicknames in early 20th century newspapers',
	},
]
