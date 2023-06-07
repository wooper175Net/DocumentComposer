import { error, type Handle } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
import { sequence } from '@sveltejs/kit/hooks';

export const handleSession: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session')

	if (!session) {
        // console.log('hooks: no session')
		return await resolve(event)
	}
    // console.log('hooks: session found ', session)
	const user = await prisma.user.findUnique({
		where: { userAuthToken: session },
		select: { id: true, username: true },
	})

	if (user) {
		event.locals.user = {
			id: user.id,
			username: user.username,
		}
	}

	return await resolve(event)
}

export const handleApiAuth: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url } = event;

	if (url.pathname.startsWith('/api/')) {
		if (!locals.user) {
			throw error(401);
		}
	}

	const response = await resolve(event);

	return response;
};

export const handle = sequence(handleSession, handleApiAuth);
