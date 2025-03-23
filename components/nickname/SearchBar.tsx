'use client'

import { useState, useEffect, FormEvent } from 'react'
import { SearchFilters } from './Nickname'

type SearchBarProps = {
	onSearch: (filters: SearchFilters) => void
}

const centuries = ['Any', '17', '18', '19', '20', '21']
const regions = [
	'Any',
	'American',
	'Brazilian',
	'Dutch',
	'English',
	'French',
	'German',
	'Irish',
	'Italian',
	'Portuguese',
	'Spanish',
	'Swedish',
]

const SearchBar = ({ onSearch }: SearchBarProps) => {
	const [input, setInput] = useState('')
	const [century, setCentury] = useState('Any')
	const [region, setRegion] = useState('Any')
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [skipSuggestions, setSkipSuggestions] = useState(false)

	useEffect(() => {
		if (skipSuggestions || input.length < 2) {
			setSuggestions([])
			return
		}

		const fetchSuggestions = async () => {
			try {
				const res = await fetch(
					`https://nickname-api-er6p.onrender.com/autocomplete?q=${encodeURIComponent(
						input
					)}`
				)
				if (res.ok) {
					const data = await res.json()
					setSuggestions(data)
				}
			} catch (err) {
				console.error('Autocomplete error:', err)
				setSuggestions([])
			}
		}

		const timeout = setTimeout(fetchSuggestions, 300)
		return () => clearTimeout(timeout)
	}, [input, skipSuggestions])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const trimmed = input.trim()
		if (trimmed === '' && century === 'Any' && region === 'Any') return

		onSearch({ searchTerm: trimmed, century, region })
		setSkipSuggestions(true)
		setSuggestions([])
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 sm:flex-row sm:flex-wrap items-center justify-center mb-6 relative"
		>
			<div className="w-full sm:w-64 relative">
				<input
					type="text"
					value={input}
					onChange={(e) => {
						setInput(e.target.value)
						setSkipSuggestions(false) // ✅ allow suggestions again
					}}
					placeholder="Enter a name or nickname..."
					className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring w-full"
				/>

				{suggestions.length > 0 && (
					<ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow mt-1 max-h-40 overflow-y-auto">
						{suggestions.map((s, i) => (
							<li
								key={i}
								onClick={() => {
									setInput(s)
									setSkipSuggestions(true) // ✅ hide after click
									setSuggestions([])
									onSearch({ searchTerm: s, century, region })
								}}
								className="px-4 py-2 cursor-pointer hover:bg-gray-100"
							>
								{s}
							</li>
						))}
					</ul>
				)}
			</div>

			<select
				value={century}
				onChange={(e) => setCentury(e.target.value)}
				className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-48"
			>
				{centuries.map((c) => (
					<option key={c} value={c}>
						{c === 'Any' ? 'Any Century' : `${c}th Century`}
					</option>
				))}
			</select>

			<select
				value={region}
				onChange={(e) => setRegion(e.target.value)}
				className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-48"
			>
				{regions.map((r) => (
					<option key={r} value={r}>
						{r === 'Any' ? 'Any Region' : r}
					</option>
				))}
			</select>

			<button
				type="submit"
				className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-500 transition w-full sm:w-auto"
			>
				Search
			</button>
		</form>
	)
}

export default SearchBar
