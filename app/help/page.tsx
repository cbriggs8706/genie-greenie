'use client'

import { H1 } from '@/components/headings'
import Link from 'next/link'

export default function Page() {
	return (
		<>
			<H1>Help Desk</H1>
			<p className="max-w-5xl text-center mx-auto mb-8">
				Find the help you need
			</p>
			<div className="w-full flex mx-auto justify-center mt-4">
				<button className="border-green-700 border-solid border-2 text-green-700 hover:bg-green-500 hover:text-white p-2">
					<Link href="/help/source-linker">SourceLinker Diagnoser</Link>
				</button>
			</div>
		</>
	)
}
