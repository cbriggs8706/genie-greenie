// NicknameQuiz.tsx
'use client'

import { useState, useEffect } from 'react'

export type QuizMode = 'toNicknames' | 'toFormal' | 'mixed'

const sampleNames = [
	'Elizabeth',
	'William',
	'Katherine',
	'John',
	'Robert',
	'Margaret',
	'James',
	'Alexander',
]

const NicknameQuiz = () => {
	const [mode, setMode] = useState<QuizMode>('mixed')
	const [currentQuestion, setCurrentQuestion] = useState<{
		name: string
		nicknames: string[]
	} | null>(null)
	const [quizType, setQuizType] = useState<'toNicknames' | 'toFormal'>(
		'toNicknames'
	)
	const [questionText, setQuestionText] = useState('')
	const [correctAnswers, setCorrectAnswers] = useState<string[]>([])
	const [userInput, setUserInput] = useState('')
	const [feedback, setFeedback] = useState<string | null>(null)
	const [showAnswers, setShowAnswers] = useState(false)
	const [score, setScore] = useState(0)
	const [questionNumber, setQuestionNumber] = useState(1)
	const [maxQuestions] = useState(5)
	const [incorrectQuestions, setIncorrectQuestions] = useState<
		{ question: string; answer: string[]; userGuess: string }[]
	>([])

	useEffect(() => {
		if (questionNumber <= maxQuestions) {
			generateNewQuestion()
		}
	}, [questionNumber, mode])

	const generateNewQuestion = async () => {
		setFeedback(null)
		setShowAnswers(false)
		setUserInput('')

		const quizMode: QuizMode =
			mode === 'mixed'
				? Math.random() < 0.5
					? 'toNicknames'
					: 'toFormal'
				: mode
		setQuizType(quizMode)

		const randomName =
			sampleNames[Math.floor(Math.random() * sampleNames.length)]

		try {
			const res = await fetch(
				`https://nickname-api-er6p.onrender.com/nicknames?name=${encodeURIComponent(randomName)}`
			)
			const data = await res.json()

			if (quizMode === 'toNicknames') {
				setQuestionText(data.name)
				setCorrectAnswers(data.nicknames.map((n: string) => n.toLowerCase()))
			} else {
				const randomNickname =
					data.nicknames[Math.floor(Math.random() * data.nicknames.length)]
				setQuestionText(randomNickname)
				setCorrectAnswers([data.name.toLowerCase()])
			}
		} catch (err) {
			console.error('Failed to fetch quiz question:', err)
			setFeedback('Failed to load quiz question. Try again.')
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const guess = userInput.trim().toLowerCase()
		if (!guess) return

		if (correctAnswers.includes(guess)) {
			setFeedback('✅ Correct!')
			setShowAnswers(true)
			setScore(score + 1)
		} else {
			setFeedback('❌ Not quite.')
			setShowAnswers(true)
			setIncorrectQuestions((prev) => [
				...prev,
				{
					question: questionText,
					answer: correctAnswers,
					userGuess: guess,
				},
			])
		}
	}

	const handleNext = () => {
		if (questionNumber < maxQuestions) {
			setQuestionNumber((prev) => prev + 1)
		} else {
			setFeedback('✅ Quiz complete!')
		}
	}

	return (
		<div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto mt-6">
			<h2 className="text-xl font-bold mb-4 text-green-700">Nickname Quiz</h2>

			<div className="flex flex-wrap gap-2 mb-4">
				<button
					className={`px-3 py-1 rounded ${mode === 'toNicknames' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
					onClick={() => setMode('toNicknames')}
				>
					Formal → Nicknames
				</button>
				<button
					className={`px-3 py-1 rounded ${mode === 'toFormal' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
					onClick={() => setMode('toFormal')}
				>
					Nickname → Formal
				</button>
				<button
					className={`px-3 py-1 rounded ${mode === 'mixed' ? 'bg-green-700 text-white' : 'bg-gray-100'}`}
					onClick={() => setMode('mixed')}
				>
					Mixed
				</button>
			</div>

			<div className="mb-2 text-sm text-gray-700">
				Question {questionNumber} of {maxQuestions} — Score: {score}
			</div>

			{questionNumber <= maxQuestions && (
				<>
					<p className="mb-4 text-gray-700">
						{quizType === 'toNicknames'
							? `What are common nicknames for "${questionText}"?`
							: `What formal name is "${questionText}" a nickname for?`}
					</p>

					<form
						onSubmit={handleSubmit}
						className="flex flex-col sm:flex-row gap-2 items-start mb-4"
					>
						<input
							type="text"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
							placeholder="Type your answer"
						/>
						<button
							type="submit"
							className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 transition"
						>
							Submit
						</button>
					</form>

					{feedback && <p className="mb-4">{feedback}</p>}

					{showAnswers && (
						<div className="mb-4 text-sm text-gray-700">
							<strong>
								Correct {correctAnswers.length > 1 ? 'answers' : 'answer'}:
							</strong>{' '}
							{correctAnswers
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(', ')}
						</div>
					)}

					{showAnswers && questionNumber <= maxQuestions && (
						<button
							onClick={handleNext}
							className="text-sm text-green-700 underline hover:text-green-500"
						>
							Next Question
						</button>
					)}
				</>
			)}

			{questionNumber > maxQuestions && (
				<div className="mt-4 text-sm text-gray-700">
					<h3 className="font-bold mb-2">Incorrect Answers:</h3>
					<ul className="list-disc ml-6">
						{incorrectQuestions.map((item, idx) => (
							<li key={idx}>
								<span className="font-medium">{item.question}</span>: You
								guessed &quot;{item.userGuess}&quot;, correct answer(s):{' '}
								{item.answer
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(', ')}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

export default NicknameQuiz
