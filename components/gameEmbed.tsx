export const GameEmbed = ({ url }: { url: string }) => {
	return (
		<div className="w-full h-[50vh] flex justify-center items-center">
			<iframe className="w-full h-full" src={url} allowFullScreen></iframe>
		</div>
	)
}
