'use client'

import BeginnerQuiz from '@/components/beginnerQuiz'
import { H1 } from '@/components/headings'

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-between p-24">
			<H1>Welcome!</H1>
			<div className="flex flex-wrap w-full gap-4 justify-center">
				<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
					Learn SourceLinker
				</div>
				<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
					Take our Personality Quiz
				</div>
				<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
					Where do I begin?
				</div>
			</div>
		</main>
	)
}
