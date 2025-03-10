export type Options = {
	name: string
	points: number
}

export type Question = {
	id: string
	text: string
	options: Options[]
	categoryName?: string
	subcategoryName?: string
}

export type QuizData = {
	questions: Question[]
}

export type Answer = {
	[questionId: string]: string // Map of question ID to user answer
}

export type Scores = {
	[categoryName: string]: number // Map of category name to score
}
