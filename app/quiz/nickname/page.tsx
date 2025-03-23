'use client'

import { H1 } from '@/components/headings'
import NicknameQuiz from '@/components/nickname/NicknameQuiz'

const Page = () => {
	return (
		<div>
			<H1>Nickname Quiz</H1>
			<p className="max-w-5xl text-center mx-auto mb-4">
				Can you guess these nicknames?
			</p>

			<NicknameQuiz />
		</div>
	)
}

export default Page
