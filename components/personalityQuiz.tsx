'use client'

import { useState, useEffect } from 'react'
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
	const [chartSize, setChartSize] = useState({
		width: 350,
		height: 350,
		outerRadius: 100,
	})

	useEffect(() => {
		const updateChartSize = () => {
			if (window.innerWidth < 480) {
				setChartSize({ width: 200, height: 300, outerRadius: 75 })
			} else {
				setChartSize({ width: 350, height: 350, outerRadius: 100 })
			}
		}

		updateChartSize()
		window.addEventListener('resize', updateChartSize)

		return () => window.removeEventListener('resize', updateChartSize)
	}, [])

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
		<div className="flex flex-col items-center text-center">
			{!quizComplete ? (
				<>
					<p>
						You&apos;re 28 questions away from finding out what type of
						genealogist you are at heart! Tap/click the green buttons to answer.
						After you&apos;re finished, you&apos;ll be able to see your results
						or retake the quiz.
					</p>

					<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 border-solid text-center mx-auto mt-10 mb-20">
						<h2 className="text-xl font-bold mb-4">
							{questions[currentQuestion].text}
						</h2>
						<div className="flex flex-col gap-8">
							{questions[currentQuestion].options.map((option, idx) => (
								<Button
									key={idx}
									onClick={() => handleAnswer(option.category)}
									className="w-full p-3 bg-green-700 text-white"
								>
									{option.answer}
								</Button>
							))}
						</div>
						<p className="mt-8 text-green-700 text-3xl font-bold">
							{currentQuestion + 1} / {totalQuestions}
						</p>
					</div>
				</>
			) : (
				<div className="w-full mb-20 text-center">
					<h2 className="text-2xl font-bold mb-4">Your Personality Results</h2>
					<p className="mb-4">
						Tap the areas of the chart to read more about each personality.
					</p>
					<PieChart
						width={chartSize.width}
						height={chartSize.height}
						className="mx-auto"
					>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							outerRadius={chartSize.outerRadius}
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
						<div className="mt-6 text-left">
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
