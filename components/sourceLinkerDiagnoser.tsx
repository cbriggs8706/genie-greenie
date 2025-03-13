import React, { useState } from 'react'
import {
	sourceLinkerData,
	QuizNode,
	QuizAnswer,
} from '../data/sourceLinkerDiagnosis'

const getEmbedUrl = (url: string) => {
	const videoIdMatch = url.match(
		/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
	)
	return videoIdMatch
		? `https://www.youtube.com/embed/${videoIdMatch[1]}`
		: null
}

export default function SourceLinkerComponent() {
	const [currentNode, setCurrentNode] = useState<QuizNode>(sourceLinkerData)
	const [history, setHistory] = useState<QuizNode[]>([])
	const [breadcrumb, setBreadcrumb] = useState<
		{ question: string; answer: string }[]
	>([])
	const [currentVideo, setCurrentVideo] = useState<string | null>(null)
	const [videoText, setVideoText] = useState<string | null>(null)

	const handleAnswerClick = (answer: QuizAnswer) => {
		if (answer.next) {
			setHistory((prev) => [...prev, currentNode])
			setBreadcrumb((prev) => [
				...prev,
				{ question: currentNode.question, answer: answer.answer },
			])
			setCurrentNode(answer.next)
			setCurrentVideo(null)
			setVideoText(null)
		} else if (answer.video) {
			setBreadcrumb((prev) => [
				...prev,
				{ question: currentNode.question, answer: answer.answer },
			])
			const embedUrl = getEmbedUrl(answer.video)
			if (embedUrl) {
				setCurrentVideo(embedUrl)
				setVideoText(null)
			} else {
				setCurrentVideo(null)
				setVideoText(answer.video)
			}
		}
	}

	const handleBreadcrumbClick = (index: number) => {
		setCurrentNode(history[index])
		setHistory(history.slice(0, index))
		setBreadcrumb(breadcrumb.slice(0, index))
		setCurrentVideo(null)
		setVideoText(null)
	}

	return (
		<div className="w-full lg:max-w-2xl bg-white p-6 rounded-lg shadow-lg border-green-700 border-2 border-solid text-center mx-auto mt-10 mb-20">
			{breadcrumb.length > 0 && <p>Your responses:</p>}
			<ol className="mb-4 text-sm text-gray-600">
				{breadcrumb.map((crumb, index) => (
					<li key={index} className="">
						<button
							onClick={() => handleBreadcrumbClick(index)}
							className="hover:underline hover:text-green-700 text-left"
						>
							{crumb.question}: <strong>{crumb.answer}</strong>
						</button>
						{/* {index < breadcrumb.length - 1 && <span className="mx-1">/</span>} */}
					</li>
				))}
			</ol>

			{currentVideo ? (
				<div className="mb-4">
					<h3 className="text-lg font-semibold mb-2">Recommended Video:</h3>
					<div className="aspect-w-16 aspect-h-9">
						<iframe
							width="100%"
							height="315"
							src={currentVideo}
							title="Video Recommendation"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
				</div>
			) : videoText ? (
				<div className="mb-4">
					<h3 className="text-lg font-semibold mb-2">Recommendation:</h3>
					<p>Video coming soon...</p>
					<p>{videoText}</p>
				</div>
			) : (
				<>
					<h2 className="text-xl font-semibold mb-4">{currentNode.question}</h2>
					<div className="space-y-2">
						{currentNode.answers.map((answer) => (
							<button
								key={answer.id}
								onClick={() => handleAnswerClick(answer)}
								className="block w-full text-left bg-green-700 text-white px-4 py-2 my-1 rounded shadow hover:bg-green-700"
							>
								{answer.answer}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	)
}
