// QuizComponent.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Question } from '@/data/types'
import { quizData } from '@/data/personalityQuestions'
import { getStoredScores, storeSubcategoryPoints } from '@/utils/utils'

const QuizComponent = () => {
	const [questions, setQuestions] = useState<Question[]>([])
	const [showResults, setShowResults] = useState(false)
	const [scores, setScores] = useState<{
		categoryScores: Record<string, number>
		subcategoryScores: Record<string, number>
	}>({
		categoryScores: {},
		subcategoryScores: {},
	})

	useEffect(() => {
		// Select 15 random questions
		const allQuestions: Question[] = quizData.categories.flatMap((category) =>
			category.subcategories.flatMap((subcategory) => subcategory.questions)
		)
		setQuestions(allQuestions.sort(() => 0.5 - Math.random()).slice(0, 2))
		// setQuestions(allQuestions.sort(() => 0.5 - Math.random()).slice(0, 15))
	}, [])

	const handleAnswerSelection = (
		question: Question,
		option: { name: string; points: number }
	) => {
		storeSubcategoryPoints(question.categoryName || 'Unknown', option.points)
	}

	const handleSubmit = () => {
		setScores(getStoredScores())
		setShowResults(true)
	}

	return (
		<div>
			{!showResults ? (
				<div>
					{questions.map((question) => (
						<div key={question.id}>
							<p>{question.text}</p>
							{question.options.map((option) => (
								<button
									key={option.name}
									onClick={() => handleAnswerSelection(question, option)}
								>
									{option.name}
								</button>
							))}
						</div>
					))}
					<button onClick={handleSubmit}>See Results</button>
				</div>
			) : (
				<div>
					<h3>Subcategory Scores</h3>
					{Object.entries(scores.subcategoryScores).map(
						([subcategory, score]) => (
							<p key={subcategory}>
								{subcategory}: {score} points
							</p>
						)
					)}

					<h3>Category Scores</h3>
					{Object.entries(scores.categoryScores).map(([category, score]) => (
						<p key={category}>
							{category}: {score} points
						</p>
					))}
				</div>
			)}
		</div>
	)
}

export default QuizComponent
