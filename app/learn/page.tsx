import { H1 } from '@/components/headings'
import CatalogGrid from '@/components/learn/catalogGrid'

export default function LearnPage() {
	return (
		<div>
			<H1>Micro Skill Training Series</H1>
			<p className="max-w-5xl text-center mx-auto mb-8">
				Below is an ever-growing list of micro skills, organized by category, in
				the vast landscape of genealogy. Which ones are your strengths? Which
				are you going to develop next?
			</p>
			<p className="max-w-5xl text-center mx-auto mb-8">
				We&apos;re defining a micro skill as a specific ability that can be
				taught in an hour or less and honed in under 10 hours. How do we eat an
				elephant? One bite at a time of course! Micro skills are like merit
				badges. Rather than stressing over becoming an Eagle Scout overnight,
				identify it&apos;s smaller micro skills. This makes them much more
				attainable. You&apos;ve got this! We&apos;re here to help!
			</p>

			<CatalogGrid />
		</div>
	)
}
