'use client'

export type MatchType =
	| 'Exact'
	| 'Partial'
	| 'Fuzzy'
	| 'Reverse'
	| 'Smart'
	| 'Soundex'
	| 'Filtered'
	| 'Unknown'

export type NicknameResult = {
	name: string
	nicknames: string[]
	matchType?: MatchType
	matchScore?: number
	century?: number[]
	region?: string[]
}

type ResultCardProps = {
	result: NicknameResult
}

const ResultCard = ({ result }: ResultCardProps) => {
	const {
		name,
		nicknames,
		matchType = 'Unknown',
		matchScore,
		century,
		region,
	} = result

	return (
		<div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl mx-auto border border-gray-200 mb-4">
			<h2 className="text-xl font-bold text-green-700 mb-2">{name}</h2>

			<div className="text-gray-700 mb-2">
				<strong>Nicknames:</strong>{' '}
				{nicknames.length > 0 ? nicknames.join(', ') : 'None found'}
			</div>

			<div className="text-sm text-gray-600 flex flex-wrap gap-4">
				{/* <div>
					<strong>Match Type:</strong> {matchType}
				</div> */}
				{matchScore !== undefined && (
					<div className="w-full mt-2">
						<div className="text-sm text-gray-500">Match Score:</div>
						<div className="w-full bg-gray-200 h-2 rounded-full">
							<div
								className="bg-green-700 h-2 rounded-full transition-all duration-300"
								style={{ width: `${matchScore}%` }}
							></div>
						</div>
						<div className="text-xs text-right text-gray-500 mt-1">
							{matchScore}%
						</div>
					</div>
				)}
				{century && century.length > 0 && (
					<div>
						<strong>Centuries:</strong> {century.join(', ')}
					</div>
				)}

				{region && region.length > 0 && (
					<div>
						<strong>Regions:</strong> {region.join(', ')}
					</div>
				)}
			</div>
		</div>
	)
}

export default ResultCard
