import { createAdminClient } from '@/lib/supabase/admin'
import { validateMarriageConstraints } from '@/lib/family-puzzles/constraints'
import type {
	AvatarStylePreset,
	GeneratedPuzzleDraft,
	PuzzleDifficulty,
	PuzzlePerson,
	RelationshipType,
} from '@/lib/family-puzzles/types'

export type PuzzleEditorPayload = {
	id: number
	title: string
	difficulty: PuzzleDifficulty
	avatarStylePreset: AvatarStylePreset
	status: 'draft' | 'published'
	prefilledSlotKeys: string[]
	people: Array<{
		personCode: string
		fullName: string
		gender: PuzzlePerson['gender']
		age: number
		generation: number
		occupation: string
		hobby: string
		avatarPrompt: string
		avatarUrl: string
		targetSlotKey: string
	}>
	relationships: Array<{
		fromPersonCode: string
		toPersonCode: string
		relationshipType: RelationshipType
	}>
	clues: Array<{
		clueText: string
		clueBand: PuzzleDifficulty
		sortOrder: number
	}>
	slots: Array<{
		slotKey: string
		generation: number
		x: number
		y: number
		isLocked: boolean
		label: string | null
	}>
	slotLinks: Array<{
		fromSlotKey: string
		toSlotKey: string
		linkType: 'spouse' | 'parent_child'
	}>
}

function normalizePuzzle(payload: {
	base: Record<string, unknown>
	people: Array<Record<string, unknown>>
	relationships: Array<Record<string, unknown>>
	clues: Array<Record<string, unknown>>
	slots: Array<Record<string, unknown>>
	slotLinks: Array<Record<string, unknown>>
}): PuzzleEditorPayload {
	return {
		id: Number(payload.base.id),
		title: String(payload.base.title ?? ''),
		difficulty: (payload.base.difficulty ?? 'easy') as PuzzleDifficulty,
		avatarStylePreset: (payload.base.avatar_style_preset ?? 'classic_cartoon') as AvatarStylePreset,
		status: payload.base.status === 'published' ? 'published' : 'draft',
		prefilledSlotKeys: Array.isArray(payload.base.prefilled_slot_keys)
			? payload.base.prefilled_slot_keys.filter((entry): entry is string => typeof entry === 'string')
			: [],
		people: payload.people.map((person) => ({
			personCode: String(person.person_code ?? ''),
			fullName: String(person.full_name ?? ''),
			gender: (person.gender ?? 'female') as PuzzlePerson['gender'],
			age: Number(person.age ?? 30),
			generation: Number(person.generation ?? 0),
			occupation: String(person.occupation ?? ''),
			hobby: String(person.hobby ?? ''),
			avatarPrompt: String(person.avatar_prompt ?? ''),
			avatarUrl: String(person.avatar_url ?? ''),
			targetSlotKey: String(person.target_slot_key ?? ''),
		})),
		relationships: payload.relationships.map((relationship) => ({
			fromPersonCode: String(relationship.from_person_code ?? ''),
			toPersonCode: String(relationship.to_person_code ?? ''),
			relationshipType: (relationship.relationship_type ?? 'parent') as RelationshipType,
		})),
		clues: payload.clues.map((clue) => ({
			clueText: String(clue.clue_text ?? ''),
			clueBand: (clue.clue_band ?? 'easy') as PuzzleDifficulty,
			sortOrder: Number(clue.sort_order ?? 0),
		})),
		slots: payload.slots.map((slot) => ({
			slotKey: String(slot.slot_key ?? ''),
			generation: Number(slot.generation ?? 0),
			x: Number(slot.x ?? 0),
			y: Number(slot.y ?? 0),
			isLocked: Boolean(slot.is_locked),
			label: slot.label == null ? null : String(slot.label),
		})),
		slotLinks: payload.slotLinks.map((slotLink) => ({
			fromSlotKey: String(slotLink.from_slot_key ?? ''),
			toSlotKey: String(slotLink.to_slot_key ?? ''),
			linkType: (slotLink.link_type ?? 'parent_child') as 'spouse' | 'parent_child',
		})),
	}
}

export async function getFamilyPuzzleList() {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('family_puzzles')
		.select('id,title,difficulty,avatar_style_preset,status,updated_at,created_at')
		.order('updated_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	return (data ?? []).map((entry) => ({
		id: Number(entry.id),
		title: String(entry.title),
		difficulty: entry.difficulty as PuzzleDifficulty,
		avatarStylePreset: (entry.avatar_style_preset ?? 'classic_cartoon') as AvatarStylePreset,
		status: entry.status as 'draft' | 'published',
		updatedAt: String(entry.updated_at ?? ''),
		createdAt: String(entry.created_at ?? ''),
	}))
}

export async function getFamilyPuzzleById(id: number): Promise<PuzzleEditorPayload | null> {
	const admin = createAdminClient()
	const { data: base, error } = await admin
		.from('family_puzzles')
		.select('*')
		.eq('id', id)
		.limit(1)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}
	if (!base) {
		return null
	}

	const [peopleResult, relationshipsResult, cluesResult, slotsResult, slotLinksResult] =
		await Promise.all([
			admin
				.from('family_puzzle_people')
				.select('*')
				.eq('puzzle_id', id)
				.order('sort_order', { ascending: true }),
			admin
				.from('family_puzzle_relationships')
				.select('*')
				.eq('puzzle_id', id)
				.order('sort_order', { ascending: true }),
			admin
				.from('family_puzzle_clues')
				.select('*')
				.eq('puzzle_id', id)
				.order('sort_order', { ascending: true }),
			admin
				.from('family_puzzle_slots')
				.select('*')
				.eq('puzzle_id', id)
				.order('sort_order', { ascending: true }),
			admin
				.from('family_puzzle_slot_links')
				.select('*')
				.eq('puzzle_id', id)
				.order('sort_order', { ascending: true }),
		])

	if (peopleResult.error) throw new Error(peopleResult.error.message)
	if (relationshipsResult.error) throw new Error(relationshipsResult.error.message)
	if (cluesResult.error) throw new Error(cluesResult.error.message)
	if (slotsResult.error) throw new Error(slotsResult.error.message)
	if (slotLinksResult.error) throw new Error(slotLinksResult.error.message)

	return normalizePuzzle({
		base,
		people: (peopleResult.data ?? []) as Array<Record<string, unknown>>,
		relationships: (relationshipsResult.data ?? []) as Array<Record<string, unknown>>,
		clues: (cluesResult.data ?? []) as Array<Record<string, unknown>>,
		slots: (slotsResult.data ?? []) as Array<Record<string, unknown>>,
		slotLinks: (slotLinksResult.data ?? []) as Array<Record<string, unknown>>,
	})
}

export async function saveFamilyPuzzle(input: PuzzleEditorPayload) {
	const validation = validateMarriageConstraints({
		people: input.people,
		relationships: input.relationships,
	})
	if (!validation.ok) {
		throw new Error(validation.errors.join(' '))
	}

	const admin = createAdminClient()
	const timestamp = new Date().toISOString()

	const { error: updateError } = await admin
		.from('family_puzzles')
		.update({
			title: input.title,
			difficulty: input.difficulty,
			avatar_style_preset: input.avatarStylePreset,
			status: input.status,
			prefilled_slot_keys: input.prefilledSlotKeys,
			updated_at: timestamp,
		})
		.eq('id', input.id)

	if (updateError) {
		throw new Error(updateError.message)
	}

	await Promise.all([
		admin.from('family_puzzle_people').delete().eq('puzzle_id', input.id),
		admin.from('family_puzzle_relationships').delete().eq('puzzle_id', input.id),
		admin.from('family_puzzle_clues').delete().eq('puzzle_id', input.id),
		admin.from('family_puzzle_slots').delete().eq('puzzle_id', input.id),
		admin.from('family_puzzle_slot_links').delete().eq('puzzle_id', input.id),
	])

	const peopleRows = input.people.map((person, index) => ({
		puzzle_id: input.id,
		person_code: person.personCode,
		full_name: person.fullName,
		gender: person.gender,
		age: person.age,
		generation: person.generation,
		occupation: person.occupation,
		hobby: person.hobby,
		avatar_prompt: person.avatarPrompt,
		avatar_url: person.avatarUrl,
		target_slot_key: person.targetSlotKey,
		sort_order: index,
		updated_at: timestamp,
	}))
	if (peopleRows.length > 0) {
		const { error } = await admin.from('family_puzzle_people').insert(peopleRows)
		if (error) throw new Error(error.message)
	}

	const relationshipRows = input.relationships.map((relationship, index) => ({
		puzzle_id: input.id,
		from_person_code: relationship.fromPersonCode,
		to_person_code: relationship.toPersonCode,
		relationship_type: relationship.relationshipType,
		sort_order: index,
		updated_at: timestamp,
	}))
	if (relationshipRows.length > 0) {
		const { error } = await admin.from('family_puzzle_relationships').insert(relationshipRows)
		if (error) throw new Error(error.message)
	}

	const clueRows = input.clues.map((clue, index) => ({
		puzzle_id: input.id,
		clue_text: clue.clueText,
		clue_band: clue.clueBand,
		sort_order: Number.isFinite(clue.sortOrder) ? clue.sortOrder : index,
		updated_at: timestamp,
	}))
	if (clueRows.length > 0) {
		const { error } = await admin.from('family_puzzle_clues').insert(clueRows)
		if (error) throw new Error(error.message)
	}

	const slotRows = input.slots.map((slot, index) => ({
		puzzle_id: input.id,
		slot_key: slot.slotKey,
		generation: slot.generation,
		x: slot.x,
		y: slot.y,
		is_locked: slot.isLocked,
		label: slot.label,
		sort_order: index,
		updated_at: timestamp,
	}))
	if (slotRows.length > 0) {
		const { error } = await admin.from('family_puzzle_slots').insert(slotRows)
		if (error) throw new Error(error.message)
	}

	const slotByPersonCode = new Map(
		input.people.map((person) => [person.personCode, person.targetSlotKey])
	)
	const computedSlotLinks: PuzzleEditorPayload['slotLinks'] = []
	const linkKeys = new Set<string>()
	for (const relationship of input.relationships) {
		const fromSlot = slotByPersonCode.get(relationship.fromPersonCode)
		const toSlot = slotByPersonCode.get(relationship.toPersonCode)
		if (!fromSlot || !toSlot) continue
		if (
			relationship.relationshipType === 'spouse' ||
			relationship.relationshipType === 'divorced_spouse'
		) {
			const [left, right] = [fromSlot, toSlot].sort()
			const key = `spouse:${left}:${right}`
			if (linkKeys.has(key)) continue
			linkKeys.add(key)
			computedSlotLinks.push({
				fromSlotKey: left,
				toSlotKey: right,
				linkType: 'spouse',
			})
		}
		if (relationship.relationshipType === 'parent') {
			const key = `parent_child:${fromSlot}:${toSlot}`
			if (linkKeys.has(key)) continue
			linkKeys.add(key)
			computedSlotLinks.push({
				fromSlotKey: fromSlot,
				toSlotKey: toSlot,
				linkType: 'parent_child',
			})
		}
	}

	const slotLinkRows = computedSlotLinks.map((slotLink, index) => ({
		puzzle_id: input.id,
		from_slot_key: slotLink.fromSlotKey,
		to_slot_key: slotLink.toSlotKey,
		link_type: slotLink.linkType,
		sort_order: index,
		updated_at: timestamp,
	}))
	if (slotLinkRows.length > 0) {
		const { error } = await admin.from('family_puzzle_slot_links').insert(slotLinkRows)
		if (error) throw new Error(error.message)
	}
}

export async function createFamilyPuzzleFromDraft(
	draft: GeneratedPuzzleDraft,
	createdBy: string | null
) {
	const admin = createAdminClient()
	const now = new Date().toISOString()
	const { data, error } = await admin
		.from('family_puzzles')
		.insert({
			title: draft.title,
			difficulty: draft.difficulty,
			avatar_style_preset: draft.avatarStylePreset,
			status: 'draft',
			prefilled_slot_keys: draft.prefilledSlotKeys,
			created_by: createdBy,
			updated_at: now,
		})
		.select('id')
		.limit(1)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	const id = Number(data.id)
	await saveFamilyPuzzle({
		id,
		title: draft.title,
		difficulty: draft.difficulty,
		avatarStylePreset: draft.avatarStylePreset,
		status: 'draft',
		prefilledSlotKeys: draft.prefilledSlotKeys,
		people: draft.people,
		relationships: draft.relationships,
		clues: draft.clues,
		slots: draft.slots,
		slotLinks: draft.slotLinks,
	})

	return id
}
