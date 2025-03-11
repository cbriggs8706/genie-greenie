'use client'

import { H1 } from '@/components/headings'
import SourceLinkerComponent from '@/components/sourceLinker'

const Page = () => {
	return (
		<div>
			<H1>Find the right SourceLinker video</H1>
			<p className="max-w-5xl text-center mx-auto">
				Source linking can be tricky. Whatever you&apos;re viewing on the
				screen, we can help! Answer the questions below to find the training
				video that will answer your question and get you on your way!
			</p>
			<SourceLinkerComponent />
		</div>
	)
}

export default Page
