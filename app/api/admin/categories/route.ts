import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/supabase/is-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user || !isAdminUser(user)) return null
	return user
}

function isMissingCategoriesTable(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false
	const maybeError = error as { code?: string; message?: string }
	if (maybeError.code === 'PGRST205') return true
	return (
		typeof maybeError.message === 'string' &&
		maybeError.message.includes("Could not find the table 'public.microskill_categories'")
	)
}

export async function GET() {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskill_categories')
		.select('id,name,sort_order')
		.order('sort_order', { ascending: true })
		.order('name', { ascending: true })

	if (error) {
		if (!isMissingCategoriesTable(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		const { data: microskills, error: microskillsError } = await admin
			.from('microskills')
			.select('category,category_sort')
			.order('category_sort', { ascending: true })
			.order('skill_sort', { ascending: true })

		if (microskillsError) {
			return NextResponse.json({ error: microskillsError.message }, { status: 500 })
		}

		const byCategory = new Map<string, number>()
		for (const row of microskills ?? []) {
			if (!byCategory.has(row.category)) {
				byCategory.set(row.category, row.category_sort)
				continue
			}
			byCategory.set(
				row.category,
				Math.min(byCategory.get(row.category) ?? row.category_sort, row.category_sort)
			)
		}

		const categories = Array.from(byCategory.entries())
			.map(([name, sort_order]) => ({ id: null, name, sort_order }))
			.sort(
				(a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
			)

		return NextResponse.json({ categories })
	}

	return NextResponse.json({ categories: data ?? [] })
}

export async function POST(request: Request) {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = (await request.json().catch(() => null)) as
		| { name?: string; sortOrder?: number }
		| null

	const name = body?.name?.trim()
	if (!name) {
		return NextResponse.json({ error: 'name is required' }, { status: 400 })
	}

	const admin = createAdminClient()
	const { data, error } = await admin
		.from('microskill_categories')
		.insert({ name, sort_order: body?.sortOrder ?? 999 })
		.select('id,name,sort_order')
		.single()

	if (error) {
		if (isMissingCategoriesTable(error)) {
			const sortOrder = body?.sortOrder ?? 999
			const { error: microskillsError } = await admin
				.from('microskills')
				.update({ category_sort: sortOrder, updated_at: new Date().toISOString() })
				.eq('category', name)
			if (microskillsError) {
				return NextResponse.json({ error: microskillsError.message }, { status: 500 })
			}
			return NextResponse.json({ category: { id: null, name, sort_order: sortOrder } })
		}

		const conflict = (error as { code?: string }).code === '23505'
		return NextResponse.json(
			{ error: conflict ? 'Category already exists' : error.message },
			{ status: conflict ? 409 : 500 }
		)
	}

	return NextResponse.json({ category: data })
}

export async function PATCH(request: Request) {
	const user = await requireAdmin()
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const body = (await request.json().catch(() => null)) as
		| { id?: number; sortOrder?: number }
		| null

	if (!body || typeof body.id !== 'number') {
		return NextResponse.json({ error: 'id is required' }, { status: 400 })
	}

	if (typeof body.sortOrder !== 'number' || !Number.isFinite(body.sortOrder)) {
		return NextResponse.json({ error: 'sortOrder is required' }, { status: 400 })
	}

	const admin = createAdminClient()
	const { data: updatedCategory, error: categoryError } = await admin
		.from('microskill_categories')
		.update({ sort_order: body.sortOrder })
		.eq('id', body.id)
		.select('id,name,sort_order')
		.single()

	if (categoryError) {
		if (isMissingCategoriesTable(categoryError)) {
			return NextResponse.json(
				{
					error:
						'microskill_categories table is missing. Use category save from the catalog list (which sends by name) or run migrations.',
				},
				{ status: 400 }
			)
		}
		return NextResponse.json({ error: categoryError.message }, { status: 500 })
	}

	const { error: microskillsError } = await admin
		.from('microskills')
		.update({ category_sort: body.sortOrder, updated_at: new Date().toISOString() })
		.eq('category', updatedCategory.name)

	if (microskillsError) {
		return NextResponse.json({ error: microskillsError.message }, { status: 500 })
	}

	return NextResponse.json({ category: updatedCategory })
}
