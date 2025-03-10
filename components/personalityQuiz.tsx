import { quizData } from '@/data/personalityQuestions'
import { useState, useEffect } from 'react'
import { H2 } from './headings'
import { useRouter } from 'next/navigation'

interface Answer {
	[questionId: string]: string
}

interface Totals {
	[key: string]: number
}

interface Question {
	id: string
	text: string
	options: { name: string; points: number }[]
	categoryName?: string
	subcategoryName?: string
}

export default function QuizComponent() {
	const [selectedAnswers, setSelectedAnswers] = useState<Answer>({})
	const [totals, setTotals] = useState<Totals>({})
	const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
	const router = useRouter()

	useEffect(() => {
		const storedAnswers = JSON.parse(
			localStorage.getItem('personality') || '{}'
		) as Answer
		setSelectedAnswers(storedAnswers)
		calculateTotals(storedAnswers)

		// Group questions by category
		const categoryMap: { [key: string]: Question[] } = {}
		quizData.questions.forEach((question) => {
			if (question.categoryName) {
				if (!categoryMap[question.categoryName]) {
					categoryMap[question.categoryName] = []
				}
				categoryMap[question.categoryName].push(question)
			}
		})

		// Select the first two questions from each category
		const selectedQuestions: Question[] = Object.values(categoryMap)
			.map((questions) => questions.slice(0, 2))
			.flat()

		setShuffledQuestions(selectedQuestions)
	}, [])

	const handleReset = () => {
		localStorage.removeItem('personality')
		window.location.reload()
	}

	const handleClick = (
		questionId: string,
		option: string,
		points: number,
		categoryName?: string
	) => {
		const updatedAnswers: Answer = { ...selectedAnswers, [questionId]: option }
		setSelectedAnswers(updatedAnswers)
		localStorage.setItem('personality', JSON.stringify(updatedAnswers))
		calculateTotals(updatedAnswers)
	}

	const calculateTotals = (answers: Answer) => {
		const newTotals: Totals = {}
		shuffledQuestions.forEach((question) => {
			const selectedOption = answers[question.id]
			const option = question.options.find((opt) => opt.name === selectedOption)
			if (option && question.categoryName) {
				if (!newTotals[question.categoryName]) {
					newTotals[question.categoryName] = 0
				}
				newTotals[question.categoryName] += option.points
			}
		})
		setTotals(newTotals)
	}

	return (
		<div className="flex flex-col gap-4 p-4 mb-20">
			{shuffledQuestions.map((question) => (
				<div key={question.id} className="mb-4">
					<p className="text-xl font-bold">{question.text}</p>
					<div className="flex gap-2">
						{question.options.map((option) => (
							<button
								key={option.name}
								className={`p-2 rounded text-sm ${
									selectedAnswers[question.id] === option.name
										? 'bg-blue-700 text-white'
										: 'border-solid border-blue-500 text-blue-500 border-2'
								}`}
								onClick={() =>
									handleClick(
										question.id,
										option.name,
										option.points,
										question.categoryName
									)
								}
							>
								{option.name}
							</button>
						))}
					</div>
				</div>
			))}

			<div className="flex justify-between mt-4">
				<button
					onClick={handleReset}
					className="p-2 border rounded disabled:opacity-50"
				>
					Reset & Start Over
				</button>
			</div>

			<h2>Your Personality Mix </h2>
			<div className="mt-6 p-4 border-t w-full max-w-md">
				<h2 className="text-xl font-bold">Totals</h2>
				{Object.entries(totals).map(([key, value]) => (
					<div key={key} className="w-full">
						<p className="text-lg font-bold">
							{key}: <span className="font-normal">{value} points</span>
						</p>
					</div>
				))}
			</div>
			<div>
				Want to take the full personality quiz and find out exactly what type of
				genealogist you are?
				<button
					onClick={() => {
						router.push('/test')
					}}
					className="p-2 border rounded disabled:opacity-50"
				>
					Click Here
				</button>
			</div>
		</div>
	)
}
