'use client'
import { useState } from 'react'
import { games } from '@/data/games'
import { GameEmbed } from '@/components/gameEmbed'
import { H1 } from '@/components/headings'
import { useRouter } from 'next/navigation'

const Page = () => {
	const router = useRouter()
	const [selectedGame, setSelectedGame] = useState<string | null>(null)

	const abbreviationsGames = games.filter(
		(game) => game.category === 'Genealogical Research & Analysis'
	)

	return (
		<div className="text-center">
			<H1>Quizzes</H1>
			<p className="max-w-5xl text-center mx-auto mb-8">
				Below is an ever-growing set of games.
			</p>
			<div
				className="w-full bg-white p-4 rounded-lg shadow-lg border-green-700 border-2 text-center transition hover:bg-green-700 hover:text-white cursor-pointer mb-8"
				onClick={() => router.push('/personality')}
			>
				<h3 className="font-semibold text-lg">Personality Quiz</h3>
				<p className="text-sm">
					Take the Genie Greenie quiz to see what kind of genealogist you are
				</p>
			</div>

			{selectedGame ? (
				<div>
					<GameEmbed url={selectedGame} />
					<div className="flex justify-center mt-6">
						<button
							className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
							onClick={() => setSelectedGame(null)}
						>
							Close Game
						</button>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{abbreviationsGames.map((game, index) => (
						<div
							key={index}
							className="w-full bg-white p-4 rounded-lg shadow-lg border-green-700 border-2 text-center transition hover:bg-green-700 hover:text-white cursor-pointer"
							onClick={() => setSelectedGame(game.url)}
						>
							<h3 className="font-semibold text-lg">{game.title}</h3>
							<p className="text-sm">{game.description}</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Page
