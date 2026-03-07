import Link from 'next/link'
import { H1 } from '@/components/headings'
import { listPublishedTimelineGames } from '@/lib/timeline-games/server'

export default async function PlayPage() {
	const games = await listPublishedTimelineGames()

	return (
		<section>
			<H1>Play</H1>
			<p className="mx-auto mb-8 max-w-3xl text-center font-inter text-sky-900">
				Play is the new home for interactive Genie Greenie games. Timeline Game is
				the first one, with more learning games to come.
			</p>

			<div className="grid gap-4 md:grid-cols-2">
				<Link
					href="/the-date-is-right"
					className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
				>
					<p className="font-Young_Serif text-3xl">The Date Is Right</p>
					<p className="mt-3 font-inter text-sm">
						Use a year slider to guess family-history dates without going over, or
						open a private realtime room with friends.
					</p>
					<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
						Date Guessing Game
					</p>
				</Link>

				<Link
					href="/ancestor-feud"
					className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
				>
					<p className="font-Young_Serif text-3xl">Ancestor Feud</p>
					<p className="mt-3 font-inter text-sm">
						Guess the top occupations, names, and birthplaces hiding inside the
						sample family tree.
					</p>
					<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
						Survey Game
					</p>
				</Link>

				<Link
					href="/two-truths-one-lie"
					className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
				>
					<p className="font-Young_Serif text-3xl">Two Truths, One Lie</p>
					<p className="mt-3 font-inter text-sm">
						Study one ancestor, then pick the single fact that really belongs to
						an adjacent relative.
					</p>
					<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
						Fact Spotting Game
					</p>
				</Link>

				<Link
					href="/the-couples-game"
					className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
				>
					<p className="font-Young_Serif text-3xl">The Couples Game</p>
					<p className="mt-3 font-inter text-sm">
						See one husband-and-wife pair from the sample tree, then reveal answers
						to Newlywed Game style family-history questions.
					</p>
					<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
						Couple Trivia Game
					</p>
				</Link>

				<Link
					href="/my-family"
					className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
				>
					<p className="font-Young_Serif text-3xl">Family Flashcards</p>
					<p className="mt-3 font-inter text-sm">
						Study direct ancestors with a simple flip-card deck using photos,
						names, and relationships.
					</p>
					<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
						Flashcard Study Deck
					</p>
				</Link>

				{games.length > 0 ? (
					games.map((game) => (
						<Link
							key={game.id}
							href={`/play/${game.slug}`}
							className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
						>
							<p className="font-Young_Serif text-3xl">{game.title}</p>
							<p className="mt-3 font-inter text-sm">
								{game.description || 'Place the events in the correct order.'}
							</p>
							<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
								Timeline Game • {game.eventCount} events
							</p>
						</Link>
					))
				) : (
					<div className="mx-auto w-full max-w-2xl rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg">
						<p className="font-Young_Serif text-2xl text-sky-900">No games yet</p>
						<p className="mt-2 font-inter text-sm text-sky-900">
							Publish a timeline game from the dashboard to make it appear here.
						</p>
					</div>
				)}
			</div>
		</section>
	)
}
