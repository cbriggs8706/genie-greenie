'use client'

import { H1 } from '@/components/headings'
import Nickname from '@/components/nickname/Nickname'

const Page = () => {
	return (
		<div>
			<H1>Nickname Search</H1>
			<p className="max-w-5xl text-center mx-auto mb-4">
				Perform a nickname search below.
			</p>

			<Nickname />
		</div>
	)
}

export default Page
