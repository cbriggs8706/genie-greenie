import {
	activities,
	questions,
	timeCommitment,
	obstacles,
	skills,
} from '@/data/startQuestions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function StartQuiz() {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [filters, setFilters] = useState<Record<number, string[]>>({})
	const [breadcrumb, setBreadcrumb] = useState<
		{ question: string; answers: string[] }[]
	>([])
	const router = useRouter()

	const toggleOption = (option: string) => {
		setFilters((prev) => {
			const selectedOptions = new Set(prev[currentQuestionIndex] || [])
			selectedOptions.has(option)
				? selectedOptions.delete(option)
				: selectedOptions.add(option)
			return { ...prev, [currentQuestionIndex]: Array.from(selectedOptions) }
		})
	}

	const nextQuestion = () => {
		setBreadcrumb((prev) => [
			...prev,
			{
				question: questions[currentQuestionIndex].question,
				answers: filters[currentQuestionIndex] || [],
			},
		])
		setCurrentQuestionIndex((prev) => prev + 1)
	}

	const goToBreadcrumb = (index: number) => {
		setCurrentQuestionIndex(index)
		setBreadcrumb((prev) => prev.slice(0, index))
	}

	const filteredActivities = activities.filter((activity) => {
		const matchesTime =
			!filters[0]?.length ||
			filters[0].some((t) =>
				activity.time.includes(
					Number(
						Object.keys(timeCommitment).find(
							(key) => timeCommitment[Number(key)] === t
						)
					)
				)
			)

		const matchesObstacles =
			!filters[1]?.length ||
			filters[1].some((o) =>
				activity.obstacles.includes(
					Number(
						Object.keys(obstacles).find((key) => obstacles[Number(key)] === o)
					)
				)
			)

		const matchesSkills =
			!filters[2]?.length ||
			filters[2].some((s) =>
				activity.skills.includes(
					Number(Object.keys(skills).find((key) => skills[Number(key)] === s))
				)
			)

		return matchesTime && matchesObstacles && matchesSkills
	})

	return (
		<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center mx-auto mt-10 mb-20">
			{currentQuestionIndex < questions.length ? (
				<>
					<h2 className="text-xl font-semibold mb-4">
						{questions[currentQuestionIndex].question}
					</h2>
					{currentQuestionIndex > 0 && <p>Select all that apply</p>}
					<div className="flex flex-wrap gap-2">
						{questions[currentQuestionIndex].options.map((option) => (
							<button
								key={option}
								className={`block w-full text-left bg-green-500 text-white px-4 py-2 my-1 rounded shadow hover:bg-green-600 ${
									filters[currentQuestionIndex]?.includes(option)
										? 'bg-blue-500 text-white'
										: 'bg-gray-200'
								}`}
								onClick={() => toggleOption(option)}
							>
								{option}
							</button>
						))}
					</div>
					<button
						className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
						onClick={nextQuestion}
					>
						Next
					</button>
				</>
			) : (
				<div className="flex flex-col space-y-4">
					<h2 className="text-xl font-semibold mb-4">Recommended Activities</h2>
					{filteredActivities.length > 0 ? (
						filteredActivities.map((activity) => (
							<div
								key={activity.name}
								className="w-full lg:max-w-2xl bg-white hover:bg-green-500 hover:cursor-pointer p-4 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center mx-auto"
								onClick={() => activity.link && router.push(activity.link)}
							>
								<h3 className="font-semibold text-lg">{activity.name}</h3>
								<p>{activity.description}</p>
							</div>
						))
					) : (
						<p>No activities match your choices. Please adjust your answers.</p>
					)}
				</div>
			)}

			{breadcrumb.length > 0 && (
				<div className="mt-6 border-t pt-4">
					<h3 className="font-semibold mb-2">
						Your Answers to the Previous Questions:
					</h3>
					<p className="mb-4">Click any to change your answer.</p>
					<ol className="space-y-4 text-left list-decimal ml-4">
						{breadcrumb.map((crumb, idx) => (
							<li key={idx}>
								<button
									className="text-sky-800 hover:underline text-left align-top"
									onClick={() => goToBreadcrumb(idx)}
								>
									{crumb.question}: <strong>{crumb.answers.join(', ')}</strong>
								</button>
							</li>
						))}
					</ol>
				</div>
			)}
		</div>
	)
}

// import {
// 	activities,
// 	obstacles,
// 	questions,
// 	skills,
// 	timeCommitment,
// } from '@/data/startQuestions'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// export default function StartQuiz() {
// 	const [filters, setFilters] = useState<Record<number, string[]>>({})

// 	const toggleFilter = (category: number, option: string) => {
// 		setFilters((prev) => {
// 			const selectedOptions = new Set(prev[category] || [])
// 			selectedOptions.has(option)
// 				? selectedOptions.delete(option)
// 				: selectedOptions.add(option)
// 			return { ...prev, [category]: Array.from(selectedOptions) }
// 		})
// 	}

// 	const selectAll = (category: number, options: string[]) => {
// 		setFilters((prev) => ({ ...prev, [category]: options }))
// 	}

// 	const deselectAll = (category: number) => {
// 		setFilters((prev) => ({ ...prev, [category]: [] }))
// 	}

// 	const filteredActivities = activities.filter((activity) => {
// 		const matchesTime =
// 			!filters[0]?.length ||
// 			filters[0].some((t) =>
// 				activity.time.includes(
// 					Number(
// 						Object.keys(timeCommitment).find(
// 							(key) => timeCommitment[Number(key)] === t
// 						)
// 					)
// 				)
// 			)

// 		const matchesObstacles =
// 			!filters[1]?.length ||
// 			filters[1].some((o) =>
// 				activity.obstacles.includes(
// 					Number(
// 						Object.keys(obstacles).find((key) => obstacles[Number(key)] === o)
// 					)
// 				)
// 			)

// 		const matchesSkills =
// 			!filters[2]?.length ||
// 			filters[2].some((s) =>
// 				activity.skills.includes(
// 					Number(Object.keys(skills).find((key) => skills[Number(key)] === s))
// 				)
// 			)

// 		return matchesTime && matchesObstacles && matchesSkills
// 	})

// 	const router = useRouter()

// 	return (
// 		<div className="max-w-5/6 mx-auto p-4 bg-white rounded-xl shadow-md">
// 			{questions.map((q, index) => (
// 				<div key={index} className="mb-4">
// 					<h1 className="font-semibold text-2xl">{q.question}</h1>

// 				 Select All & Deselect All Buttons
// 					 {questions[index].multiple && (
// 					<div className="flex gap-2 mt-2">
// 						<button
// 							onClick={() => selectAll(index, q.options)}
// 							className="px-2 py-1 text-xs bg-green-500 text-white rounded-lg font-inter"
// 						>
// 							Select All
// 						</button>
// 						<button
// 							onClick={() => deselectAll(index)}
// 							className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg font-inter"
// 						>
// 							Deselect All
// 						</button>
// 					</div>
// 				 )
//           }

// 					Options
// 					<div className="flex flex-wrap gap-2 mt-2">
// 						{q.options.map((option) => (
// 							<button
// 								key={option}
// 								onClick={() => toggleFilter(index, option)}
// 								className={`px-3 py-1 rounded-lg border font-inter ${
// 									filters[index]?.includes(option)
// 										? 'bg-blue-500 text-white'
// 										: 'bg-gray-200'
// 								}`}
// 							>
// 								{option}
// 							</button>
// 						))}
// 					</div>
// 				</div>
// 			))}

// 			Display Activities as Cards
// 			<div>
// 				<h2 className="text-xl font-semibold mb-3">Recommended Activities:</h2>
// 				{filteredActivities.length > 0 ? (
// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// 						{filteredActivities.map((activity) => (
// 							<div
// 								key={activity.name}
// 								className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition"
// 								onClick={() => {
// 									if (activity.link) {
// 										router.push(activity.link)
// 									}
// 								}}
// 							>
// 								<h3 className="text-lg font-bold text-center">
// 									{activity.name}
// 								</h3>
// 								<p className="font-semibold text-sm mt-2">
// 									Category: {activity.category}
// 								</p>
// 								<p className="text-gray-700">{activity.description}</p>

// 								Time Commitment Tags
// 								<div className="mt-2">
// 									<p className="font-semibold text-sm">Time Commitment:</p>
// 									<div className="flex flex-wrap gap-1">
// 										{activity.time.map((t) => (
// 											<span
// 												key={t}
// 												className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs"
// 											>
// 												{timeCommitment[t]}
// 											</span>
// 										))}
// 									</div>
// 								</div>

// 								Obstacles Tags
// 								<div className="mt-2">
// 									<p className="font-semibold text-sm">Obstacles:</p>
// 									<div className="flex flex-wrap gap-1">
// 										{activity.obstacles.map((o) => (
// 											<span
// 												key={o}
// 												className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs"
// 											>
// 												{obstacles[Number(o)]}
// 											</span>
// 										))}
// 									</div>
// 								</div>

// 								Skills Tags
// 								<div className="mt-2">
// 									<p className="font-semibold text-sm">Skills:</p>
// 									<div className="flex flex-wrap gap-1">
// 										{activity.skills.map((s) => (
// 											<span
// 												key={s}
// 												className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
// 											>
// 												{skills[Number(s)]}
// 											</span>
// 										))}
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				) : (
// 					<p className="text-gray-500">
// 						No matching activities. Try different choices.
// 					</p>
// 				)}
// 			</div>
// 		</div>
// 	)
// }
