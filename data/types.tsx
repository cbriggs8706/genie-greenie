// types.ts

export type Options = {
	name: string
	points: number
}

export type Question = {
	id: string
	text: string
	type: 'multiple-choice' | 'true-false' // or any other type you might use
	options: Options[]
	categoryName?: string // This will help us group the questions by categories
}

export type Subcategory = {
	name: string
	questions: Question[]
}

export type Category = {
	name: string
	subcategories: Subcategory[]
}

export type QuizData = {
	categories: Category[]
}

export type Answer = {
	[questionId: string]: string // Map of question ID to user answer
}

export type Scores = {
	[categoryName: string]: number // Map of category name to score
}
