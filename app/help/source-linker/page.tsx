'use client'

import { H1 } from '@/components/headings'
import SourceLinkerComponent from '@/components/sourceLinkerDiagnoser'

const Page = () => {
	return (
		<div>
			<H1>SourceLinker Diagnoser</H1>
			<p className="max-w-5xl text-center mx-auto">
				Source linking can be tricky. Whatever you&apos;re viewing on the
				screen, we can help! Answer the questions below to find the training
				video that will answer your question and get you on your way!
			</p>
			<p className="max-w-5xl text-center mx-auto mt-4 font-bold">
				Not all avenues have videos. Coming soon!
			</p>
			<SourceLinkerComponent />
		</div>
	)
}

export default Page
