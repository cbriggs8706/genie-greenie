'use client'

import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import ResultCard, { NicknameResult } from './ResultCard'
import LoadingSpinner from './LoadingSpinner'

export type SearchFilters = {
	searchTerm: string
	century: string
	region: string
}

const Nickname = () => {
	const [filters, setFilters] = useState<SearchFilters | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [results, setResults] = useState<NicknameResult[]>([])
	const [noNicknamesFound, setNoNicknamesFound] = useState(false)

	const handleSearch = (filters: SearchFilters) => {
		setFilters(filters)
	}

	const isMatch = (filters: SearchFilters, result: NicknameResult): boolean => {
		const centuryMatch =
			filters.century === 'Any' ||
			(Array.isArray(result.century) &&
				result.century.includes(Number(filters.century)))

		const regionMatch =
			filters.region === 'Any' ||
			(Array.isArray(result.region) && result.region.includes(filters.region))

		return centuryMatch && regionMatch
	}

	useEffect(() => {
		const fetchNicknames = async () => {
			if (!filters) return

			const { searchTerm, century, region } = filters
			const trimmedSearch = searchTerm.trim()

			if (trimmedSearch === '' && century === 'Any' && region === 'Any') {
				setError('Please enter a search term or choose a filter.')
				setResults([])
				return
			}

			setLoading(true)
			setError(null)
			setNoNicknamesFound(false)

			try {
				// Use /filter if no name but filters are applied
				if (!trimmedSearch && (century !== 'Any' || region !== 'Any')) {
					const queryParams = new URLSearchParams()
					if (century !== 'Any') queryParams.append('century', century)
					if (region !== 'Any') queryParams.append('region', region)

					const res = await fetch(
						`https://nickname-api-er6p.onrender.com/filter?${queryParams.toString()}`
					)
					const data = await res.json()

					const results: NicknameResult[] = Object.entries(data).map(
						([name, entry]: any) => ({
							name,
							nicknames: entry.nicknames,
							century: entry.century,
							region: entry.region,
							matchType: 'Filtered',
						})
					)

					setResults(results)
					return
				}

				// Use /search for name/nickname/soundex
				const res = await fetch(
					`https://nickname-api-er6p.onrender.com/search?q=${encodeURIComponent(
						trimmedSearch
					)}`
				)
				const data = await res.json()

				// Soundex or direct matches return as array
				if (Array.isArray(data) && data.length > 0) {
					const results: NicknameResult[] = data.map((entry: any) => ({
						name: entry.name,
						nicknames: entry.nicknames,
						century: entry.century,
						region: entry.region,
						matchScore: entry.score,
						matchType: entry.sources?.includes('Soundex') ? 'Soundex' : 'Smart',
					}))

					const filtered = results.filter((r) => isMatch(filters, r))
					setResults(filtered)
					return
				}

				// If exact suggestion, use /nicknames fallback
				if (data.matches?.length === 0 && data.suggestions?.length > 0) {
					const topSuggestion = data.suggestions[0]
					if (
						topSuggestion.similarity === 100 &&
						topSuggestion.name.toLowerCase() === trimmedSearch.toLowerCase()
					) {
						const nickRes = await fetch(
							`https://nickname-api-er6p.onrender.com/nicknames?name=${encodeURIComponent(
								topSuggestion.name
							)}`
						)
						if (nickRes.ok) {
							const nickData = await nickRes.json()
							const result: NicknameResult = {
								name: nickData.name,
								nicknames: nickData.nicknames,
								century: nickData.century,
								region: nickData.region,
								matchType: 'Exact',
							}

							const filtered = isMatch(filters, result) ? [result] : []
							setResults(filtered)
							return
						}
					}

					// Otherwise show suggestions
					setResults([])
					setError(
						`No exact matches. Did you mean: ${data.suggestions
							.map((s: any) => s.name)
							.join(', ')}?`
					)
					return
				}

				// Nothing found
				setNoNicknamesFound(true)
				setResults([])
			} catch (err: any) {
				setError(err.message || 'Failed to fetch')
				setResults([])
			} finally {
				setLoading(false)
			}
		}

		fetchNicknames()
	}, [filters])

	return (
		<div className="flex flex-col items-center">
			<SearchBar onSearch={handleSearch} />

			{loading && <LoadingSpinner />}

			{error && (
				<div className="text-red-600 mt-4">
					{error}
					{error.includes('Did you mean') && (
						<div className="mt-2 text-sm text-gray-600">
							{error
								.split(':')[1]
								.split(',')
								.map((name, idx) => (
									<button
										key={idx}
										onClick={() =>
											handleSearch({
												searchTerm: name.trim(),
												century: filters?.century || 'Any',
												region: filters?.region || 'Any',
											})
										}
										className="inline-block bg-gray-100 hover:bg-gray-200 px-2 py-1 m-1 rounded"
									>
										{name.trim()}
									</button>
								))}
						</div>
					)}
				</div>
			)}

			{results.length > 0 &&
				results.map((result, index) => (
					<ResultCard key={index} result={result} />
				))}

			{!loading &&
				!error &&
				filters &&
				results.length === 0 &&
				noNicknamesFound && (
					<p className="text-gray-600 text-center mt-4">
						No results found for <strong>{filters.searchTerm}</strong>.
					</p>
				)}
		</div>
	)
}

export default Nickname
