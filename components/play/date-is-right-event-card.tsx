'use client'

import Image from 'next/image'
import type { IconType } from 'react-icons'
import { GiBabyBottle, GiBigDiamondRing, GiTombstone } from 'react-icons/gi'
import type { DateIsRightEvent, DateIsRightFactKind } from '@/lib/date-is-right/types'

const iconByFactKind: Record<
	DateIsRightFactKind,
	{ label: string; Icon: IconType; className: string }
> = {
	birth: {
		label: 'Birth',
		Icon: GiBabyBottle,
		className: 'border-green-700 bg-lightgreen/30 text-green-800',
	},
	death: {
		label: 'Death',
		Icon: GiTombstone,
		className: 'border-sky-800 bg-sky-100 text-sky-900',
	},
	marriage: {
		label: 'Marriage',
		Icon: GiBigDiamondRing,
		className: 'border-orange bg-lightyellow text-orange',
	},
}

function getInitials(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
}

export function DateIsRightEventCard({ event }: { event: DateIsRightEvent }) {
	const iconConfig = iconByFactKind[event.factKind]
	const Icon = iconConfig.Icon
	const clueText = event.place || ''

	return (
		<div className="rounded-xl border-2 border-green-700 bg-white p-4 shadow-lg">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="mx-auto flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-green-700 bg-sky-100 sm:mx-0">
					{event.portraitUrl ? (
						<Image
							src={event.portraitUrl}
							alt={event.personName}
							width={144}
							height={144}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full flex-col items-center justify-center bg-lightyellow px-3 text-center">
							<span className="font-Young_Serif text-4xl text-sky-900">
								{getInitials(event.personName) || '?'}
							</span>
							<span className="mt-2 font-inter text-xs uppercase tracking-[0.18em] text-sky-700">
								No photo
							</span>
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 text-center sm:text-left">
					<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
						<span
							className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 font-inter text-sm ${iconConfig.className}`}
						>
							<Icon className="h-4 w-4" />
							{iconConfig.label}
						</span>
						<span className="rounded-full bg-sky-100 px-3 py-1 font-inter text-sm text-sky-800">
							{event.relationship}
						</span>
					</div>
					<h2 className="mt-3 font-Young_Serif text-3xl text-sky-900">{event.prompt}</h2>
					{clueText ? (
						<p className="mt-2 font-inter text-sm text-sky-900">{clueText}</p>
					) : null}
				</div>
			</div>
		</div>
	)
}
