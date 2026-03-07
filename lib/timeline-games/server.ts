import { createAdminClient } from '@/lib/supabase/admin'
import type {
	TimelineGame,
	TimelineGameListItem,
	TimelineGameMutationInput,
} from '@/lib/timeline-games/types'

type TimelineGameRow = {
	id: number
	title: string
	slug: string
	description: string
	source_prompt: string | null
	is_published: boolean
	created_at: string
	updated_at: string
	timeline_game_events?: Array<{
		id: number
		year: number
		event: string
		sort_order: number
	}> | null
}

function mapTimelineGame(row: TimelineGameRow): TimelineGame {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		sourcePrompt: row.source_prompt,
		isPublished: row.is_published,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		events: (row.timeline_game_events ?? [])
			.map((entry) => ({
				id: entry.id,
				year: entry.year,
				event: entry.event,
				sortOrder: entry.sort_order,
			}))
			.sort((left, right) => left.sortOrder - right.sortOrder || left.year - right.year),
	}
}

function mapTimelineGameListItem(row: TimelineGameRow): TimelineGameListItem {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		isPublished: row.is_published,
		updatedAt: row.updated_at,
		eventCount: row.timeline_game_events?.length ?? 0,
	}
}

export async function listTimelineGamesAdmin() {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('timeline_games')
		.select(
			'id,title,slug,description,is_published,updated_at,timeline_game_events(id)'
		)
		.order('updated_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	return ((data ?? []) as TimelineGameRow[]).map(mapTimelineGameListItem)
}

export async function getTimelineGameAdmin(id: number) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('timeline_games')
		.select(
			'id,title,slug,description,source_prompt,is_published,created_at,updated_at,timeline_game_events(id,year,event,sort_order)'
		)
		.eq('id', id)
		.order('sort_order', {
			foreignTable: 'timeline_game_events',
			ascending: true,
		})
		.limit(1)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	if (!data) return null
	return mapTimelineGame(data as TimelineGameRow)
}

export async function listPublishedTimelineGames() {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('timeline_games')
		.select(
			'id,title,slug,description,is_published,updated_at,timeline_game_events(id)'
		)
		.eq('is_published', true)
		.order('updated_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	return ((data ?? []) as TimelineGameRow[]).map(mapTimelineGameListItem)
}

export async function getPublishedTimelineGameBySlug(slug: string) {
	const admin = createAdminClient()
	const { data, error } = await admin
		.from('timeline_games')
		.select(
			'id,title,slug,description,source_prompt,is_published,created_at,updated_at,timeline_game_events(id,year,event,sort_order)'
		)
		.eq('slug', slug)
		.eq('is_published', true)
		.order('sort_order', {
			foreignTable: 'timeline_game_events',
			ascending: true,
		})
		.limit(1)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	if (!data) return null
	return mapTimelineGame(data as TimelineGameRow)
}

export async function createTimelineGame(input: TimelineGameMutationInput) {
	const admin = createAdminClient()
	const now = new Date().toISOString()
	const { data: game, error } = await admin
		.from('timeline_games')
		.insert({
			title: input.title,
			slug: input.slug,
			description: input.description,
			source_prompt: input.sourcePrompt,
			is_published: input.isPublished,
			created_at: now,
			updated_at: now,
		})
		.select('id')
		.single()

	if (error) {
		throw new Error(error.message)
	}

	const { error: eventsError } = await admin.from('timeline_game_events').insert(
		input.events.map((entry, index) => ({
			game_id: game.id,
			year: entry.year,
			event: entry.event,
			sort_order: index + 1,
		}))
	)

	if (eventsError) {
		throw new Error(eventsError.message)
	}

	return getTimelineGameAdmin(game.id)
}

export async function updateTimelineGame(id: number, input: TimelineGameMutationInput) {
	const admin = createAdminClient()
	const { error: updateError } = await admin
		.from('timeline_games')
		.update({
			title: input.title,
			slug: input.slug,
			description: input.description,
			source_prompt: input.sourcePrompt,
			is_published: input.isPublished,
			updated_at: new Date().toISOString(),
		})
		.eq('id', id)

	if (updateError) {
		throw new Error(updateError.message)
	}

	const { error: deleteError } = await admin
		.from('timeline_game_events')
		.delete()
		.eq('game_id', id)

	if (deleteError) {
		throw new Error(deleteError.message)
	}

	const { error: insertError } = await admin.from('timeline_game_events').insert(
		input.events.map((entry, index) => ({
			game_id: id,
			year: entry.year,
			event: entry.event,
			sort_order: index + 1,
		}))
	)

	if (insertError) {
		throw new Error(insertError.message)
	}

	return getTimelineGameAdmin(id)
}
