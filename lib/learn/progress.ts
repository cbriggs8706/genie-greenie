import { createHash } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeBadgeIconName } from '@/lib/learn/badge-icons'
import { normalizeLessonsPayload } from '@/lib/learn/types'

function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
}

function hashApiKey(apiKey: string) {
	return createHash('sha256').update(apiKey).digest('hex')
}

async function getMicroskillBySlug(slug: string) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskills')
		.select('id,slug,name,current_version,lessons,is_public')
		.eq('slug', slug)
		.eq('is_public', true)
		.limit(1)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	if (!data) return null
	return {
		...data,
		lessons: normalizeLessonsPayload(data.lessons),
	}
}

async function getMicroskillById(id: number) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskills')
		.select('id,slug,name,current_version,lessons,is_public')
		.eq('id', id)
		.eq('is_public', true)
		.limit(1)
		.maybeSingle()

	if (error) throw new Error(error.message)
	if (!data) return null
	return {
		...data,
		lessons: normalizeLessonsPayload(data.lessons),
	}
}

export async function getProgressForMicroskill(params: {
	userId: string
	slug: string
}) {
	const microskill = await getMicroskillBySlug(params.slug)
	if (!microskill) return null

	const requiredCheckpoints = microskill.lessons.sections.flatMap((section) =>
		section.checkpoints.filter((checkpoint) => checkpoint.isRequired)
	)

	const admin = createAdminClient()
	const { data: progressRows, error: progressError } = await admin
		.from('learner_progress')
		.select('checkpoint_id')
		.eq('user_id', params.userId)
		.eq('microskill_id', microskill.id)

	if (progressError) throw new Error(progressError.message)

	const completedSet = new Set((progressRows ?? []).map((row) => row.checkpoint_id))

	const completedRequired = requiredCheckpoints.filter((checkpoint) =>
		completedSet.has(checkpoint.id)
	).length
	const totalRequired = requiredCheckpoints.length

	const { data: certRows, error: certError } = await admin
		.from('certificates')
		.select('earned_version,earned_at')
		.eq('user_id', params.userId)
		.eq('microskill_id', microskill.id)
		.order('earned_version', { ascending: false })
		.order('earned_at', { ascending: false })
		.limit(1)

	if (certError) throw new Error(certError.message)

	const latestCert = certRows?.[0]
	const certificateStatus = !latestCert
		? 'not_earned'
		: latestCert.earned_version < microskill.current_version
			? 'renewal_required'
			: 'active'

	return {
		microskill: {
			id: microskill.id,
			slug: microskill.slug,
			title: microskill.name,
			currentVersion: microskill.current_version,
		},
		progress: {
			requiredCompleted: completedRequired,
			requiredTotal: totalRequired,
			percent:
				totalRequired === 0 ? 0 : Math.round((completedRequired / totalRequired) * 100),
		},
		certificate: {
			status: certificateStatus,
			earnedAt: latestCert?.earned_at ?? null,
			earnedVersion: latestCert?.earned_version ?? null,
		},
		sections: microskill.lessons.sections.map((section) => ({
			sectionId: section.id,
			sectionKey: section.sectionKey,
			sectionTitle: section.title,
			progress: {
				completed: section.checkpoints.filter((checkpoint) => completedSet.has(checkpoint.id)).length,
				total: section.checkpoints.length,
			},
			checkpoints: section.checkpoints.map((checkpoint) => ({
				checkpointId: checkpoint.id,
				title: checkpoint.title,
				description: checkpoint.description,
				kind: checkpoint.kind,
				isRequired: checkpoint.isRequired,
				manualCompletion: checkpoint.manualCompletion,
				quizPassPercent: checkpoint.quizPassPercent,
				resourceUrl: checkpoint.resourceUrl,
				durationSeconds: checkpoint.durationSeconds,
				completed: completedSet.has(checkpoint.id),
			})),
		})),
	}
}

async function issueCertificateIfEligible(params: {
	userId: string
	email: string
	microskillId: number
}) {
	const microskill = await getMicroskillById(params.microskillId)
	if (!microskill) return null

	const requiredIds = microskill.lessons.sections.flatMap((section) =>
		section.checkpoints.filter((checkpoint) => checkpoint.isRequired).map((checkpoint) => checkpoint.id)
	)
	if (requiredIds.length === 0) return null

	const admin = createAdminClient()
	const { data: progressRows, error: progressError } = await admin
		.from('learner_progress')
		.select('checkpoint_id')
		.eq('user_id', params.userId)
		.eq('microskill_id', params.microskillId)

	if (progressError) throw new Error(progressError.message)

	const completedSet = new Set((progressRows ?? []).map((row) => row.checkpoint_id))
	const allDone = requiredIds.every((id) => completedSet.has(id))
	if (!allDone) return null

	const payload = {
		user_id: params.userId,
		email_normalized: normalizeEmail(params.email),
		microskill_id: params.microskillId,
		earned_version: microskill.current_version,
	}

	const { error: insertError } = await admin.from('certificates').upsert(payload, {
		onConflict: 'user_id,microskill_id,earned_version',
		ignoreDuplicates: true,
	})
	if (insertError) throw new Error(insertError.message)

	return { earnedVersion: microskill.current_version }
}

export async function markCheckpointComplete(params: {
	userId: string
	email: string
	microskillId: number
	checkpointId: string
}) {
	const microskill = await getMicroskillById(params.microskillId)
	if (!microskill) return { error: 'Microskill not found', status: 404 as const }

	const checkpoint = microskill.lessons.sections
		.flatMap((section) => section.checkpoints)
		.find((item) => item.id === params.checkpointId)

	if (!checkpoint) return { error: 'Checkpoint not found', status: 404 as const }
	if (!checkpoint.manualCompletion) {
		return { error: 'Checkpoint requires quiz completion', status: 400 as const }
	}

	const admin = createAdminClient()
	const { error } = await admin.from('learner_progress').upsert(
		{
			user_id: params.userId,
			microskill_id: params.microskillId,
			checkpoint_id: params.checkpointId,
			completion_source: 'manual',
			completed_at: new Date().toISOString(),
		},
		{ onConflict: 'user_id,microskill_id,checkpoint_id' }
	)

	if (error) return { error: error.message, status: 500 as const }

	const certificate = await issueCertificateIfEligible({
		userId: params.userId,
		email: params.email,
		microskillId: params.microskillId,
	})

	return { status: 200 as const, certificate }
}

export async function recordQuizAttempt(params: {
	userId: string
	email: string
	microskillId: number
	checkpointId: string
	scorePercent: number
}) {
	const microskill = await getMicroskillById(params.microskillId)
	if (!microskill) return { error: 'Microskill not found', status: 404 as const }

	const checkpoint = microskill.lessons.sections
		.flatMap((section) => section.checkpoints)
		.find((item) => item.id === params.checkpointId)

	if (!checkpoint) return { error: 'Checkpoint not found', status: 404 as const }
	if (checkpoint.kind !== 'quiz') return { error: 'Checkpoint is not a quiz', status: 400 as const }

	const passThreshold = checkpoint.quizPassPercent ?? 80
	const passed = params.scorePercent >= passThreshold

	const admin = createAdminClient()
	const { error: attemptError } = await admin.from('quiz_attempts').insert({
		user_id: params.userId,
		microskill_id: params.microskillId,
		checkpoint_id: params.checkpointId,
		score_percent: params.scorePercent,
		passed,
	})
	if (attemptError) return { error: attemptError.message, status: 500 as const }

	if (passed) {
		const { error: progressError } = await admin.from('learner_progress').upsert(
			{
				user_id: params.userId,
				microskill_id: params.microskillId,
				checkpoint_id: params.checkpointId,
				completion_source: 'quiz',
				completed_at: new Date().toISOString(),
			},
			{ onConflict: 'user_id,microskill_id,checkpoint_id' }
		)
		if (progressError) return { error: progressError.message, status: 500 as const }
	}

	const certificate = passed
		? await issueCertificateIfEligible({
				userId: params.userId,
				email: params.email,
				microskillId: params.microskillId,
		  })
		: null

	return { status: 200 as const, passed, passThreshold, certificate }
}

export async function authenticatePartnerApiKey(apiKey: string) {
	const admin = createAdminClient()
	const apiKeyHash = hashApiKey(apiKey)
	const { data, error } = await admin
		.from('partner_api_keys')
		.select('id,label')
		.eq('api_key_hash', apiKeyHash)
		.eq('is_active', true)
		.limit(1)
		.maybeSingle()
	if (error || !data) return null

	await admin
		.from('partner_api_keys')
		.update({ last_used_at: new Date().toISOString() })
		.eq('id', data.id)

	return data
}

export async function lookupCertificatesByEmail(email: string, partnerApiKeyId: number | null) {
	const emailNormalized = normalizeEmail(email)
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('certificates')
		.select('earned_version,earned_at,microskills(id,slug,name,badge_icon,current_version)')
		.eq('email_normalized', emailNormalized)
		.order('earned_version', { ascending: false })
		.order('earned_at', { ascending: false })

	if (error) throw new Error(error.message)

	const bySkill = new Map<number, (typeof data)[number]>()
	for (const row of data ?? []) {
		const microskill = Array.isArray(row.microskills) ? row.microskills[0] : row.microskills
		if (!microskill) continue
		if (!bySkill.has(microskill.id)) {
			bySkill.set(microskill.id, row)
		}
	}

	const certificates = Array.from(bySkill.values()).flatMap((row) => {
		const microskill = Array.isArray(row.microskills) ? row.microskills[0] : row.microskills
		if (!microskill) return []
		return {
			microskillSlug: microskill.slug,
			microskillTitle: microskill.name,
			badgeIcon: sanitizeBadgeIconName(microskill.badge_icon),
			dateEarned: row.earned_at,
			earnedVersion: row.earned_version,
			currentVersion: microskill.current_version,
			status:
				row.earned_version < microskill.current_version ? 'renewal_required' : 'active',
		}
	})

	await admin.from('partner_lookup_audit').insert({
		partner_api_key_id: partnerApiKeyId,
		email_normalized: emailNormalized,
		result_count: certificates.length,
	})

	return { emailNormalized, certificates }
}

type PartnerMicroskillStatus = {
	microskillId: number
	microskillSlug: string
	microskillTitle: string
	badgeIcon: string
	currentVersion: number
	earnedVersion: number | null
	dateEarned: string | null
	status: 'not_started' | 'in_progress' | 'active' | 'renewal_required'
	requiredCompleted: number
	requiredTotal: number
	percent: number
}

async function resolveUserIdForEmail(emailNormalized: string) {
	const admin = createAdminClient()
	const pageSize = 200
	let page = 1
	let totalPages = 1

	while (page <= totalPages) {
		const { data, error } = await admin.auth.admin.listUsers({
			page,
			perPage: pageSize,
		})
		if (error) throw new Error(error.message)

		const users = data?.users ?? []
		const match = users.find((user) => normalizeEmail(user.email ?? '') === emailNormalized)
		if (match?.id) return match.id

		const total = typeof data?.total === 'number' ? data.total : users.length
		totalPages = Math.max(1, Math.ceil(total / pageSize))
		page += 1
	}

	return null
}

export async function lookupMicroskillStatusesByEmail(
	email: string,
	partnerApiKeyId: number | null
) {
	const emailNormalized = normalizeEmail(email)
	const admin = createAdminClient()

	const [{ data: microskills, error: microskillsError }, userId] = await Promise.all([
		admin
			.from('microskills')
			.select('id,slug,name,badge_icon,current_version,lessons,is_public')
			.eq('is_public', true)
			.order('category_sort', { ascending: true })
			.order('skill_sort', { ascending: true }),
		resolveUserIdForEmail(emailNormalized),
	])

	if (microskillsError) throw new Error(microskillsError.message)

	const microskillRows = (microskills ?? []).map((row) => ({
		id: row.id,
		slug: row.slug,
		name: row.name,
		badgeIcon: sanitizeBadgeIconName(row.badge_icon),
		currentVersion: row.current_version,
		lessons: normalizeLessonsPayload(row.lessons),
	}))

	const microskillIds = microskillRows.map((row) => row.id)

	const certificateQuery = admin
		.from('certificates')
		.select('earned_version,earned_at,microskill_id,microskills(id,slug,name,current_version)')
		.eq('email_normalized', emailNormalized)
		.in('microskill_id', microskillIds.length > 0 ? microskillIds : [-1])
		.order('earned_version', { ascending: false })
		.order('earned_at', { ascending: false })

	const progressQuery = userId
		? admin
				.from('learner_progress')
				.select('microskill_id,checkpoint_id')
				.eq('user_id', userId)
				.in('microskill_id', microskillIds.length > 0 ? microskillIds : [-1])
		: Promise.resolve({ data: [] as { microskill_id: number; checkpoint_id: string }[], error: null })

	const [{ data: certRows, error: certError }, { data: progressRows, error: progressError }] =
		await Promise.all([certificateQuery, progressQuery])

	if (certError) throw new Error(certError.message)
	if (progressError) throw new Error(progressError.message)

	const certificatesBySkill = new Map<
		number,
		{
			earnedVersion: number
			earnedAt: string
		}
	>()
	for (const row of certRows ?? []) {
		if (certificatesBySkill.has(row.microskill_id)) continue
		certificatesBySkill.set(row.microskill_id, {
			earnedVersion: row.earned_version,
			earnedAt: row.earned_at,
		})
	}

	const completedBySkill = new Map<number, Set<string>>()
	for (const row of progressRows ?? []) {
		if (!completedBySkill.has(row.microskill_id)) {
			completedBySkill.set(row.microskill_id, new Set())
		}
		completedBySkill.get(row.microskill_id)!.add(row.checkpoint_id)
	}

	const statuses: PartnerMicroskillStatus[] = microskillRows.map((row) => {
		const requiredCheckpointIds = row.lessons.sections.flatMap((section) =>
			section.checkpoints.filter((checkpoint) => checkpoint.isRequired).map((checkpoint) => checkpoint.id)
		)
		const requiredTotal = requiredCheckpointIds.length
		const completedSet = completedBySkill.get(row.id) ?? new Set<string>()
		const requiredCompleted = requiredCheckpointIds.filter((id) => completedSet.has(id)).length
		const percent =
			requiredTotal === 0 ? 0 : Math.round((requiredCompleted / requiredTotal) * 100)

		const cert = certificatesBySkill.get(row.id)
		const status = cert
			? cert.earnedVersion < row.currentVersion
				? ('renewal_required' as const)
				: ('active' as const)
			: requiredCompleted > 0
				? ('in_progress' as const)
				: ('not_started' as const)

		return {
			microskillId: row.id,
			microskillSlug: row.slug,
			microskillTitle: row.name,
			badgeIcon: row.badgeIcon,
			currentVersion: row.currentVersion,
			earnedVersion: cert?.earnedVersion ?? null,
			dateEarned: cert?.earnedAt ?? null,
			status,
			requiredCompleted,
			requiredTotal,
			percent,
		}
	})

	const startedCount = statuses.filter((item) => item.status !== 'not_started').length
	await admin.from('partner_lookup_audit').insert({
		partner_api_key_id: partnerApiKeyId,
		email_normalized: emailNormalized,
		result_count: startedCount,
	})

	return { emailNormalized, statuses }
}

export async function getCompletedMicroskillIdsForUser(userId: string) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('certificates')
		.select('microskill_id')
		.eq('user_id', userId)
		.order('earned_at', { ascending: false })

	if (error) throw new Error(error.message)

	const ids = new Set<number>()
	for (const row of data ?? []) {
		if (typeof row.microskill_id === 'number') {
			ids.add(row.microskill_id)
		}
	}

	return Array.from(ids)
}

export type UserMicroskillBadge = {
	microskillId: number
	microskillSlug: string
	microskillTitle: string
	badgeIcon: string
	category: string
	categorySort: number
	dateEarned: string
	earnedVersion: number
	currentVersion: number
	status: 'active' | 'renewal_required'
}

export async function getMicroskillBadgesForUser(userId: string): Promise<UserMicroskillBadge[]> {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('certificates')
		.select('earned_version,earned_at,microskills(id,slug,name,badge_icon,category,category_sort,current_version)')
		.eq('user_id', userId)
		.order('earned_version', { ascending: false })
		.order('earned_at', { ascending: false })

	if (error) throw new Error(error.message)

	const bySkill = new Map<number, (typeof data)[number]>()
	for (const row of data ?? []) {
		const microskill = Array.isArray(row.microskills) ? row.microskills[0] : row.microskills
		if (!microskill) continue
		if (!bySkill.has(microskill.id)) {
			bySkill.set(microskill.id, row)
		}
	}

	return Array.from(bySkill.values())
		.flatMap((row) => {
			const microskill = Array.isArray(row.microskills) ? row.microskills[0] : row.microskills
			if (!microskill) return []
			return {
				microskillId: microskill.id,
				microskillSlug: microskill.slug,
				microskillTitle: microskill.name,
				badgeIcon: sanitizeBadgeIconName(microskill.badge_icon),
				category: microskill.category,
				categorySort:
					typeof microskill.category_sort === 'number' &&
					Number.isFinite(microskill.category_sort)
						? microskill.category_sort
						: 999,
				dateEarned: row.earned_at,
				earnedVersion: row.earned_version,
				currentVersion: microskill.current_version,
				status:
					row.earned_version < microskill.current_version
						? ('renewal_required' as const)
						: ('active' as const),
			}
		})
		.sort(
			(a, b) =>
				a.categorySort - b.categorySort ||
				a.category.localeCompare(b.category) ||
				a.microskillTitle.localeCompare(b.microskillTitle)
		)
}
