'use client'

import { H1 } from '@/components/headings'
import NicknameQuiz from '@/components/nickname/NicknameQuiz'

const Page = () => {
	return (
		<div className="mx-4 mb-24 mt-4 rounded-xl bg-white/85 p-5 shadow-lg md:mx-24 md:p-8">
			<div className="mx-auto max-w-4xl text-center">
				<p className="font-Young_Serif text-sm uppercase tracking-[0.24em] text-sky-700">
					Quiz Time
				</p>
				<H1 className="mb-5">Nickname Quiz</H1>
				<p className="mx-auto max-w-3xl text-base text-sky-800 md:text-lg">
					Guess classic nickname matches, flip between challenge modes, and
					keep reading while the question server wakes up and plants the next
					round.
				</p>
			</div>
			<NicknameQuiz />
		</div>
	)
}

export default Page
