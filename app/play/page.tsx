import Link from 'next/link'
import { H1, H3 } from '@/components/headings'
import { listPublishedTimelineGames } from '@/lib/timeline-games/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/supabase/is-admin'

const featuredGames = [
	{
		slug: '/the-date-is-right',
		title: 'The Date Is Right',
		description:
			'Use a year slider to guess family-history dates without going over, or open a private realtime room with friends.',
		label: 'Date Guessing Game',
		adminOnlyOnPlayPage: true,
	},
	{
		slug: '/ancestor-feud',
		title: 'Ancestor Feud',
		description:
			'Guess the top occupations, names, and birthplaces hiding inside the sample family tree.',
		label: 'Survey Game',
		adminOnlyOnPlayPage: true,
	},
	{
		slug: '/two-truths-one-lie',
		title: 'Two Truths, One Lie',
		description:
			'Study one ancestor, then pick the single fact that really belongs to an adjacent relative.',
		label: 'Fact Spotting Game',
		adminOnlyOnPlayPage: true,
	},
	{
		slug: '/the-couples-game',
		title: 'The Couples Game',
		description:
			'See one husband-and-wife pair from the sample tree, then reveal answers to Newlywed Game style family-history questions.',
		label: 'Couple Trivia Game',
		adminOnlyOnPlayPage: true,
	},
	{
		slug: '/family-flashcards',
		title: 'Family Flashcards',
		description:
			'Study direct ancestors with a simple flip-card deck using photos, names, and relationships.',
		label: 'Flashcard Study Deck',
		adminOnlyOnPlayPage: true,
	},
] as const

export default async function PlayPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const isAdmin = isAdminUser(user)
	const games = await listPublishedTimelineGames()
	const publicFeaturedGames = featuredGames.filter(
		(game) => !game.adminOnlyOnPlayPage
	)
	const adminFeaturedGames = isAdmin
		? featuredGames.filter((game) => game.adminOnlyOnPlayPage)
		: []

	return (
		<section>
			<H1>Play</H1>
			<p className="mx-auto mb-8 max-w-3xl text-center font-inter text-sky-900">
				Play is the new home for interactive Genie Greenie games. Timeline Game is
				the first one, with more learning games to come.
			</p>

			<div className="grid gap-4 md:grid-cols-2">
				{publicFeaturedGames.map((game) => (
					<Link
						key={game.slug}
						href={game.slug}
						className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
					>
						<p className="font-Young_Serif text-3xl">{game.title}</p>
						<p className="mt-3 font-inter text-sm">{game.description}</p>
						<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
							{game.label}
						</p>
					</Link>
				))}

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

			{adminFeaturedGames.length > 0 ? (
				<div className="mt-12">
					<H3 className="mb-4 text-center text-sky-900">Admin Only</H3>
					<div className="grid gap-4 md:grid-cols-2">
						{adminFeaturedGames.map((game) => (
							<Link
								key={game.slug}
								href={game.slug}
								className="block rounded-lg border-2 border-green-700 bg-white p-6 text-center shadow-lg transition hover:bg-green-700 hover:text-white"
							>
								<p className="font-Young_Serif text-3xl">{game.title}</p>
								<p className="mt-3 font-inter text-sm">{game.description}</p>
								<p className="mt-4 font-inter text-xs uppercase tracking-[0.2em]">
									{game.label}
								</p>
							</Link>
						))}
					</div>
				</div>
			) : null}
		</section>
	)
}
