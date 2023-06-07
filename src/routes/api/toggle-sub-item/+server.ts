import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {subItemId: number, checked: boolean} = await request.json();

    await prisma.documentSubItem.update({
        where: {
            id: data.subItemId
        },
        data: {
            checked: data.checked
        }
    });

	return json({success: true});
};
