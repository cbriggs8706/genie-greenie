'use client'

import BeginnerQuiz from '@/components/beginnerQuiz'
import { H1, H2, H3 } from '@/components/headings'

export default function Home() {
	return (
		<div className="flex flex-wrap w-full gap-4 justify-center">
			<div>
				<H1>Discover Your Genealogy Journey with Confidence</H1>

				<p>
					Welcome to Genie Greenie, your ultimate guide to mastering genealogy
					from day one. We simplify your entry into family history, removing the
					overwhelm and guesswork. Whether you&apos;re a complete beginner or
					seeking to deepen your existing skills, our interactive training
					platform helps you quickly discover your niche and provides
					personalized pathways to genealogy success.
				</p>
				<H3>Find Your Place in Family History</H3>

				<p>
					At Genie Greenie, we understand that genealogy can feel intimidating.
					Our user-friendly, structured training system breaks down complex
					concepts into clear, actionable steps. With engaging resources,
					quizzes, and hands-on activities, you&apos;ll confidently build
					essential skills, uncover hidden family stories, and make meaningful
					discoveries faster.
				</p>
				<H3>Personalized Learning, Immediate Results</H3>

				<p>
					Don&apos;t waste time guessing where to start. Genie Greenie guides
					you directly to the resources you need, customized to your interests
					and experience level. From understanding historical records to
					utilizing powerful genealogy tools, we&apos;ll help you gain
					proficiency quickly and enjoyably.
				</p>
				<H3>Your Genealogy Success Starts Here</H3>

				<ul className="list-disc ml-8 space-y-4 mb-8">
					<li>
						<strong>Clear Guidance:</strong> Simple, straightforward training
						paths.
					</li>
					<li>
						<strong>Tailored Experience:</strong> Discover your unique
						genealogical strengths.
					</li>
					<li>
						<strong>Interactive Learning:</strong> Quizzes, games, and
						activities that make learning fun.
					</li>
				</ul>

				<p>
					Start your genealogy journey today—without the confusion. Let Genie
					Greenie empower you to explore your family history with clarity and
					confidence.
				</p>
			</div>
			<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
				Learn SourceLinker
			</div>
			<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
				Take our Personality Quiz
			</div>
			<div className="bg-white p-6 rounded-lg shadow-lg border-green-500 border-2 border-solid text-center">
				Where do I begin?
			</div>
		</div>
	)
}
