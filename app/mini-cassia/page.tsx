'use client'

import { H1, H3 } from '@/components/headings'
import LocationQuiz from '@/components/locationQuiz'
import {
	triviaQuestions,
	locations,
	TriviaQuestion,
} from '@/data/locationTrivia'
import Image from 'next/image'

export default function Page() {
	const allQuestions = locations
		.map((location) => {
			const questions = triviaQuestions.filter((q) => q.cityId === location.id)
			return questions.length ? { city: location.name, questions } : null
		})
		.filter(Boolean) as { city: string; questions: TriviaQuestion[] }[]

	return (
		<>
			<H1>Mini-Cassia History Quiz</H1>
			<div className="flex flex-col gap-4">
				{/* <Image
          src="/reverseMe.jpg"
          width={150}
          height={150}
          alt="Cameron Briggs"
          className="mx-auto"
        /> */}
				<p className="text-center font-bold">
					How much do you know about this area?
				</p>
				<LocationQuiz allQuestions={allQuestions} />
			</div>
		</>
	)
}
