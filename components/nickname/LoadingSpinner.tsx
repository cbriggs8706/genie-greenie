'use client'

type LoadingSpinnerProps = {
	title?: string
	description?: string
	tips?: string[]
	compact?: boolean
}

const defaultTips = [
	'Many historic nicknames are not obvious. Peggy comes from Margaret, and Polly can come from Mary.',
	'Some questions flip directions. You might be matching a formal name to many nicknames or a nickname back to one formal name.',
	'If the server was asleep, the first round can take longer while it wakes up and gathers fresh question data.',
]

const LoadingSpinner = ({
	title = 'Warming up the question garden...',
	description = 'The nickname server may need a few seconds to wake up and gather the next batch of questions.',
	tips = defaultTips,
	compact = false,
}: LoadingSpinnerProps) => {
	return (
		<div
			className={`mx-auto w-full max-w-2xl rounded-3xl border-2 border-green-700 bg-white/90 text-center shadow-lg ${
				compact ? 'mt-4 p-5' : 'mt-6 p-6 md:p-8'
			}`}
		>
			<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lightyellow">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
			</div>
			<p className="font-Young_Serif text-2xl text-sky-900">{title}</p>
			<p className="mx-auto mt-3 max-w-xl text-sm text-sky-800 md:text-base">
				{description}
			</p>
			<div className="mt-5 rounded-2xl bg-sky-50 p-4 text-left">
				<p className="font-Young_Serif text-lg text-green-700">
					While you wait
				</p>
				<ul className="mt-3 space-y-2 text-sm text-sky-900">
					{tips.map((tip) => (
						<li key={tip} className="rounded-xl bg-white px-3 py-2 shadow-sm">
							{tip}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default LoadingSpinner
