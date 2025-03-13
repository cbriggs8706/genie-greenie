'use client'

import { H1 } from '@/components/headings'
import SourceLinkerTraining from '@/components/sourceLinkerTraining'

const Page = () => {
	return (
		<div>
			<H1>Source Linker 101</H1>
			<p className="max-w-5xl text-center mx-auto mb-4">
				FamilySearch uses a tool called SourceLinker to attach indexed records
				to individuals and families in the tree. This process of attaching is
				crucial to tree integrity by collecting all of the documents to support
				the data points of persons in the tree.
			</p>
			<p className="max-w-5xl text-center mx-auto">
				These videos are best viewed in order to train from the beginning. If
				you&apos;re already familiar with how to manuever SourceLinker but need
				help troubleshooting a specific scenario, click here for the{' '}
				<button className="py-2 px-2 border-green-700 border-solid border-2 text-green-700 hover:bg-green-500 hover:text-white rounded-sm">
					<a href="/help/source-linker">SourceLinker Diagnoser</a>
				</button>
			</p>
			<SourceLinkerTraining />
		</div>
	)
}

export default Page
