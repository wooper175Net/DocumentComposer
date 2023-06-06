import { redirect } from '@sveltejs/kit'
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma'

export const load = async ({ locals }) => {
	// redirect user if not logged in
	if (!locals.user) {
		throw redirect(302, '/login')
	}

	const cases = await prisma.case.findMany({
		include: {
			creator: true,
			documents: {
				include: { documentSubItems: true },
				orderBy: { sequence: 'asc'}
			}
		}
	})
    if ( !cases) {
        throw error (500, 'Error retrieving data')    
    }

	return {
		cases: cases,
		user: locals.user,
	}
}