'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { personalityData } from '@/data/personalityQuestions'
import { personalityTypes } from '@/data/personalityTypes'
import { Button } from '@headlessui/react'

const COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#A28DFF',
	'#FF5678',
	'#52D726',
	'#D72652',
]

export default function PersonalityQuiz() {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [results, setResults] = useState<Record<string, number>>({})
	const [quizComplete, setQuizComplete] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

	const questions = personalityData.questions
	const totalQuestions = questions.length

	const handleAnswer = (category: string) => {
		setResults((prev) => ({
			...prev,
			[category]: (prev[category] || 0) + 1,
		}))

		if (currentQuestion < totalQuestions - 1) {
			setCurrentQuestion(currentQuestion + 1)
		} else {
			setQuizComplete(true)
		}
	}

	const data = Object.entries(results).map(([category, count], index) => ({
		name: category,
		value: count,
		color: COLORS[index % COLORS.length],
	}))

	const handlePieClick = (data: { name: string }) => {
		setSelectedCategory(data.name)
	}

	const selectedPersonality = personalityTypes.find((type) =>
		type.title.toLowerCase().includes(selectedCategory?.toLowerCase() || '')
	)

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-6">
			{!quizComplete ? (
				<div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg text-center">
					<h2 className="text-xl font-bold mb-4">
						{questions[currentQuestion].text}
					</h2>
					<div className="flex flex-col gap-4">
						{questions[currentQuestion].options.map((option, idx) => (
							<Button
								key={idx}
								onClick={() => handleAnswer(option.category)}
								className="w-full p-3"
							>
								{option.answer}
							</Button>
						))}
					</div>
					<p className="mt-4 text-gray-500">
						{currentQuestion + 1} / {totalQuestions}
					</p>
				</div>
			) : (
				<div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg text-center">
					<h2 className="text-2xl font-bold mb-4">Your Personality Results</h2>
					<PieChart width={400} height={400} className="mx-auto">
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							outerRadius={150}
							fill="#8884d8"
							dataKey="value"
							label
							onClick={(e) => handlePieClick(e)}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>

					{selectedPersonality && (
						<div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
							<h3 className="text-xl font-bold">{selectedPersonality.title}</h3>

							{selectedPersonality.text
								.split('\n\n')
								.map((paragraph, index) => (
									<p key={index} className="mt-4">
										{paragraph}
									</p>
								))}
						</div>
					)}

					<Button onClick={() => window.location.reload()} className="mt-4">
						Retake Quiz
					</Button>
				</div>
			)}
		</div>
	)
}
