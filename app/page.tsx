'use client'
import BeginnerQuiz from '@/components/beginnerQuiz'
import Image from 'next/image'

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h2 className="text-3xl font-semibold">Where Do I Start?</h2>
			<p className="text-lg font-semibold">
				Answer 3 questions and find your niche in genealogy!
			</p>
			<BeginnerQuiz />
		</main>
	)
}
