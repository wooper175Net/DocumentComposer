import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import { prisma } from '$lib/server/prisma'

export const load = async ({ locals }) => {
	if (locals.user) {
        console.log('User logged')
		throw redirect(302, '/admin')
	}
}

export const actions = {

    logout: async ({ cookies, request }) => {
        console.log('logout called')
    },
	login: async ({ cookies, request }) => {
		const data = await request.formData()

		const username = data.get('username')
		const password = data.get('password')

		if (
			typeof username !== 'string' ||
			typeof password !== 'string' ||
			!username ||
			!password
		) {
			return fail(400, { invalid: true })
		}

		const user = await prisma.user.findUnique({ where: { email: username } })

        // console.log(user)

		if (!user) {
			return fail(400, { credentials: true })
		}

		const userPassword = await bcrypt.compare(password, user.password)

		if (!userPassword) {
			return fail(400, { credentials: true })
		}

		const authenticatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { userAuthToken: crypto.randomUUID() },
		})

		cookies.set('session', authenticatedUser.userAuthToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		})

		throw redirect(302, '/admin')
	}
}