'use client'
// pages/full-test.tsx

import { quizData } from '@/data/personalityQuestions'
import { Question } from '@/data/types'
import { getStoredScores, storeSubcategoryPoints } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const FullTestPage = () => {
	const [questions, setQuestions] = useState<Question[]>([])
	const [showResults, setShowResults] = useState(false)
	const [scores, setScores] = useState<{
		categoryScores: Record<string, number>
		subcategoryScores: Record<string, number>
	}>({
		categoryScores: {},
		subcategoryScores: {},
	})

	const router = useRouter()

	useEffect(() => {
		// Flatten all questions from all categories and subcategories
		const allQuestions: Question[] = quizData.categories.flatMap((category) =>
			category.subcategories.flatMap((subcategory) => subcategory.questions)
		)
		setQuestions(allQuestions)
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

	const handleRetakeTest = () => {
		localStorage.removeItem('subcategoryScores')
		localStorage.removeItem('categoryScores')
		setShowResults(false)
		window.location.reload()
	}

	return (
		<div>
			<h1>Full Genealogy Personality Test</h1>

			{!showResults ? (
				<div>
					{quizData.categories.map((category) => (
						<div key={category.name}>
							<h2>{category.name}</h2>
							{category.subcategories.map((subcategory) => (
								<div key={subcategory.name}>
									<h3>{subcategory.name}</h3>
									{subcategory.questions.map((question) => (
										<div key={question.id}>
											<p>{question.text}</p>
											{question.options.map((option) => (
												<button
													key={option.name}
													onClick={() =>
														handleAnswerSelection(question, option)
													}
												>
													{option.name}
												</button>
											))}
										</div>
									))}
								</div>
							))}
						</div>
					))}
					<button onClick={handleSubmit}>Submit Full Test</button>
				</div>
			) : (
				<div>
					<h2>Your Final Results</h2>

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

					<button onClick={handleRetakeTest}>Retake Full Test</button>
				</div>
			)}
		</div>
	)
}

export default FullTestPage
