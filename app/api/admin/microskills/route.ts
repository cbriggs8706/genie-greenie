import { NextResponse } from 'next/server'
import { normalizeLessonsPayload } from '@/lib/learn/types'
import { DEFAULT_BADGE_ICON, sanitizeBadgeIconName } from '@/lib/learn/badge-icons'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user || !isAdminUser(user)) {
		return null
	}

	return user
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function getSectionsSnapshot(lessons: unknown) {
	return normalizeLessonsPayload(lessons).sections
}

export async function GET(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const url = new URL(request.url)
	const id = url.searchParams.get('id')
	const admin = createAdminClient()

	if (id) {
		const { data, error } = await admin
			.from('microskills')
			.select('*')
			.eq('id', Number(id))
			.limit(1)
			.maybeSingle()

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}
		if (!data) {
			return NextResponse.json({ error: 'Microskill not found' }, { status: 404 })
		}

		return NextResponse.json({
			microskill: {
				...data,
				lessons: normalizeLessonsPayload(data.lessons),
			},
		})
	}

	const { data, error } = await admin
		.from('microskills')
		.select(
			'id,name,slug,category,skill_level,description,url,current_version,is_public,updated_at,category_sort,skill_sort,badge_icon'
		)
		.order('skill_sort', { ascending: true })

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	const { data: categoryRows } = await admin
		.from('microskill_categories')
		.select('name,sort_order')
		.order('sort_order', { ascending: true })

	const categorySortMap = new Map<string, number>()
	for (const category of categoryRows ?? []) {
		categorySortMap.set(category.name.toLowerCase(), category.sort_order)
	}

	const microskills = (data ?? [])
		.map((row) => ({
			...row,
			category_sort: categorySortMap.get(row.category.toLowerCase()) ?? row.category_sort,
		}))
		.sort(
			(a, b) =>
				a.category_sort - b.category_sort ||
				a.skill_sort - b.skill_sort ||
				a.name.localeCompare(b.name)
		)

	return NextResponse.json({ microskills })
}

export async function PATCH(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as
		| {
				id?: number
				name?: string
				slug?: string
				category?: string
				category_sort?: number
				skill_level?: string
				skill_sort?: number
				description?: string
				url?: string
				current_version?: number
				is_public?: boolean
				badge_icon?: string
				lessons?: unknown
		  }
		| null

	if (!body || typeof body.id !== 'number') {
		return NextResponse.json({ error: 'id is required' }, { status: 400 })
	}

	const updates: Record<string, unknown> = {
		updated_at: new Date().toISOString(),
	}

	if (typeof body.name === 'string') updates.name = body.name
	if (typeof body.slug === 'string') updates.slug = body.slug
	const nextCategory =
		typeof body.category === 'string' ? body.category.trim() : undefined
	if (nextCategory) updates.category = nextCategory
	if (typeof body.category_sort === 'number' && Number.isFinite(body.category_sort)) {
		updates.category_sort = body.category_sort
	}
	if (typeof body.skill_level === 'string') updates.skill_level = body.skill_level
	if (typeof body.skill_sort === 'number' && Number.isFinite(body.skill_sort)) {
		updates.skill_sort = body.skill_sort
	}
	if (typeof body.description === 'string') updates.description = body.description
	if (typeof body.url === 'string') updates.url = body.url
	if (typeof body.is_public === 'boolean') updates.is_public = body.is_public
	if (typeof body.badge_icon === 'string') {
		updates.badge_icon = sanitizeBadgeIconName(body.badge_icon)
	}

	const admin = createAdminClient()

	let existingVersion: number | null = null
	if (body.lessons !== undefined || typeof body.current_version === 'number') {
		const { data: existingRow, error: existingError } = await admin
			.from('microskills')
			.select('current_version,lessons')
			.eq('id', body.id)
			.limit(1)
			.maybeSingle()

		if (existingError) {
			return NextResponse.json({ error: existingError.message }, { status: 500 })
		}
		if (!existingRow) {
			return NextResponse.json({ error: 'Microskill not found' }, { status: 404 })
		}

		existingVersion = existingRow.current_version

		if (body.lessons !== undefined) {
			const normalizedLessons = normalizeLessonsPayload(body.lessons)
			updates.lessons = normalizedLessons
			const existingSections = getSectionsSnapshot(existingRow.lessons)
			const nextSections = normalizedLessons.sections
			const sectionsChanged =
				JSON.stringify(existingSections) !== JSON.stringify(nextSections)
			if (sectionsChanged) {
				updates.current_version = existingRow.current_version + 1
			}
		}
	}

	if (
		typeof body.current_version === 'number' &&
		updates.current_version === undefined &&
		existingVersion !== null
	) {
		updates.current_version = body.current_version
	}

	if (nextCategory && updates.category_sort === undefined) {
		const { data: categoryRow } = await admin
			.from('microskill_categories')
			.select('sort_order')
			.eq('name', nextCategory)
			.limit(1)
			.maybeSingle()
		if (categoryRow) {
			updates.category_sort = categoryRow.sort_order
		}
	}

	const { data: updatedRow, error } = await admin
		.from('microskills')
		.update(updates)
		.eq('id', body.id)
		.select('current_version')
		.limit(1)
		.maybeSingle()

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ ok: true, current_version: updatedRow?.current_version ?? null })
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = (await request.json().catch(() => null)) as
		| {
				name?: string
				category?: string
				skill_level?: string
				description?: string
				url?: string
				slug?: string
				badge_icon?: string
		  }
		| null

	const name = body?.name?.trim() ?? ''
	const category = body?.category?.trim() ?? ''
	const skillLevel = body?.skill_level?.trim() || 'Beginner'

	if (!name || !category) {
		return NextResponse.json({ error: 'name and category are required' }, { status: 400 })
	}

	const admin = createAdminClient()

	let categorySort = 999
	const { data: categoryRow, error: categoryError } = await admin
		.from('microskill_categories')
		.select('sort_order')
		.eq('name', category)
		.limit(1)
		.maybeSingle()
	if (!categoryError && categoryRow) {
		categorySort = categoryRow.sort_order
	} else {
		const { data: categorySkillRows } = await admin
			.from('microskills')
			.select('category_sort')
			.eq('category', category)
			.order('category_sort', { ascending: true })
			.limit(1)
		if (categorySkillRows && categorySkillRows.length > 0) {
			categorySort = categorySkillRows[0].category_sort
		}
	}

	const { data: skillRows, error: skillError } = await admin
		.from('microskills')
		.select('skill_sort')
		.eq('category', category)
		.order('skill_sort', { ascending: false })
		.limit(1)

	if (skillError) {
		return NextResponse.json({ error: skillError.message }, { status: 500 })
	}

	const nextSkillSort =
		skillRows && skillRows.length > 0 && Number.isFinite(skillRows[0].skill_sort)
			? skillRows[0].skill_sort + 1
			: 0

	const slugBase = slugify(body?.slug?.trim() || name || 'microskill')
	let candidateSlug = slugBase.length > 0 ? slugBase : `microskill-${Date.now()}`
	let suffix = 2
	while (true) {
		const { data: existingSlugRow, error: slugLookupError } = await admin
			.from('microskills')
			.select('id')
			.eq('slug', candidateSlug)
			.limit(1)
			.maybeSingle()
		if (slugLookupError) {
			return NextResponse.json({ error: slugLookupError.message }, { status: 500 })
		}
		if (!existingSlugRow) break
		candidateSlug = `${slugBase}-${suffix}`
		suffix += 1
	}

	const { data: created, error: insertError } = await admin
		.from('microskills')
		.insert({
			name,
			slug: candidateSlug,
			category,
			category_sort: categorySort,
			skill_level: skillLevel,
			skill_sort: nextSkillSort,
			description: body?.description?.trim() ?? '',
			url: body?.url?.trim() ?? '',
			current_version: 1,
			is_public: false,
			badge_icon: sanitizeBadgeIconName(body?.badge_icon ?? DEFAULT_BADGE_ICON),
			lessons: normalizeLessonsPayload(null),
			updated_at: new Date().toISOString(),
		})
		.select(
			'id,name,slug,category,skill_level,description,url,current_version,is_public,updated_at,category_sort,skill_sort,badge_icon'
		)
		.single()

	if (insertError) {
		return NextResponse.json({ error: insertError.message }, { status: 500 })
	}

	return NextResponse.json({ microskill: created })
}
