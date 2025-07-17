// components/TriviaQuiz.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { TriviaQuestion } from '@/data/locationTrivia'

interface Props {
	allQuestions: { city: string; questions: TriviaQuestion[] }[]
}

export default function TriviaQuiz({ allQuestions }: Props) {
	const [selectedCity, setSelectedCity] = useState<string>('')
	const [numQuestions, setNumQuestions] = useState<number | 'all'>(5)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [selected, setSelected] = useState<string | null>(null)
	const [score, setScore] = useState(0)
	const [completed, setCompleted] = useState(false)
	const [userAnswers, setUserAnswers] = useState<
		{ question: TriviaQuestion; selected: string }[]
	>([])

	const availableCities = useMemo(
		() => allQuestions.map((q) => q.city),
		[allQuestions]
	)
	const questions = useMemo(() => {
		const found = allQuestions.find((q) => q.city === selectedCity)
		if (!found) return []

		const shuffled = [...found.questions].sort(() => 0.5 - Math.random())
		if (numQuestions === 'all') return shuffled
		return shuffled.slice(0, numQuestions)
	}, [allQuestions, selectedCity, numQuestions])

	const current = questions[currentIndex]
	const allAnswers = useMemo(() => {
		if (!current) return []
		return [...current.correctAnswers, ...current.incorrectAnswers].sort(
			() => 0.5 - Math.random()
		)
	}, [current])

	const handleAnswer = (answer: string) => {
		if (selected || !current) return
		setSelected(answer)

		setUserAnswers((prev) => [...prev, { question: current, selected: answer }])

		if (current.correctAnswers.includes(answer)) {
			setScore((prev) => prev + 1)
		}

		setTimeout(() => {
			if (currentIndex + 1 < questions.length) {
				setCurrentIndex((prev) => prev + 1)
				setSelected(null)
			} else {
				setCompleted(true)
			}
		}, 1000)
	}

	const handleRestart = () => {
		setCurrentIndex(0)
		setScore(0)
		setSelected(null)
		setCompleted(false)
		setUserAnswers([])
	}

	if (!selectedCity) {
		return (
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4">Select a City</h2>
				<div className="space-y-2">
					{availableCities.map((city) => (
						<Button
							key={city}
							className="w-full bg-green-700"
							onClick={() => setSelectedCity(city)}
						>
							{city}
						</Button>
					))}
				</div>
			</div>
		)
	}

	if (questions.length === 0) {
		return (
			<div className="p-4 text-center">
				<h2 className="text-2xl font-bold mb-4">
					No questions available for {selectedCity}
				</h2>
				<Button onClick={() => setSelectedCity('')}>Back</Button>
			</div>
		)
	}

	if (completed) {
		const incorrectAnswers = userAnswers.filter(
			({ question, selected }) => !question.correctAnswers.includes(selected)
		)
		return (
			<div className="p-4 text-center">
				<h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
				<p className="text-lg">
					You scored {score} out of {questions.length}.
				</p>
				{incorrectAnswers.length > 0 && (
					<div className="mt-6 text-left">
						<h3 className="text-lg font-bold mb-2">
							Review Your Missed Questions
						</h3>
						<ul className="space-y-3">
							{incorrectAnswers.map(({ question, selected }, i) => (
								<li key={i} className="border p-3 rounded bg-red-50">
									<p className="font-semibold">{question.prompt}</p>
									<p className="text-sm text-gray-700 mt-1">
										Your answer: <span className="italic">{selected}</span>
									</p>
								</li>
							))}
						</ul>
					</div>
				)}
				<Button className="mt-4 bg-green-700" onClick={handleRestart}>
					Restart Quiz
				</Button>
				<Button
					className="mt-4 ml-2"
					variant="outline"
					onClick={() => {
						setSelectedCity('')
						setCompleted(false)
						setUserAnswers([])
						setCurrentIndex(0)
						setScore(0)
						setSelected(null)
					}}
				>
					Change City
				</Button>
			</div>
		)
	}

	return (
		<div className="w-full max-w-xl mx-auto p-4">
			{currentIndex === 0 && (
				<div className="flex flex-row items-center justify-between gap-4">
					<div className="mb-4 grow">
						<label className="block mb-1 font-semibold">
							Number of Questions
						</label>
						<select
							value={numQuestions === 'all' ? 'all' : numQuestions}
							onChange={(e) =>
								setNumQuestions(
									e.target.value === 'all' ? 'all' : Number(e.target.value)
								)
							}
							className="w-full border border-gray-300 rounded px-2 py-1"
						>
							{['all', 5, 10, 15, 20].map((n) => (
								<option key={n} value={n}>
									{n === 'all' ? 'All' : n}
								</option>
							))}
						</select>
					</div>
					<div>
						<Button
							className="sm"
							variant="outline"
							onClick={() => {
								setSelectedCity('')
								setCompleted(false)
								setUserAnswers([])
								setCurrentIndex(0)
								setScore(0)
								setSelected(null)
							}}
						>
							Change City
						</Button>
					</div>
				</div>
			)}

			<div className="flex justify-between items-center mb-2">
				<h2 className="text-xl font-bold">
					Question {currentIndex + 1} of {questions.length}
				</h2>
				{/* <Button
					className="sm"
					variant="outline"
					onClick={() => setSelectedCity('')}
				>
					Change City
				</Button> */}
				<Button size="sm" variant="outline" onClick={handleRestart}>
					Restart
				</Button>
			</div>

			<p className="mb-4 min-h-[60px]">{current.prompt}</p>
			<div className="space-y-2">
				{allAnswers.map((answer, i) => (
					<Button
						key={i}
						className="w-full bg-green-700 min-h-[48px] "
						onClick={() => handleAnswer(answer)}
						disabled={!!selected}
					>
						{answer}
					</Button>
				))}
			</div>
		</div>
	)
}
