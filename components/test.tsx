// import { quizData } from '@/data/deepPersonalityQuestions'
// import { useState, useEffect } from 'react'

// interface Answer {
// 	[questionId: string]: string
// }

// interface Totals {
// 	[key: string]: number
// }

// interface Question {
// 	id: string
// 	text: string
// 	options: { name: string; points: number }[]
// 	categoryName?: string
// 	subcategoryName?: string
// }

// const QUESTIONS_PER_PAGE = 5

// export default function TestComponent() {
// 	const [selectedAnswers, setSelectedAnswers] = useState<Answer>({})
// 	const [totals, setTotals] = useState<Totals>({})
// 	const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
// 	const [currentPage, setCurrentPage] = useState(0)

// 	useEffect(() => {
// 		const storedAnswers = JSON.parse(
// 			localStorage.getItem('userAnswers') || '{}'
// 		) as Answer
// 		setSelectedAnswers(storedAnswers)
// 		calculateTotals(storedAnswers)

// 		// Shuffle the questions only once when component mounts
// 		const shuffled = [...quizData.questions].sort(
// 			() => Math.random() - 0.5
// 		) as Question[]
// 		setShuffledQuestions(shuffled)
// 	}, [])

// 	const handleClick = (
// 		questionId: string,
// 		option: string,
// 		points: number,
// 		categoryName?: string,
// 		subcategoryName?: string
// 	) => {
// 		const updatedAnswers: Answer = {
// 			...selectedAnswers,
// 			[questionId]: option,
// 		}
// 		setSelectedAnswers(updatedAnswers)
// 		localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers))
// 		calculateTotals(updatedAnswers)
// 	}

// 	const calculateTotals = (answers: Answer) => {
// 		const newTotals: Totals = {}

// 		shuffledQuestions.forEach((question) => {
// 			const selectedOption = answers[question.id]
// 			const option = question.options.find((opt) => opt.name === selectedOption)
// 			if (option && question.categoryName && question.subcategoryName) {
// 				if (!newTotals[question.categoryName]) {
// 					newTotals[question.categoryName] = 0
// 				}
// 				if (!newTotals[question.subcategoryName]) {
// 					newTotals[question.subcategoryName] = 0
// 				}
// 				newTotals[question.categoryName] += option.points
// 				newTotals[question.subcategoryName] += option.points
// 			}
// 		})
// 		setTotals(newTotals)
// 	}

// 	const startIndex = currentPage * QUESTIONS_PER_PAGE
// 	const currentQuestions = shuffledQuestions.slice(
// 		startIndex,
// 		startIndex + QUESTIONS_PER_PAGE
// 	)
// 	const hasNext = startIndex + QUESTIONS_PER_PAGE < shuffledQuestions.length
// 	const hasPrev = currentPage > 0
// 	const progress =
// 		((startIndex + QUESTIONS_PER_PAGE) / shuffledQuestions.length) * 100

// 	return (
// 		<div className="flex flex-col gap-4 p-4 mb-20">
// 			<div className="w-full bg-gray-200 h-2 rounded-full">
// 				<div
// 					className="bg-blue-500 h-2 rounded-full"
// 					style={{ width: `${progress}%` }}
// 				></div>
// 			</div>

// 			{currentQuestions.map((question) => (
// 				<div key={question.id} className="mb-4">
// 					<p className="text-xl font-bold">{question.text}</p>
// 					<div className="flex gap-2">
// 						{question.options.map((option) => (
// 							<button
// 								key={option.name}
// 								className={`p-2 rounded text-sm ${
// 									selectedAnswers[question.id] === option.name
// 										? 'bg-blue-700 text-white'
// 										: 'border-solid border-blue-500 text-blue-500 border-2'
// 								}`}
// 								onClick={() =>
// 									handleClick(
// 										question.id,
// 										option.name,
// 										option.points,
// 										question.categoryName,
// 										question.subcategoryName
// 									)
// 								}
// 							>
// 								{option.name}
// 							</button>
// 						))}
// 					</div>
// 				</div>
// 			))}

// 			<div className="flex justify-between mt-4">
// 				<button
// 					disabled={!hasPrev}
// 					onClick={() => setCurrentPage((prev) => prev - 1)}
// 					className="p-2 border rounded disabled:opacity-50"
// 				>
// 					Previous
// 				</button>
// 				<button
// 					disabled={!hasNext}
// 					onClick={() => setCurrentPage((prev) => prev + 1)}
// 					className="p-2 border rounded disabled:opacity-50"
// 				>
// 					Next
// 				</button>
// 			</div>

// 			{startIndex + QUESTIONS_PER_PAGE >= shuffledQuestions.length && (
// 				<div className="mt-6 p-4 border-t w-full max-w-md">
// 					<h2 className="text-xl font-bold">Totals</h2>
// 					{Object.entries(totals).map(([key, value], index, array) => (
// 						<div key={key} className="w-full">
// 							<p className="text-lg font-bold">
// 								{key}: <span className="font-normal">{value} points</span>
// 							</p>
// 							{index < array.length - 1 &&
// 								array[index + 1] &&
// 								array[index + 1][0] !== key && (
// 									<hr className="my-2 border-gray-300" />
// 								)}
// 						</div>
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	)
// }
