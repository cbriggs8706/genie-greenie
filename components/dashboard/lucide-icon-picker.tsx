'use client'

import { useMemo, useState } from 'react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { BADGE_ICONS, sanitizeBadgeIconName } from '@/lib/learn/badge-icons'

type LucideIconPickerProps = {
	value: string
	onChange: (value: string) => void
}

export default function LucideIconPicker({ value, onChange }: LucideIconPickerProps) {
	const [query, setQuery] = useState('')
	const [collapsed, setCollapsed] = useState(Boolean(value?.trim()))
	const safeValue = sanitizeBadgeIconName(value)

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return BADGE_ICONS
		return BADGE_ICONS.filter((name) => name.toLowerCase().includes(q))
	}, [query])

	return (
		<div className="rounded-lg border-2 border-green-700 p-3">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<DynamicIcon name={safeValue} className="h-5 w-5 text-sky-900" aria-hidden="true" />
					<p className="font-inter text-sm text-sky-900">
						Selected icon: <span className="font-semibold">{safeValue}</span>
					</p>
				</div>
				<button
					type="button"
					onClick={() => setCollapsed((prev) => !prev)}
					className="rounded border-2 border-green-700 px-3 py-1 font-inter text-xs text-green-700 transition hover:bg-green-500 hover:text-white"
				>
					{collapsed ? 'Change Icon' : 'Collapse'}
				</button>
			</div>
			{collapsed ? null : (
				<>
			<label className="mt-2 block font-inter text-xs text-sky-900">
				Search icons
				<input
					className="mt-1 w-full rounded border-2 border-green-700 p-2"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Type icon name (e.g. Award)"
				/>
			</label>
			<div className="mt-2">
				<p className="font-inter text-xs text-sky-900">
					{filtered.length} icons available
				</p>
			</div>
			<div className="mt-2 grid max-h-56 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2">
				{filtered.map((iconName) => {
					const active = iconName === safeValue
					return (
						<button
							key={iconName}
							type="button"
							onClick={() => {
								onChange(iconName)
								setCollapsed(true)
							}}
							className={`flex items-center gap-2 rounded border-2 p-2 text-left transition ${
								active
									? 'border-green-700 bg-green-700 text-white'
									: 'border-green-700 text-sky-900 hover:bg-green-700 hover:text-white'
							}`}
						>
							<span className="truncate font-inter text-xs">{iconName}</span>
						</button>
					)
				})}
			</div>
				</>
			)}
		</div>
	)
}
