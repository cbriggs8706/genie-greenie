'use client'

import { H1, H3 } from '@/components/headings'
import Image from 'next/image'

export default function Page() {
	return (
		<>
			<H1>About Me</H1>
			<div className="flex flex-col gap-4">
				<Image
					src="/reverseMe.jpg"
					width={150}
					height={150}
					alt="Cameron Briggs"
					className="mx-auto"
				/>
				<p className="text-center font-bold">
					Hi, I&apos;m Cameron Briggs, and welcome to GenieGreenie.com!
				</p>
				<p>
					Once upon a time, I was called as a Family History Leader and quickly
					discovered a frustrating reality—there simply weren&apos;t effective
					training materials available for fellow consultants like myself. The
					resources I encountered were often lengthy, complicated videos and
					dense articles that left us more confused than confident.
				</p>
				<p>
					Determined to fill this gap, I created my own video series on
					SourceLinker. The overwhelmingly positive response made me realize
					just how much my community needed clearer, simpler, and more
					accessible genealogy training.
				</p>
				<p>
					But I soon ran into a new challenge—cost. Although my background as a
					graphic designer helped with creating engaging visuals, the recurring
					expenses for hosting and web development began to pile up. Not one to
					shy away from a challenge, I decided to tackle it head-on: I went back
					to school, transitioned into a career in programming, and took a
					sabbatical to dive deep into web development.
				</p>
				<p>
					Now, I&apos;m back and ready to bring you fresh, straightforward, and
					practical genealogy trainings—all completely free. I&apos;m committed
					to breaking down the barriers in genealogy by providing resources that
					are accessible to everyone, without gatekeeping or exorbitant fees.
				</p>
				<p>
					Together, let&apos;s make family history easier, clearer, and truly
					enjoyable!
				</p>

				<H3>Can I Participate?</H3>

				<p>
					Yes! If you&apos;ve got a great idea for a training series or some
					funding to contribute to the ongoing development and upkeep of this
					website, I&apos;m all ears!
				</p>
				<H3>What&apos;s Coming?</H3>

				<p>
					This semester I&apos;m building the structure of the website. I plan
					on beginning the filming of new training series this summer. I will be
					refilming the SourceLinker 101 series using the new SourceLinker and
					adding a few fun videos. I then plan on tackling a Merging series as
					well as developing out the &apos;Where Do I Start?&apos; series in
					much greater detail.
				</p>
				<H3>Why Free?</H3>

				<p>
					I don&apos;t believe in gatekeeping any aspect of family history. My
					philosophy in life is more aligned with sharing and bartering for a
					better world sentiment. When we put good out into the world,
					we&apos;re bound to get it back 10-fold. Requiring all users to
					pay-to-play is against every fiber of my being. I do accept donations,
					but nothing will ever be solicited and advertising will never be
					introduced.
				</p>
				<H3>What do you do in your free time?</H3>

				<p>
					Oh don&apos;t even get me started! My schedule is always chuck full of
					awesomeness. Right now I&apos;m being drawn toward languages. I
					facilitate a few conversation groups each day in English, Spanish and
					Biblical Hebrew.
				</p>
			</div>
		</>
	)
}
