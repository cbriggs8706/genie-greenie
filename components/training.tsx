import React, { useState } from 'react'
import { sourceLinkerData, QuizNode, QuizAnswer } from '../data/sourceLinker'
import {
	activities,
	questions,
	timeCommitment,
	obstacles,
	skills,
} from '@/data/startQuestions'
import { useRouter } from 'next/navigation'

export default function TrainingComponent() {
	const router = useRouter()

	return (
		<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center mx-auto mt-10 mb-20">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* <h2 className="text-xl font-semibold mb-4">Recommended Activities</h2> */}
				{activities.length > 0 ? (
					activities.map((activity) => (
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
		</div>
	)
}
