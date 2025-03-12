export interface Activity {
	name: string
	description: string
	time: number[]
	obstacles: number[]
	skills: number[]
	category: string
	link: string
}

export interface Question {
	question: string
	options: string[]
	multiple: boolean
}

export const timeCommitment: Record<number, string> = {
	1: '5min/day',
	2: '2hrs/week',
	3: '1hr/day',
	4: '12+hrs/week',
}

export const obstacles: Record<number, string> = {
	1: "My tree's already done",
	2: "I don't know where to start",
	3: 'I just get frustrated',
	4: 'Everyone messes up my tree',
	5: "I don't have the time right now",
	6: "I don't have a computer",
	7: "I'm not tech savvy",
	8: 'I feel more drawn to the living, not the dead',
}

export const skills: Record<number, string> = {
	1: 'Research and analysis',
	2: 'Problem solving and deduction',
	3: 'Organization and data management',
	4: 'Communication and collaboration',
}

export const activities: Activity[] = [
	{
		name: 'SourceLinker',
		description: 'Attach records to people in the FamilySearch tree',
		time: [1, 2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2, 3, 5, 6, 7],
		category: 'Attaching',
		link: '/learn/source-linker',
	},
	{
		name: 'Scan Pictures',
		description: '',
		time: [1, 2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
		// link: '/scan',
	},
	{
		name: 'Audio',
		description: '',
		time: [2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Video',
		description: '',
		time: [2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 6, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Stories',
		description: '',
		time: [1, 2, 3, 4],
		skills: [2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Documents',
		description: '',
		time: [1, 2, 3, 4],
		skills: [2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Transcription',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 7, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Transcribus',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'OCR',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Indexing Photos',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Meta Data',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Indexing',
		link: '',
	},

	{
		name: 'Green Leaf Hints',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'RecordSeek',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'Source Box',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'RLL projects',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 5, 6, 7],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'VROC',
		description: '',
		time: [4],
		skills: [1, 2, 3],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
]

export const questions: Question[] = [
	{
		question: 'What is your current time commitment?',
		options: Object.values(timeCommitment),
		multiple: false,
	},
	{
		question: 'What are your biggest obstacles?',
		options: Object.values(obstacles),
		multiple: true,
	},
	{
		question: 'What are your strongest skills?',
		options: Object.values(skills),
		multiple: true,
	},
]
