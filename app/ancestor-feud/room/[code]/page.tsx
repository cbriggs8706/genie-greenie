import AncestorFeudRoom from '@/components/play/ancestor-feud-room'

export default async function AncestorFeudRoomPage({
	params,
}: {
	params: Promise<{ code: string }>
}) {
	const { code } = await params

	return <AncestorFeudRoom code={code} />
}
