'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { createClient, supabaseConfigured } from '@/lib/supabase/client'

type Checkpoint = {
	id: string
	kind: string
	title: string
	description: string
	sortOrder: number
	isRequired: boolean
	manualCompletion: boolean
	quizPassPercent: number | null
	resourceUrl: string | null
	durationSeconds: number | null
}

type Section = {
	id: string
	sectionKey: 'learn' | 'practice'
	title: string
	sortOrder: number
	checkpoints: Checkpoint[]
}

type Microskill = {
	id: number
	slug: string
	title: string
	description: string
	currentVersion: number
	versionTitle: string | null
	sections: Section[]
}

type ProgressResponse = {
	progress: {
		requiredCompleted: number
		requiredTotal: number
		percent: number
	}
	certificate: {
		status: 'not_earned' | 'renewal_required' | 'active'
	}
	sections: Array<{
		sectionId: string
		checkpoints: Array<{
			checkpointId: string
			completed: boolean
		}>
	}>
}

function splitTrailingPunctuation(url: string) {
	const match = url.match(/[),.!?:;]+$/)
	if (!match) return { cleanUrl: url, trailing: '' }
	const trailing = match[0]
	return {
		cleanUrl: url.slice(0, -trailing.length),
		trailing,
	}
}

function renderTextWithLinks(text: string) {
	const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
	const parts: ReactNode[] = []
	let lastIndex = 0
	let match: RegExpExecArray | null

	while ((match = urlRegex.exec(text)) !== null) {
		const rawMatch = match[0]
		const start = match.index
		if (start > lastIndex) {
			parts.push(text.slice(lastIndex, start))
		}

		const { cleanUrl, trailing } = splitTrailingPunctuation(rawMatch)
		const href = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
		parts.push(
			<a
				key={`${start}-${cleanUrl}`}
				className="underline text-sky-800 hover:text-sky-900 break-all"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{cleanUrl}
			</a>
		)
		if (trailing) parts.push(trailing)
		lastIndex = start + rawMatch.length
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex))
	}

	return parts.length > 0 ? parts : text
}

export default function MicroskillExperience({ microskill }: { microskill: Microskill }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [progress, setProgress] = useState<ProgressResponse | null>(null)
	const [pendingCheckpointId, setPendingCheckpointId] = useState<string | null>(null)
	const [notice, setNotice] = useState<string | null>(null)
	const [quizScores, setQuizScores] = useState<Record<string, string>>({})
	const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null)

	useEffect(() => {
		if (!supabaseConfigured()) return
		const supabase = createClient()
		void supabase.auth.getUser().then(({ data }) => {
			const loggedIn = Boolean(data.user)
			setIsLoggedIn(loggedIn)
			if (loggedIn) {
				void loadProgress()
			}
		})
	}, [microskill.slug])

	async function loadProgress() {
		const response = await fetch(
			`/api/learn/progress?microskillSlug=${encodeURIComponent(microskill.slug)}`,
			{ cache: 'no-store' }
		)
		if (!response.ok) {
			setProgress(null)
			return
		}
		const data = (await response.json()) as ProgressResponse
		setProgress(data)
	}

	const completedCheckpointIds = useMemo(() => {
		if (!progress) return new Set<string>()
		const ids = progress.sections.flatMap((section) =>
			section.checkpoints.filter((checkpoint) => checkpoint.completed).map((checkpoint) => checkpoint.checkpointId)
		)
		return new Set(ids)
	}, [progress])

	async function markComplete(checkpointId: string) {
		setPendingCheckpointId(checkpointId)
		setNotice(null)
		const response = await fetch(`/api/learn/checkpoints/${checkpointId}/complete`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ microskillId: microskill.id }),
		})
		const payload = (await response.json()) as { error?: string; certificateIssued?: boolean }
		if (!response.ok) {
			setNotice(payload.error ?? 'Unable to save progress.')
			setPendingCheckpointId(null)
			return
		}
		setNotice(payload.certificateIssued ? 'Badge earned or renewed.' : 'Progress saved.')
		await loadProgress()
		setPendingCheckpointId(null)
	}

	async function submitQuiz(checkpoint: Checkpoint) {
		const score = Number(quizScores[checkpoint.id])
		if (Number.isNaN(score) || score < 0 || score > 100) {
			setNotice('Enter a quiz score from 0 to 100.')
			return
		}
		setPendingCheckpointId(checkpoint.id)
		setNotice(null)
		const response = await fetch(`/api/learn/checkpoints/${checkpoint.id}/quiz-attempt`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ microskillId: microskill.id, scorePercent: score }),
		})
		const payload = (await response.json()) as {
			error?: string
			passed?: boolean
			passThreshold?: number
			certificateIssued?: boolean
		}
		if (!response.ok) {
			setNotice(payload.error ?? 'Unable to submit quiz.')
			setPendingCheckpointId(null)
			return
		}
		if (payload.passed) {
			setNotice(payload.certificateIssued ? 'Quiz passed and badge updated.' : 'Quiz passed.')
		} else {
			setNotice(`Quiz did not pass. Minimum is ${payload.passThreshold}%.`)
		}
		await loadProgress()
		setPendingCheckpointId(null)
	}

	function getVideoEmbedUrl(url: string | null) {
		if (!url) return null
		const match = url.match(
			/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
		)
		return match ? `https://www.youtube.com/embed/${match[1]}` : null
	}

	function getDurationLabel(durationSeconds: number | null) {
		if (
			typeof durationSeconds !== 'number' ||
			!Number.isFinite(durationSeconds) ||
			durationSeconds <= 0
		) {
			return 'Open'
		}
		return `${Math.max(1, Math.ceil(durationSeconds / 60))} min`
	}

	return (
		<div className="space-y-6">
			<div className="w-full lg:max-w-4xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 text-center mx-auto">
				<h2 className="font-Young_Serif text-3xl text-sky-900">{microskill.title}</h2>
				<p className="font-inter text-sky-900 mt-2">{microskill.description}</p>
				<p className="font-inter text-sm text-sky-800 mt-2">
					{microskill.versionTitle ? `${microskill.versionTitle} (v${microskill.currentVersion})` : `v${microskill.currentVersion}`}
				</p>
				{isLoggedIn && progress ? (
					<div className="mt-3">
						<div className="h-3 w-full rounded-full bg-sky-200 overflow-hidden border border-sky-300">
							<div
								className="h-full bg-green-700 transition-all duration-300"
								style={{ width: `${progress.progress.percent}%` }}
							/>
						</div>
						<p className="font-inter text-xs text-sky-900 mt-1">
							{progress.progress.percent}% complete
						</p>
					</div>
				) : (
					<p className="font-inter text-sm text-sky-900 mt-2">
						Guest access is open. <Link href="/login" className="underline">Sign in</Link> to track progress and earn badges.
					</p>
				)}
			</div>

			{microskill.sections.map((section) => (
				<div key={section.id} className="w-full lg:max-w-4xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 mx-auto">
					<h3 className="font-Young_Serif text-2xl text-sky-900">{section.title}</h3>
					<div className="space-y-3 mt-4">
						{section.checkpoints.map((checkpoint) => {
							const completed = completedCheckpointIds.has(checkpoint.id)
							const isExpanded = expandedLessonId === checkpoint.id
							const videoEmbedUrl = getVideoEmbedUrl(checkpoint.resourceUrl)
							return (
								<div key={checkpoint.id} className="border-2 border-green-700 rounded-lg p-4">
									<button
										type="button"
										onClick={() =>
											setExpandedLessonId((prev) =>
												prev === checkpoint.id ? null : checkpoint.id
											)
										}
										className="w-full flex items-center justify-between text-left"
									>
										<p className="font-Young_Serif text-xl text-sky-900">{checkpoint.title}</p>
										<div className="flex items-center gap-2">
											{completed ? (
												<span className="bg-green-700 text-white rounded px-2 py-1 font-inter text-xs">
													Completed
												</span>
											) : null}
											<span className="font-inter text-sky-900 text-sm">
												{isExpanded ? 'Hide' : getDurationLabel(checkpoint.durationSeconds)}
											</span>
										</div>
									</button>

									{isExpanded ? (
										<div className="mt-3 border-t border-sky-200 pt-3">
											<p className="font-inter text-sky-800 whitespace-pre-wrap">
												{renderTextWithLinks(checkpoint.description)}
											</p>

											{videoEmbedUrl ? (
												<div className="mt-3 rounded-lg overflow-hidden border-2 border-green-700">
													<iframe
														className="w-full aspect-video"
														src={videoEmbedUrl}
														title={checkpoint.title}
														allowFullScreen
														loading="lazy"
													/>
												</div>
											) : checkpoint.resourceUrl ? (
												<a
													className="font-inter text-sky-800 underline mt-2 inline-block"
													href={checkpoint.resourceUrl}
													target="_blank"
													rel="noreferrer"
												>
													Open lesson resource
												</a>
											) : null}

											<div className="mt-3">
												{completed ? (
													<span className="bg-green-700 text-white rounded px-3 py-2 font-inter inline-block">
														Completed
													</span>
												) : !isLoggedIn ? (
													<span className="font-inter text-sm text-sky-900">
														Sign in to save completion.
													</span>
												) : checkpoint.kind === 'quiz' ? (
													<div className="flex flex-wrap gap-2 items-center">
														<input
															type="number"
															min={0}
															max={100}
															value={quizScores[checkpoint.id] ?? ''}
															onChange={(event) =>
																setQuizScores((prev) => ({
																	...prev,
																	[checkpoint.id]: event.target.value,
																}))
															}
															className="border-green-700 border-2 rounded px-3 py-2 w-28"
															placeholder="Score"
														/>
														<button
															type="button"
															onClick={() => void submitQuiz(checkpoint)}
															disabled={pendingCheckpointId === checkpoint.id}
															className="bg-green-700 text-white rounded hover:bg-green-500 transition px-4 py-2"
														>
															{pendingCheckpointId === checkpoint.id
																? 'Saving...'
																: 'Submit Quiz'}
														</button>
														<p className="font-inter text-sm text-sky-900">
															Pass: {checkpoint.quizPassPercent ?? 80}%
														</p>
													</div>
												) : (
													<button
														type="button"
														onClick={() => void markComplete(checkpoint.id)}
														disabled={
															pendingCheckpointId === checkpoint.id ||
															!checkpoint.manualCompletion
														}
														className="bg-green-700 text-white rounded hover:bg-green-500 transition px-4 py-2 disabled:opacity-60"
													>
														{pendingCheckpointId === checkpoint.id
															? 'Saving...'
															: 'Mark Complete'}
													</button>
												)}
											</div>
										</div>
									) : null}
								</div>
							)
						})}
					</div>
				</div>
			))}

			{notice ? (
				<div className="w-full lg:max-w-4xl mx-auto bg-sky-100 border-2 border-sky-300 rounded-lg p-3 font-inter text-sky-900">
					{notice}
				</div>
			) : null}
		</div>
	)
}
