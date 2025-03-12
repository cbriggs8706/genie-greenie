'use client'

import { H1 } from '@/components/headings'
import TrainingComponent from '@/components/training'

const Page = () => {
	return (
		<div>
			<H1>Select a Training Series</H1>
			<p className="max-w-5xl text-center mx-auto">
				Only SourceLinker is currently available. Check back soon for more.
			</p>
			<TrainingComponent />
		</div>
	)
}

export default Page
