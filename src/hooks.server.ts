import type { Handle } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'



export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session')

	if (!session) {
        // console.log('hooks: no session')
		return await resolve(event)
	}
    // console.log('hooks: session found ', session)
	const user = await prisma.user.findUnique({
		where: { userAuthToken: session },
		select: { username: true },
	})

	if (user) {
		event.locals.user = {
			username: user.username,
		}
	}

	return await resolve(event)
}