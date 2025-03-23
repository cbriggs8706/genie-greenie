import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { microSkills } from '@/data/microskills'

export default function StartQuiz() {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [filters, setFilters] = useState<Record<number, string[]>>({})
	const [breadcrumb, setBreadcrumb] = useState<
		{ question: string; answers: string[] }[]
	>([])
	const router = useRouter()

	// Filter beginner-level skills and retain category
	const beginnerSkills = microSkills.flatMap((category) =>
		category.skills
			.filter((skill) => skill.skillLevel === 'Beginner')
			.map((skill) => ({ ...skill, category: category.category }))
	)

	// Extract unique time commitments from skills that include the time key
	const timeCommitments = Array.from(
		new Set(beginnerSkills.flatMap((skill) => skill.time || []))
	)

	// Extract unique categories
	const categories = Array.from(new Set(microSkills.map((cat) => cat.category)))

	// Define the quiz questions
	const questions = [
		{ question: 'How much time can you commit?', options: timeCommitments },
		{
			question: 'What are your biggest obstacles right now?',
			options: [
				'My tree is already done',
				"I don't know where to start",
				'I just get frustrated',
				'Everyone messes up my tree',
				"I don't have the time right now",
				"I don't have a computer",
				"I'm not tech savvy",
				'I feel more drawn to the living, not the dead',
			],
		},
		{ question: 'Which skillsets do you have?', options: categories },
	]

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

	return (
		<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 border-solid text-center mx-auto mt-10 mb-20">
			{currentQuestionIndex < questions.length ? (
				<>
					<h2 className="text-xl font-semibold mb-4">
						{questions[currentQuestionIndex].question}
					</h2>
					{currentQuestionIndex > 0 && <p>Select all that apply</p>}
					<div className="flex flex-col gap-2">
						{questions[currentQuestionIndex].options.map((option) => (
							<div key={option} className="flex flex-row">
								{filters[currentQuestionIndex]?.includes(option) && (
									<FaRegCircleCheck className="text-2xl my-auto" />
								)}
								<button
									className={`block w-full text-left text-white px-4 py-2 my-1 rounded shadow ${filters[currentQuestionIndex]?.includes(option) ? 'bg-green-500 ml-6' : 'bg-green-700'} hover:bg-green-500`}
									onClick={() => toggleOption(option)}
								>
									{option}
								</button>
							</div>
						))}
					</div>
					<button
						className="mt-4 px-4 py-2 border-green-700 text-green-700 border-solid border-2 rounded hover:bg-green-500 hover:text-white"
						onClick={nextQuestion}
					>
						Next
					</button>
				</>
			) : (
				<div className="flex flex-col space-y-4">
					<h2 className="text-xl font-semibold mb-4">
						You&apos;re ready to get started!
					</h2>
					<p>
						Based on your answers, here are some recommended activities to get
						started. Try one! If you don&apos;t like it, come back and try a
						different one till you find your niche.
					</p>
					<p className="max-w-5xl text-center mx-auto mb-8 text-red-500">
						Only Source Linking is developed so far. The rest are coming soon!
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{beginnerSkills
							.filter(
								(skill) =>
									(!filters[0]?.length ||
										skill.time?.some((t) => filters[0].includes(t))) &&
									(!filters[2]?.length || filters[2].includes(skill.category))
							)
							.map((skill) => (
								<div
									key={skill.name}
									className={`w-full bg-white p-4 rounded-lg shadow-lg border-green-700 border-2 text-center transition ${
										skill.url
											? 'hover:bg-green-700 hover:text-white cursor-pointer'
											: 'cursor-default'
									}`}
									onClick={() => skill.url && router.push(skill.url)}
								>
									<h3 className="font-semibold text-lg">{skill.name}</h3>
									<p>{skill.description}</p>
								</div>
							))}
					</div>
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
// 	questions,
// 	timeCommitment,
// 	obstacles,
// 	skills,
// } from '@/data/startQuestions'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import { FaRegCircleCheck } from 'react-icons/fa6'

// export default function StartQuiz() {
// 	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
// 	const [filters, setFilters] = useState<Record<number, string[]>>({})
// 	const [breadcrumb, setBreadcrumb] = useState<
// 		{ question: string; answers: string[] }[]
// 	>([])
// 	const router = useRouter()

// 	const toggleOption = (option: string) => {
// 		setFilters((prev) => {
// 			const selectedOptions = new Set(prev[currentQuestionIndex] || [])
// 			selectedOptions.has(option)
// 				? selectedOptions.delete(option)
// 				: selectedOptions.add(option)
// 			return { ...prev, [currentQuestionIndex]: Array.from(selectedOptions) }
// 		})
// 	}

// 	const nextQuestion = () => {
// 		setBreadcrumb((prev) => [
// 			...prev,
// 			{
// 				question: questions[currentQuestionIndex].question,
// 				answers: filters[currentQuestionIndex] || [],
// 			},
// 		])
// 		setCurrentQuestionIndex((prev) => prev + 1)
// 	}

// 	const goToBreadcrumb = (index: number) => {
// 		setCurrentQuestionIndex(index)
// 		setBreadcrumb((prev) => prev.slice(0, index))
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

// 	return (
// 		<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 border-solid text-center mx-auto mt-10 mb-20">
// 			{currentQuestionIndex < questions.length ? (
// 				<>
// 					<h2 className="text-xl font-semibold mb-4">
// 						{questions[currentQuestionIndex].question}
// 					</h2>
// 					{currentQuestionIndex > 0 && <p>Select all that apply</p>}
// 					<div className="flex flex-col gap-2">
// 						{questions[currentQuestionIndex].options.map((option) => (
// 							<div key={option} className="flex flex-row">
// 								{filters[currentQuestionIndex]?.includes(option) && (
// 									<FaRegCircleCheck className="text-2xl my-auto" />
// 								)}
// 								<button
// 									className={`block w-full text-left  text-white px-4 py-2 my-1 rounded shadow  ${
// 										filters[currentQuestionIndex]?.includes(option)
// 											? 'bg-green-500 ml-6 '
// 											: 'bg-green-700 '
// 									}hover:bg-green-500`}
// 									onClick={() => toggleOption(option)}
// 								>
// 									{option}
// 								</button>
// 							</div>
// 						))}
// 					</div>
// 					<button
// 						className="mt-4 px-4 py-2 border-green-700 text-green-700 border-solid border-2 rounded hover:bg-green-500 hover:text-white"
// 						onClick={nextQuestion}
// 					>
// 						Next
// 					</button>
// 				</>
// 			) : (
// 				<div className="flex flex-col space-y-4">
// 					<h2 className="text-xl font-semibold mb-4">Recommended Activities</h2>
// 					{filteredActivities.length > 0 ? (
// 						filteredActivities.map((activity) => (
// 							<div
// 								key={activity.name}
// 								className="w-full lg:max-w-2xl bg-white hover:bg-green-700 hover:text-white hover:cursor-pointer p-4 rounded-lg shadow-lg border-green-700 border-2 border-solid text-center mx-auto"
// 								onClick={() => activity.link && router.push(activity.link)}
// 							>
// 								<h3 className="font-semibold text-lg">{activity.name}</h3>
// 								<p>{activity.description}</p>
// 							</div>
// 						))
// 					) : (
// 						<p>No activities match your choices. Please adjust your answers.</p>
// 					)}
// 				</div>
// 			)}

// 			{breadcrumb.length > 0 && (
// 				<div className="mt-6 border-t pt-4">
// 					<h3 className="font-semibold mb-2">
// 						Your Answers to the Previous Questions:
// 					</h3>
// 					<p className="mb-4">Click any to change your answer.</p>
// 					<ol className="space-y-4 text-left list-decimal ml-4">
// 						{breadcrumb.map((crumb, idx) => (
// 							<li key={idx}>
// 								<button
// 									className="text-sky-800 hover:underline text-left align-top"
// 									onClick={() => goToBreadcrumb(idx)}
// 								>
// 									{crumb.question}: <strong>{crumb.answers.join(', ')}</strong>
// 								</button>
// 							</li>
// 						))}
// 					</ol>
// 				</div>
// 			)}
// 		</div>
// 	)
// }
