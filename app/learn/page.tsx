'use client'

import { H1 } from '@/components/headings'
import TrainingComponent from '@/components/training'
import Link from 'next/link'

const Page = () => {
	return (
		<div>
			<H1>Select a Training Series</H1>
			<p className="max-w-5xl text-center mx-auto">
				Only SourceLinker is currently available. Check back soon for more.
			</p>
			<div className="w-full flex mx-auto justify-center mt-4">
				<button className="border-green-700 border-solid border-2 text-green-700 hover:bg-green-500 hover:text-white p-2">
					<Link href="/learn/source-linker">SourceLinker 101</Link>
				</button>
			</div>
			{/* <TrainingComponent /> */}
		</div>
	)
}

export default Page
