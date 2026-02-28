import { createClient } from '@supabase/supabase-js'
import { microSkills } from '../data/microskills'
import { listToRows } from '../lib/microskills/transform'

async function main() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error(
			'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
		)
	}

	const supabase = createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	})

	const rows = listToRows(microSkills)

	const { error: deleteError } = await supabase
		.from('microskills')
		.delete()
		.not('id', 'is', null)
	if (deleteError) {
		throw new Error(`Could not clear microskills: ${deleteError.message}`)
	}

	if (rows.length > 0) {
		const { error: insertError } = await supabase.from('microskills').insert(rows)
		if (insertError) {
			throw new Error(`Could not insert microskills: ${insertError.message}`)
		}
	}

	console.log(
		`Synced ${microSkills.length} categories and ${rows.length} skills to Supabase.`
	)
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
})
