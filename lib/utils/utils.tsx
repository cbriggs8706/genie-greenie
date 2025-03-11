// utils.ts

import { quizData } from '@/data/deepPersonalityQuestions'

// Store points in localStorage under the subcategory name
export const storeSubcategoryPoints = (
	subcategoryName: string,
	points: number
): void => {
	let subcategoryScores = JSON.parse(
		localStorage.getItem('subcategoryScores') || '{}'
	)

	if (!subcategoryScores[subcategoryName]) {
		subcategoryScores[subcategoryName] = 0
	}

	subcategoryScores[subcategoryName] += points

	localStorage.setItem('subcategoryScores', JSON.stringify(subcategoryScores))

	updateCategoryTotal() // Update total category score whenever a subcategory score is updated
}

// Update total category score based on subcategory scores
export const updateCategoryTotal = (): void => {
	let subcategoryScores = JSON.parse(
		localStorage.getItem('subcategoryScores') || '{}'
	)
	let categoryScores = JSON.parse(
		localStorage.getItem('categoryScores') || '{}'
	)

	// Reset category scores
	Object.keys(categoryScores).forEach((category) => {
		categoryScores[category] = 0
	})

	// Sum up points for each category
	// Object.entries(subcategoryScores).forEach(([subcategory, points]) => {
	// 	const categoryName = findCategoryBySubcategory(subcategory)
	// 	if (categoryName) {
	// 		categoryScores[categoryName] =
	// 			(categoryScores[categoryName] || 0) + points
	// 	}
	// })

	localStorage.setItem('categoryScores', JSON.stringify(categoryScores))
}

// Retrieve category name by subcategory name
// export const findCategoryBySubcategory = (
// 	subcategoryName: string
// ): string | null => {
// 	for (const category of quizData.categories) {
// 		for (const subcategory of category.subcategories) {
// 			if (subcategory.name === subcategoryName) {
// 				return category.name
// 			}
// 		}
// 	}
// 	return null
// }

// Retrieve scores from localStorage
export const getStoredScores = (): {
	subcategoryScores: Record<string, number>
	categoryScores: Record<string, number>
} => {
	return {
		subcategoryScores: JSON.parse(
			localStorage.getItem('subcategoryScores') || '{}'
		) as Record<string, number>,
		categoryScores: JSON.parse(
			localStorage.getItem('categoryScores') || '{}'
		) as Record<string, number>,
	}
}
