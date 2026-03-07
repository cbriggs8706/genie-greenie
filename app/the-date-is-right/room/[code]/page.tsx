import DateIsRightRoom from '@/components/play/date-is-right-room'

export default async function TheDateIsRightRoomPage({
	params,
}: {
	params: Promise<{ code: string }>
}) {
	const { code } = await params

	return <DateIsRightRoom code={code} />
}
