import Link from 'next/link'
import { notFound } from 'next/navigation'
import TimelineGamePlayer from '@/components/play/timeline-game'
import { getPublishedTimelineGameBySlug } from '@/lib/timeline-games/server'

export default async function TimelineGamePage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const game = await getPublishedTimelineGameBySlug(slug)

	if (!game) {
		notFound()
	}

	return (
		<section className="mx-auto w-full max-w-4xl">
			<Link
				href="/play"
				className="inline-flex rounded border-2 border-green-700 px-3 py-1.5 font-inter text-sm text-green-700 transition hover:bg-green-500 hover:text-white"
			>
				Back to Play
			</Link>
			<div className="mt-4 rounded-xl border-2 border-green-700 bg-white p-6 shadow-lg">
				<p className="font-inter text-xs uppercase tracking-[0.25em] text-green-700">
					Timeline Game
				</p>
				<h1 className="mt-2 font-Young_Serif text-4xl text-sky-900">{game.title}</h1>
				<p className="mt-3 font-inter text-sm text-sky-900">{game.description}</p>
			</div>
			<div className="mt-4">
				<TimelineGamePlayer game={game} />
			</div>
		</section>
	)
}
