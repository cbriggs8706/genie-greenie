import { notFound } from 'next/navigation'
import MicroskillExperience from '@/components/learn/microskillExperience'
import { getPublicMicroskillBySlug } from '@/lib/learn/public'

export default async function MicroskillPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const microskill = await getPublicMicroskillBySlug(slug)

	if (!microskill) {
		notFound()
	}

	return <MicroskillExperience microskill={microskill} />
}
