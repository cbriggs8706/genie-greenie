import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Activity {
	name: string
	description: string
	time: number[]
	obstacles: number[]
	skills: number[]
	category: string
	link: string
}

interface Question {
	question: string
	options: string[]
	multiple: boolean
}

const timeCommitment: Record<number, string> = {
	1: '5min/day',
	2: '2hrs/week',
	3: '1hr/day',
	4: '12+hrs/week',
}

const obstacles: Record<number, string> = {
	1: "My tree's already done",
	2: "I don't know where to start",
	3: 'I just get frustrated',
	4: 'Everyone messes up my tree',
	5: "I don't have the time right now",
	6: "I don't have a computer",
	7: "I'm not tech savvy",
	8: 'I feel more drawn to the living, not the dead',
}

const skills: Record<number, string> = {
	1: 'Research and analysis',
	2: 'Problem solving and deduction',
	3: 'Organization and data management',
	4: 'Communication and collaboration',
}

const activities: Activity[] = [
	{
		name: 'Scan Pictures',
		description: 'Scan pictures by digitizing them',
		time: [1, 2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
		// link: '/scan',
	},
	{
		name: 'Audio',
		description: '',
		time: [2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Video',
		description: '',
		time: [2, 3, 4],
		skills: [3, 4],
		obstacles: [1, 2, 3, 4, 6, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Stories',
		description: '',
		time: [1, 2, 3, 4],
		skills: [2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Documents',
		description: '',
		time: [1, 2, 3, 4],
		skills: [2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Digitizing',
		link: '',
	},
	{
		name: 'Transcription',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 7, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Transcribus',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'OCR',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 4, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Indexing Photos',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'Meta Data',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 4],
		obstacles: [1, 2, 3, 4, 5, 6, 7, 8],
		category: 'Indexing',
		link: '',
	},
	{
		name: 'SourceLinker',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2, 3, 5, 6, 7],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'Green Leaf Hints',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'RecordSeek',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'Source Box',
		description: '',
		time: [2, 3, 4],
		skills: [1, 2],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'RLL projects',
		description: '',
		time: [1, 2, 3, 4],
		skills: [1, 2, 3, 5, 6, 7],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
	{
		name: 'VROC',
		description: '',
		time: [4],
		skills: [1, 2, 3],
		obstacles: [1, 2],
		category: 'Attaching',
		link: '',
	},
]

const questions: Question[] = [
	{
		question: 'What is your current time commitment?',
		options: Object.values(timeCommitment),
		multiple: false,
	},
	{
		question: 'What are your biggest obstacles?',
		options: Object.values(obstacles),
		multiple: true,
	},
	{
		question: 'What are your strongest skills?',
		options: Object.values(skills),
		multiple: true,
	},
]

export default function BeginnerQuiz() {
	const [filters, setFilters] = useState<Record<number, string[]>>({})

	const toggleFilter = (category: number, option: string) => {
		setFilters((prev) => {
			const selectedOptions = new Set(prev[category] || [])
			selectedOptions.has(option)
				? selectedOptions.delete(option)
				: selectedOptions.add(option)
			return { ...prev, [category]: Array.from(selectedOptions) }
		})
	}

	const selectAll = (category: number, options: string[]) => {
		setFilters((prev) => ({ ...prev, [category]: options }))
	}

	const deselectAll = (category: number) => {
		setFilters((prev) => ({ ...prev, [category]: [] }))
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

	const router = useRouter()

	return (
		<div className="max-w-5/6 mx-auto p-4 bg-white rounded-xl shadow-md">
			{/* Filter Questions */}
			{questions.map((q, index) => (
				<div key={index} className="mb-4">
					<h1 className="font-semibold text-2xl">{q.question}</h1>

					{/* Select All & Deselect All Buttons */}
					{/* {questions[index].multiple && ( */}
					<div className="flex gap-2 mt-2">
						<button
							onClick={() => selectAll(index, q.options)}
							className="px-2 py-1 text-xs bg-green-500 text-white rounded-lg font-inter"
						>
							Select All
						</button>
						<button
							onClick={() => deselectAll(index)}
							className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg font-inter"
						>
							Deselect All
						</button>
					</div>
					{/* )
          } */}

					{/* Options */}
					<div className="flex flex-wrap gap-2 mt-2">
						{q.options.map((option) => (
							<button
								key={option}
								onClick={() => toggleFilter(index, option)}
								className={`px-3 py-1 rounded-lg border font-inter ${
									filters[index]?.includes(option)
										? 'bg-blue-500 text-white'
										: 'bg-gray-200'
								}`}
							>
								{option}
							</button>
						))}
					</div>
				</div>
			))}

			{/* Display Activities as Cards */}
			<div>
				<h2 className="text-xl font-semibold mb-3">Recommended Activities:</h2>
				{filteredActivities.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredActivities.map((activity) => (
							<div
								key={activity.name}
								className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition"
								onClick={() => {
									if (activity.link) {
										router.push(activity.link)
									}
								}}
							>
								<h3 className="text-lg font-bold text-center">
									{activity.name}
								</h3>
								<p className="font-semibold text-sm mt-2">
									Category: {activity.category}
								</p>
								<p className="text-gray-700">{activity.description}</p>

								{/* Time Commitment Tags */}
								{/* <div className="mt-2">
									<p className="font-semibold text-sm">Time Commitment:</p>
									<div className="flex flex-wrap gap-1">
										{activity.time.map((t) => (
											<span
												key={t}
												className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs"
											>
												{timeCommitment[t]}
											</span>
										))}
									</div>
								</div> */}

								{/* Obstacles Tags */}
								{/* <div className="mt-2">
									<p className="font-semibold text-sm">Obstacles:</p>
									<div className="flex flex-wrap gap-1">
										{activity.obstacles.map((o) => (
											<span
												key={o}
												className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs"
											>
												{obstacles[Number(o)]}
											</span>
										))}
									</div>
								</div> */}

								{/* Skills Tags */}
								{/* <div className="mt-2">
									<p className="font-semibold text-sm">Skills:</p>
									<div className="flex flex-wrap gap-1">
										{activity.skills.map((s) => (
											<span
												key={s}
												className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
											>
												{skills[Number(s)]}
											</span>
										))}
									</div>
								</div> */}
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">
						No matching activities. Try different choices.
					</p>
				)}
			</div>
		</div>
	)
}
