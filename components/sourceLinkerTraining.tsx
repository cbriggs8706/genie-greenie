'use client'

import React, { useMemo, useRef } from 'react'
import { sourceLinkerVideos } from '@/data/sourceLinkerVideos'
import { H2, H3 } from './headings'

const getEmbedUrl = (url: string) => {
	const videoIdMatch = url.match(
		/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
	)
	return videoIdMatch
		? `https://www.youtube.com/embed/${videoIdMatch[1]}`
		: null
}

export default function SourceLinkerTraining() {
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

	const groupedVideos = useMemo(() => {
		return sourceLinkerVideos.reduce((acc, video) => {
			if (!acc[video.skillLevel]) acc[video.skillLevel] = {}
			if (!acc[video.skillLevel][video.subCategory]) {
				acc[video.skillLevel][video.subCategory] = []
			}

			acc[video.skillLevel][video.subCategory].push(video)
			return acc
		}, {} as Record<string, Record<string, typeof sourceLinkerVideos>>)
	}, [])

	const handleNavClick = (skillLevel: string) => {
		sectionRefs.current[skillLevel]?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="p-4">
			<div className="w-full lg:max-w-4xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 text-center mx-auto mb-10">
				<H2 className="mb-4">SourceLinker Training Library</H2>
				<p className="text-sky-900 font-inter text-base">
					Self-paced training videos are available below.
				</p>
			</div>

			<nav className="sticky top-0 bg-white py-4 z-10 text-xs lg:text-sm rounded-lg shadow-sm">
				<div className="flex flex-wrap gap-2 md:gap-4 justify-center">
					{Object.keys(groupedVideos).map((skillLevel) => (
						<button
							key={skillLevel}
							className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-500 transition"
							onClick={() => handleNavClick(skillLevel)}
						>
							{skillLevel}
						</button>
					))}
				</div>
			</nav>

			{Object.entries(groupedVideos).map(([skillLevel, subCats]) => (
				<div
					key={skillLevel}
					ref={(el) => {
						sectionRefs.current[skillLevel] = el
					}}
					className="mb-6 pt-10"
				>
					<H2 className="w-full bg-green-100 py-4">{skillLevel}</H2>
					{Object.entries(subCats).map(([subCategory, videos]) => (
						<div
							key={subCategory}
							className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 text-center mx-auto mt-10 mb-20"
						>
							<H3>{subCategory}</H3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{videos.map((video) => {
									const embedUrl = getEmbedUrl(video.url)
									return (
										<div
											key={video.id}
											className="border rounded-xl shadow-sm overflow-hidden p-2"
										>
											{embedUrl ? (
												<iframe
													className="w-full h-48 rounded"
													src={embedUrl}
													title={video.title}
													allowFullScreen
													loading="lazy"
												/>
											) : (
												<div className="text-red-500">Invalid video URL</div>
											)}
											<div className="mt-2">
												<h4 className="text-md font-semibold">{video.title}</h4>
												<p className="text-sm text-gray-500">
													Length: {video.timestamp}
												</p>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}
