// NicknameQuiz.tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

export type QuizMode = 'toNicknames' | 'toFormal' | 'mixed'

type AnswerMode = 'free' | 'multipleChoice' | 'trueFalse' | 'oddOneOut'
type PlayMode = 'classic' | 'speed' | 'streak' | 'study' | 'daily'
type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed'
type CenturyFilter = 'Any' | '17' | '18' | '19' | '20' | '21'
type RegionFilter =
	| 'Any'
	| 'American'
	| 'Brazilian'
	| 'Dutch'
	| 'English'
	| 'French'
	| 'German'
	| 'Irish'
	| 'Italian'
	| 'Portuguese'
	| 'Spanish'
	| 'Swedish'

type DifficultySeed = {
	name: string
	difficulty: Exclude<Difficulty, 'mixed'>
}

type QuizRecord = {
	name: string
	nicknames: string[]
	century: number[]
	region: string[]
	difficulty: Exclude<Difficulty, 'mixed'>
}

type QuestionKind = 'free' | 'multipleChoice' | 'trueFalse' | 'oddOneOut'

type QuizQuestion = {
	id: string
	kind: QuestionKind
	prompt: string
	answers: string[]
	options?: string[]
	statement?: string
	correctBoolean?: boolean
	helperText?: string
	placeholder?: string
	hint?: string
}

const maxQuestions = 20
const speedRoundSeconds = 120

const centuryOptions: CenturyFilter[] = ['Any', '17', '18', '19', '20', '21']
const regionOptions: RegionFilter[] = [
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

const seededNames: DifficultySeed[] = [
	{ name: 'Elizabeth', difficulty: 'easy' },
	{ name: 'William', difficulty: 'easy' },
	{ name: 'Katherine', difficulty: 'easy' },
	{ name: 'John', difficulty: 'easy' },
	{ name: 'Robert', difficulty: 'easy' },
	{ name: 'Margaret', difficulty: 'easy' },
	{ name: 'James', difficulty: 'easy' },
	{ name: 'Alexander', difficulty: 'easy' },
	{ name: 'Mary', difficulty: 'medium' },
	{ name: 'Sarah', difficulty: 'medium' },
	{ name: 'Joseph', difficulty: 'medium' },
	{ name: 'Charles', difficulty: 'medium' },
	{ name: 'Henry', difficulty: 'medium' },
	{ name: 'Ann', difficulty: 'medium' },
	{ name: 'Thomas', difficulty: 'medium' },
	{ name: 'Catherine', difficulty: 'medium' },
	{ name: 'Edward', difficulty: 'hard' },
	{ name: 'Harriet', difficulty: 'hard' },
	{ name: 'Rebecca', difficulty: 'hard' },
	{ name: 'Richard', difficulty: 'hard' },
	{ name: 'Frances', difficulty: 'hard' },
	{ name: 'Florence', difficulty: 'hard' },
	{ name: 'Eleanor', difficulty: 'hard' },
	{ name: 'Martha', difficulty: 'hard' },
]

const normalizeAnswer = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z]/g, '')

const collapseNicknameVariant = (value: string) => {
	const normalized = normalizeAnswer(value)

	if (normalized.endsWith('ie')) return `${normalized.slice(0, -2)}y`
	if (normalized.endsWith('ey')) return `${normalized.slice(0, -2)}y`
	if (normalized.endsWith('ee')) return `${normalized.slice(0, -2)}y`

	return normalized
}

const isAcceptedGuess = (guess: string, answers: string[]) => {
	const normalizedGuess = normalizeAnswer(guess)
	const collapsedGuess = collapseNicknameVariant(guess)

	return answers.some((answer) => {
		const normalizedAnswer = normalizeAnswer(answer)
		const collapsedAnswer = collapseNicknameVariant(answer)

		return (
			normalizedAnswer === normalizedGuess ||
			collapsedAnswer === collapsedGuess
		)
	})
}

const titleCase = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

const uniqStrings = (values: string[]) =>
	Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))

const hashString = (value: string) => {
	let hash = 0
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) >>> 0
	}
	return hash
}

const shuffleValues = <T,>(values: T[], seed?: string) => {
	const cloned = [...values]

	if (seed) {
		return cloned.sort((left, right) => {
			const leftHash = hashString(`${seed}-${String(left)}`)
			const rightHash = hashString(`${seed}-${String(right)}`)
			return leftHash - rightHash
		})
	}

	for (let index = cloned.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1))
		;[cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]]
	}

	return cloned
}

const pickOne = <T,>(values: T[], seed?: string) => {
	if (values.length === 0) return null
	if (seed) return values[hashString(seed) % values.length]
	return values[Math.floor(Math.random() * values.length)]
}

const takeDistinct = <T,>(values: T[], count: number, seed?: string) =>
	shuffleValues(values, seed).slice(0, count)

const NicknameQuiz = () => {
	const [promptMode, setPromptMode] = useState<QuizMode>('mixed')
	const [answerMode, setAnswerMode] = useState<AnswerMode>('free')
	const [playMode, setPlayMode] = useState<PlayMode>('classic')
	const [difficulty, setDifficulty] = useState<Difficulty>('mixed')
	const [centuryFilter, setCenturyFilter] = useState<CenturyFilter>('Any')
	const [regionFilter, setRegionFilter] = useState<RegionFilter>('Any')
	const [showHints, setShowHints] = useState(true)
	const [questionNumber, setQuestionNumber] = useState(1)
	const [score, setScore] = useState(0)
	const [currentStreak, setCurrentStreak] = useState(0)
	const [bestStreak, setBestStreak] = useState(0)
	const [timeRemaining, setTimeRemaining] = useState(speedRoundSeconds)
	const [records, setRecords] = useState<QuizRecord[]>([])
	const [recordsLoading, setRecordsLoading] = useState(true)
	const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
	const [userInput, setUserInput] = useState('')
	const [selectedOption, setSelectedOption] = useState<string | null>(null)
	const [feedback, setFeedback] = useState<string | null>(null)
	const [showAnswers, setShowAnswers] = useState(false)
	const [revealedHint, setRevealedHint] = useState<string | null>(null)
	const [incorrectQuestions, setIncorrectQuestions] = useState<
		{ prompt: string; answer: string[]; userGuess: string }[]
	>([])
	const [reviewQueue, setReviewQueue] = useState<QuizQuestion[]>([])

	const progressPercent = (Math.min(questionNumber, maxQuestions) / maxQuestions) * 100
	const isQuizComplete =
		questionNumber > maxQuestions ||
		(playMode === 'speed' && timeRemaining <= 0)

	const dailySeed = useMemo(() => {
		const today = new Date()
		return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
	}, [])

	const filteredRecords = useMemo(() => {
		return records.filter((record) => {
			const difficultyMatch =
				difficulty === 'mixed' || record.difficulty === difficulty
			const centuryMatch =
				centuryFilter === 'Any' ||
				record.century.includes(Number(centuryFilter))
			const regionMatch =
				regionFilter === 'Any' || record.region.includes(regionFilter)

			return difficultyMatch && centuryMatch && regionMatch
		})
	}, [records, difficulty, centuryFilter, regionFilter])

	const resetQuiz = useCallback(() => {
		setQuestionNumber(1)
		setScore(0)
		setCurrentStreak(0)
		setBestStreak(0)
		setTimeRemaining(speedRoundSeconds)
		setCurrentQuestion(null)
		setUserInput('')
		setSelectedOption(null)
		setFeedback(null)
		setShowAnswers(false)
		setRevealedHint(null)
		setIncorrectQuestions([])
		setReviewQueue([])
	}, [])

	useEffect(() => {
		let active = true

		const fetchRecords = async () => {
			setRecordsLoading(true)

			const fetched = await Promise.all(
				seededNames.map(async ({ name, difficulty: level }) => {
					try {
						const response = await fetch(
							`https://nickname-api-er6p.onrender.com/nicknames?name=${encodeURIComponent(name)}`
						)

						if (!response.ok) return null

						const data = await response.json()
						const nicknames = uniqStrings(data.nicknames ?? [])

						if (nicknames.length === 0) return null

						return {
							name: data.name,
							nicknames,
							century: Array.isArray(data.century) ? data.century : [],
							region: Array.isArray(data.region) ? data.region : [],
							difficulty: level,
						} satisfies QuizRecord
					} catch (error) {
						console.error('Failed to preload nickname record:', name, error)
						return null
					}
				})
			)

			if (!active) return

			setRecords(fetched.filter((record): record is QuizRecord => record !== null))
			setRecordsLoading(false)
		}

		void fetchRecords()

		return () => {
			active = false
		}
	}, [])

	useEffect(() => {
		if (playMode !== 'speed' || isQuizComplete || recordsLoading) return

		const timer = window.setInterval(() => {
			setTimeRemaining((current) => Math.max(current - 1, 0))
		}, 1000)

		return () => window.clearInterval(timer)
	}, [playMode, isQuizComplete, recordsLoading])

	const buildQuestion = useCallback(() => {
		const activeRecords = filteredRecords

		if (activeRecords.length < 2) return null

		const seedBase =
			playMode === 'daily'
				? `${dailySeed}-${questionNumber}-${answerMode}-${promptMode}-${difficulty}-${centuryFilter}-${regionFilter}`
				: undefined

		const shouldUseReviewQuestion =
			playMode === 'study' &&
			reviewQueue.length > 0 &&
			questionNumber > 1 &&
			questionNumber % 4 === 0

		if (shouldUseReviewQuestion) {
			const reviewQuestion = reviewQueue[0]
			setReviewQueue((current) => current.slice(1))
			return { ...reviewQuestion, id: `${reviewQuestion.id}-review-${questionNumber}` }
		}

		const effectivePromptMode =
			promptMode === 'mixed'
				? (pickOne<Exclude<QuizMode, 'mixed'>>(
						['toNicknames', 'toFormal'],
						seedBase ? `${seedBase}-prompt-mode` : undefined
				  ) ?? 'toNicknames')
				: promptMode

		const nicknameFamilyCandidates = activeRecords.filter(
			(record) => record.nicknames.length >= 3
		)
		const basePool =
			answerMode === 'oddOneOut' && nicknameFamilyCandidates.length > 0
				? nicknameFamilyCandidates
				: activeRecords

		const baseRecord =
			pickOne(basePool, seedBase ? `${seedBase}-base-record` : undefined) ??
			basePool[0]
		if (!baseRecord) return null

		const distractorRecords = activeRecords.filter(
			(record) => record.name !== baseRecord.name
		)

		switch (answerMode) {
			case 'multipleChoice': {
				if (effectivePromptMode === 'toNicknames') {
					const correctNickname =
						pickOne(
							baseRecord.nicknames,
							seedBase ? `${seedBase}-correct-nickname` : undefined
						) ?? baseRecord.nicknames[0]
					const distractorNicknames = uniqStrings(
						distractorRecords.flatMap((record) => record.nicknames)
					).filter((nickname) => !isAcceptedGuess(nickname, [correctNickname]))

					const options = shuffleValues(
						[
							correctNickname,
							...takeDistinct(
								distractorNicknames,
								3,
								seedBase ? `${seedBase}-nickname-options` : undefined
							),
						],
						seedBase ? `${seedBase}-nickname-option-order` : undefined
					)

					return {
						id: `${baseRecord.name}-multiple-choice-${questionNumber}`,
						kind: 'multipleChoice',
						prompt: `Which nickname belongs to "${baseRecord.name}"?`,
						answers: [correctNickname],
						options,
						helperText: 'Choose the best match.',
					} satisfies QuizQuestion
				}

				const correctName = baseRecord.name
				const correctNickname =
					pickOne(
						baseRecord.nicknames,
						seedBase ? `${seedBase}-formal-nickname` : undefined
					) ?? baseRecord.nicknames[0]
				const distractorNames = distractorRecords.map((record) => record.name)
				const options = shuffleValues(
					[
						correctName,
						...takeDistinct(
							distractorNames,
							3,
							seedBase ? `${seedBase}-formal-options` : undefined
						),
					],
					seedBase ? `${seedBase}-formal-option-order` : undefined
				)

				return {
					id: `${baseRecord.name}-formal-multiple-choice-${questionNumber}`,
					kind: 'multipleChoice',
					prompt: `Which formal name matches the nickname "${correctNickname}"?`,
					answers: [correctName],
					options,
					helperText: 'Choose the best match.',
				} satisfies QuizQuestion
			}

			case 'trueFalse': {
				if (effectivePromptMode === 'toNicknames') {
					const useTrueStatement =
						playMode === 'daily'
							? (hashString(`${seedBase}-truthiness`) & 1) === 0
							: Math.random() < 0.5
					const correctNickname =
						pickOne(
							baseRecord.nicknames,
							seedBase ? `${seedBase}-true-nickname` : undefined
						) ?? baseRecord.nicknames[0]
					const falseNickname =
						pickOne(
							uniqStrings(
								distractorRecords.flatMap((record) => record.nicknames)
							).filter(
								(nickname) => !isAcceptedGuess(nickname, baseRecord.nicknames)
							),
							seedBase ? `${seedBase}-false-nickname` : undefined
						) ?? correctNickname
					const statementNickname = useTrueStatement
						? correctNickname
						: falseNickname

					return {
						id: `${baseRecord.name}-true-false-${questionNumber}`,
						kind: 'trueFalse',
						prompt: `True or false?`,
						statement: `"${statementNickname}" is a common nickname for "${baseRecord.name}".`,
						answers: [useTrueStatement ? 'true' : 'false'],
						correctBoolean: useTrueStatement,
						helperText: 'Tap true or false.',
					} satisfies QuizQuestion
				}

				const useTrueStatement =
					playMode === 'daily'
						? (hashString(`${seedBase}-formal-truthiness`) & 1) === 0
						: Math.random() < 0.5
				const nickname =
					pickOne(baseRecord.nicknames, seedBase ? `${seedBase}-nickname` : undefined) ??
					baseRecord.nicknames[0]
				const falseRecord =
					pickOne(
						distractorRecords,
						seedBase ? `${seedBase}-false-record` : undefined
					) ?? distractorRecords[0]
				const statementName = useTrueStatement
					? baseRecord.name
					: falseRecord?.name ?? baseRecord.name

				return {
					id: `${baseRecord.name}-formal-true-false-${questionNumber}`,
					kind: 'trueFalse',
					prompt: `True or false?`,
					statement: `"${statementName}" is a formal name for the nickname "${nickname}".`,
					answers: [useTrueStatement ? 'true' : 'false'],
					correctBoolean: useTrueStatement,
					helperText: 'Tap true or false.',
				} satisfies QuizQuestion
			}

			case 'oddOneOut': {
				const matchingNicknames = takeDistinct(
					baseRecord.nicknames,
					3,
					seedBase ? `${seedBase}-matching-nicknames` : undefined
				)
				const oddNickname =
					pickOne(
						uniqStrings(
							distractorRecords.flatMap((record) => record.nicknames)
						).filter(
							(nickname) => !isAcceptedGuess(nickname, baseRecord.nicknames)
						),
						seedBase ? `${seedBase}-odd-nickname` : undefined
					) ?? matchingNicknames[0]
				const options = shuffleValues(
					[...matchingNicknames, oddNickname],
					seedBase ? `${seedBase}-odd-option-order` : undefined
				)

				return {
					id: `${baseRecord.name}-odd-one-out-${questionNumber}`,
					kind: 'oddOneOut',
					prompt: `Which nickname does not belong with "${baseRecord.name}"?`,
					answers: [oddNickname],
					options,
					helperText: 'Pick the odd nickname out.',
				} satisfies QuizQuestion
			}

			case 'free':
			default: {
				if (effectivePromptMode === 'toNicknames') {
					return {
						id: `${baseRecord.name}-free-${questionNumber}`,
						kind: 'free',
						prompt: `Name one common nickname for "${baseRecord.name}".`,
						answers: baseRecord.nicknames,
						placeholder: 'Try a nickname like Liz or Betty',
						hint: `Starts with "${titleCase(baseRecord.nicknames[0].charAt(0))}"`,
						helperText: 'One valid nickname is enough.',
					} satisfies QuizQuestion
				}

				const nickname =
					pickOne(baseRecord.nicknames, seedBase ? `${seedBase}-free-nickname` : undefined) ??
					baseRecord.nicknames[0]

				return {
					id: `${baseRecord.name}-formal-free-${questionNumber}`,
					kind: 'free',
					prompt: `What formal name is "${nickname}" a nickname for?`,
					answers: [baseRecord.name],
					placeholder: 'Try a formal name like Elizabeth',
					hint: `Starts with "${titleCase(baseRecord.name.charAt(0))}"`,
					helperText: 'Give the matching formal name.',
				} satisfies QuizQuestion
			}
		}
	}, [
		answerMode,
		centuryFilter,
		dailySeed,
		difficulty,
		filteredRecords,
		playMode,
		promptMode,
		questionNumber,
		regionFilter,
		reviewQueue,
	])

	useEffect(() => {
		if (recordsLoading || isQuizComplete) return

		const timeout = window.setTimeout(() => {
			setCurrentQuestion(buildQuestion())
			setUserInput('')
			setSelectedOption(null)
			setFeedback(null)
			setShowAnswers(false)
			setRevealedHint(null)
		}, 0)

		return () => window.clearTimeout(timeout)
	}, [buildQuestion, isQuizComplete, recordsLoading])

	const answerLabel = useMemo(() => {
		if (!currentQuestion) return ''
		if (currentQuestion.kind === 'trueFalse') {
			return currentQuestion.correctBoolean ? 'True' : 'False'
		}
		return currentQuestion.answers.map(titleCase).join(', ')
	}, [currentQuestion])

	const handleCorrectAnswer = useCallback(() => {
		setFeedback('✅ Correct!')
		setShowAnswers(true)
		setScore((current) => current + 1)
		setCurrentStreak((current) => {
			const next = current + 1
			setBestStreak((best) => Math.max(best, next))
			return next
		})
	}, [])

	const handleWrongAnswer = useCallback(
		(guess: string) => {
			setFeedback('❌ Not quite.')
			setShowAnswers(true)
			setCurrentStreak(0)

			if (currentQuestion) {
				setIncorrectQuestions((current) => [
					...current,
					{
						prompt: currentQuestion.prompt,
						answer: currentQuestion.answers,
						userGuess: guess,
					},
				])

				if (playMode === 'study') {
					setReviewQueue((current) => [...current, currentQuestion])
				}
			}
		},
		[currentQuestion, playMode]
	)

	const handleFreeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!currentQuestion) return

		const guess = userInput.trim()
		if (!guess) return

		if (isAcceptedGuess(guess, currentQuestion.answers)) {
			handleCorrectAnswer()
			return
		}

		handleWrongAnswer(guess)
	}

	const handleOptionSubmit = (guess: string) => {
		if (!currentQuestion || showAnswers) return

		setSelectedOption(guess)

		if (isAcceptedGuess(guess, currentQuestion.answers)) {
			handleCorrectAnswer()
			return
		}

		handleWrongAnswer(guess)
	}

	const handleBooleanSubmit = (value: boolean) => {
		if (!currentQuestion || showAnswers) return

		const guess = value ? 'true' : 'false'
		setSelectedOption(guess)

		if (currentQuestion.correctBoolean === value) {
			handleCorrectAnswer()
			return
		}

		handleWrongAnswer(value ? 'True' : 'False')
	}

	const handleNext = () => {
		setQuestionNumber((current) => current + 1)
	}

	const timeLabel = `${Math.floor(timeRemaining / 60)}:${String(
		timeRemaining % 60
	).padStart(2, '0')}`

	const controlButtonClass = (active: boolean) =>
		`rounded-2xl border-2 px-3 py-2 text-sm font-medium transition md:text-base ${
			active
				? 'border-green-700 bg-green-700 text-white'
				: 'border-green-700 text-sky-900 hover:bg-green-700 hover:text-white'
		}`

	if (recordsLoading) {
		return (
			<LoadingSpinner
				title="Building the nickname garden..."
				description="The quiz is pulling nickname families, metadata, and alternate game styles into one question bank."
				tips={[
					'This quiz can now switch between classic answers, multiple choice, true/false, odd-one-out, streaks, study rounds, and a daily challenge.',
					'Century and region filters only use names whose records include those tags, so some combinations may have a smaller question pool.',
					'If the nickname server was asleep, the initial load takes longer because the browser is preloading a wider set of records.',
				]}
			/>
		)
	}

	return (
		<div className="mx-auto mt-8 w-full max-w-4xl">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="font-Young_Serif text-sm uppercase tracking-[0.2em] text-sky-700">
							Nickname Garden Challenge
						</p>
						<h2 className="mt-2 font-Young_Serif text-3xl text-sky-900 md:text-4xl">
							Multiple ways to play the same nickname data
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-sky-800 md:text-base">
							Classic recall, multiple choice, true or false, odd-one-out,
							streak, speed, study, and a daily seeded challenge all run off the
							same nickname records.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
						<div className="rounded-2xl border-2 border-green-700 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-sky-700">
								Score
							</p>
							<p className="font-Young_Serif text-3xl text-green-700">{score}</p>
						</div>
						<div className="rounded-2xl border-2 border-green-700 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-sky-700">
								Round
							</p>
							<p className="font-Young_Serif text-3xl text-green-700">
								{Math.min(questionNumber, maxQuestions)}/{maxQuestions}
							</p>
						</div>
						<div className="rounded-2xl border-2 border-green-700 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-sky-700">
								Streak
							</p>
							<p className="font-Young_Serif text-3xl text-green-700">
								{currentStreak}
							</p>
						</div>
						<div className="rounded-2xl border-2 border-green-700 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-sky-700">
								{playMode === 'speed' ? 'Time' : 'Best'}
							</p>
							<p className="font-Young_Serif text-3xl text-green-700">
								{playMode === 'speed' ? timeLabel : bestStreak}
							</p>
						</div>
					</div>
				</div>

				<div>
					<div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-sky-700">
						<span>Quiz progress</span>
						<span>{Math.round(progressPercent)}%</span>
					</div>
					<div className="h-3 rounded-full bg-white/70">
						<div
							className="h-3 rounded-full bg-green-700 transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>

				<div className="space-y-4 rounded-3xl border border-white/60 bg-white/35 p-4 backdrop-blur-sm">
					<div>
						<p className="mb-2 text-xs uppercase tracking-[0.2em] text-sky-700">
							Prompt style
						</p>
						<div className="flex flex-wrap gap-2">
							{[
								{ id: 'toNicknames', label: 'Formal → Nicknames' },
								{ id: 'toFormal', label: 'Nickname → Formal' },
								{ id: 'mixed', label: 'Mixed prompt' },
							].map((option) => (
								<button
									key={option.id}
									className={controlButtonClass(promptMode === option.id)}
									onClick={() => {
										setPromptMode(option.id as QuizMode)
										resetQuiz()
									}}
									type="button"
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs uppercase tracking-[0.2em] text-sky-700">
							Answer style
						</p>
						<div className="flex flex-wrap gap-2">
							{[
								{ id: 'free', label: 'Classic' },
								{ id: 'multipleChoice', label: 'Multiple choice' },
								{ id: 'trueFalse', label: 'True / false' },
								{ id: 'oddOneOut', label: 'Odd one out' },
							].map((option) => (
								<button
									key={option.id}
									className={controlButtonClass(answerMode === option.id)}
									onClick={() => {
										setAnswerMode(option.id as AnswerMode)
										resetQuiz()
									}}
									type="button"
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs uppercase tracking-[0.2em] text-sky-700">
							Play style
						</p>
						<div className="flex flex-wrap gap-2">
							{[
								{ id: 'classic', label: 'Classic' },
								{ id: 'speed', label: 'Speed' },
								{ id: 'streak', label: 'Streak' },
								{ id: 'study', label: 'Study' },
								{ id: 'daily', label: 'Daily' },
							].map((option) => (
								<button
									key={option.id}
									className={controlButtonClass(playMode === option.id)}
									onClick={() => {
										setPlayMode(option.id as PlayMode)
										resetQuiz()
									}}
									type="button"
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					<div className="grid gap-3 md:grid-cols-4">
						<label className="flex flex-col gap-2 text-sm text-sky-900">
							<span className="text-xs uppercase tracking-[0.2em] text-sky-700">
								Difficulty
							</span>
							<select
								className="rounded-2xl border-2 border-green-700 bg-white/70 px-3 py-2"
								value={difficulty}
								onChange={(event) => {
									setDifficulty(event.target.value as Difficulty)
									resetQuiz()
								}}
							>
								<option value="mixed">Mixed</option>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
						</label>

						<label className="flex flex-col gap-2 text-sm text-sky-900">
							<span className="text-xs uppercase tracking-[0.2em] text-sky-700">
								Century
							</span>
							<select
								className="rounded-2xl border-2 border-green-700 bg-white/70 px-3 py-2"
								value={centuryFilter}
								onChange={(event) => {
									setCenturyFilter(event.target.value as CenturyFilter)
									resetQuiz()
								}}
							>
								{centuryOptions.map((option) => (
									<option key={option} value={option}>
										{option === 'Any' ? 'Any century' : `${option}th century`}
									</option>
								))}
							</select>
						</label>

						<label className="flex flex-col gap-2 text-sm text-sky-900">
							<span className="text-xs uppercase tracking-[0.2em] text-sky-700">
								Region
							</span>
							<select
								className="rounded-2xl border-2 border-green-700 bg-white/70 px-3 py-2"
								value={regionFilter}
								onChange={(event) => {
									setRegionFilter(event.target.value as RegionFilter)
									resetQuiz()
								}}
							>
								{regionOptions.map((option) => (
									<option key={option} value={option}>
										{option === 'Any' ? 'Any region' : option}
									</option>
								))}
							</select>
						</label>

						<label className="flex items-end gap-3 rounded-2xl border-2 border-green-700 bg-white/50 px-4 py-3 text-sm text-sky-900">
							<input
								type="checkbox"
								checked={showHints}
								onChange={(event) => setShowHints(event.target.checked)}
							/>
							<span>Show hints in classic mode</span>
						</label>
					</div>
				</div>

				{filteredRecords.length === 0 && (
					<div className="rounded-2xl border-2 border-orange bg-orange/10 px-4 py-3 text-sky-900">
						No nickname records matched that difficulty, century, and region
						combination. Try widening the filters.
					</div>
				)}

				{!isQuizComplete && currentQuestion && (
					<>
						<section className="text-center">
							<p className="text-sm uppercase tracking-[0.18em] text-sky-700">
								Current challenge
							</p>
							<p className="mt-3 font-Young_Serif text-3xl text-sky-900 md:text-5xl">
								{currentQuestion.prompt}
							</p>
							{currentQuestion.statement && (
								<p className="mt-4 text-lg text-sky-800 md:text-2xl">
									{currentQuestion.statement}
								</p>
							)}
							{currentQuestion.helperText && (
								<p className="mt-3 text-sm text-sky-700">
									{currentQuestion.helperText}
								</p>
							)}
						</section>

						{currentQuestion.kind === 'free' && (
							<form
								onSubmit={handleFreeSubmit}
								className="flex flex-col gap-3 md:flex-row md:items-stretch"
							>
								<input
									type="text"
									value={userInput}
									onChange={(event) => setUserInput(event.target.value)}
									className="min-h-14 flex-1 rounded-2xl border-2 border-green-700 bg-white/70 px-4 py-3 text-lg text-sky-900 outline-none transition placeholder:text-sky-500 focus:border-sky-800"
									placeholder={currentQuestion.placeholder}
								/>
								<button
									type="submit"
									className="min-h-14 rounded-2xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-500 md:min-w-64"
								>
									Check My Guess
								</button>
							</form>
						)}

						{(currentQuestion.kind === 'multipleChoice' ||
							currentQuestion.kind === 'oddOneOut') && (
							<div className="grid gap-3 md:grid-cols-2">
								{currentQuestion.options?.map((option) => {
									const isSelected = selectedOption === option
									const isCorrect = isAcceptedGuess(option, currentQuestion.answers)

									return (
										<button
											key={option}
											className={`rounded-2xl border-2 px-4 py-4 text-left text-lg transition ${
												showAnswers && isCorrect
													? 'border-green-700 bg-green-700 text-white'
													: showAnswers && isSelected
														? 'border-orange bg-orange/10 text-sky-900'
														: 'border-green-700 bg-white/70 text-sky-900 hover:bg-green-700 hover:text-white'
											}`}
											onClick={() => handleOptionSubmit(option)}
											type="button"
										>
											{option}
										</button>
									)
								})}
							</div>
						)}

						{currentQuestion.kind === 'trueFalse' && (
							<div className="grid gap-3 md:grid-cols-2">
								{[
									{ label: 'True', value: true },
									{ label: 'False', value: false },
								].map((option) => {
									const isSelected =
										selectedOption === option.label.toLowerCase()
									const isCorrect = currentQuestion.correctBoolean === option.value

									return (
										<button
											key={option.label}
											className={`rounded-2xl border-2 px-4 py-4 text-left text-lg transition ${
												showAnswers && isCorrect
													? 'border-green-700 bg-green-700 text-white'
													: showAnswers && isSelected
														? 'border-orange bg-orange/10 text-sky-900'
														: 'border-green-700 bg-white/70 text-sky-900 hover:bg-green-700 hover:text-white'
											}`}
											onClick={() => handleBooleanSubmit(option.value)}
											type="button"
										>
											{option.label}
										</button>
									)
								})}
							</div>
						)}

						{showHints && currentQuestion.kind === 'free' && !showAnswers && (
							<div className="flex flex-wrap items-center gap-3">
								<button
									type="button"
									className="rounded-2xl border-2 border-green-700 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-500 hover:text-white"
									onClick={() => setRevealedHint(currentQuestion.hint ?? null)}
								>
									Show hint
								</button>
								{revealedHint && (
									<p className="text-sm text-sky-800">{revealedHint}</p>
								)}
							</div>
						)}

						{feedback && (
							<div
								className={`rounded-2xl border-2 px-4 py-3 text-sm md:text-base ${
									feedback.includes('Correct')
										? 'border-green-700 bg-green-50/80 text-green-800'
										: 'border-orange bg-orange/10 text-sky-900'
								}`}
							>
								{feedback}
							</div>
						)}

						{showAnswers && (
							<div className="rounded-2xl bg-sky-100/70 p-4 text-sm text-sky-900 md:text-base">
								<strong className="font-Young_Serif text-green-700">
									Accepted answer{currentQuestion.answers.length > 1 ? 's' : ''}:
								</strong>{' '}
								{answerLabel}
							</div>
						)}

						{showAnswers && (
							<div className="flex justify-center md:justify-end">
								<button
									onClick={handleNext}
									className="rounded-2xl border-2 border-green-700 px-5 py-3 font-semibold text-green-700 transition hover:bg-green-500 hover:text-white"
									type="button"
								>
									Next Question
								</button>
							</div>
						)}
					</>
				)}

				{isQuizComplete && (
					<div className="space-y-4">
						<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
							<div>
								<h3 className="font-Young_Serif text-3xl text-sky-900">
									Quiz complete
								</h3>
								<p className="mt-2 text-sky-800">
									You finished with <strong>{score}</strong> out of{' '}
									<strong>{Math.min(questionNumber - 1, maxQuestions)}</strong>.
								</p>
								{playMode === 'speed' && timeRemaining <= 0 && (
									<p className="mt-1 text-sky-800">
										Time expired before all 20 questions were finished.
									</p>
								)}
							</div>
							<button
								type="button"
								className="rounded-2xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
								onClick={resetQuiz}
							>
								Play Again
							</button>
						</div>

						{incorrectQuestions.length > 0 ? (
							<div>
								<h4 className="font-Young_Serif text-2xl text-green-700">
									Review your tricky ones
								</h4>
								<ul className="mt-4 space-y-3 text-sm text-sky-900 md:text-base">
									{incorrectQuestions.map((item, index) => (
										<li
											key={`${item.prompt}-${index}`}
											className="rounded-2xl bg-white/70 p-4 shadow-sm"
										>
											<span className="font-Young_Serif text-lg text-sky-900">
												{item.prompt}
											</span>
											<p className="mt-1">You guessed &quot;{item.userGuess}&quot;.</p>
											<p className="mt-1">
												Accepted answer
												{item.answer.length > 1 ? 's' : ''}:{' '}
												{item.answer.map(titleCase).join(', ')}
											</p>
										</li>
									))}
								</ul>
							</div>
						) : (
							<p className="text-sky-800">Perfect round. Nothing to review.</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default NicknameQuiz
