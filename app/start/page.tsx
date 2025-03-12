'use client'

import BeginnerQuiz from '@/components/startQuiz'
import { H1 } from '@/components/headings'

export default function Page() {
	return (
		<>
			<H1>Where Do I Start?</H1>
			<p className="max-w-5xl text-center mx-auto mb-8">
				Answer 3 questions and find your niche in genealogy!
			</p>
			<BeginnerQuiz />
		</>
	)
}
