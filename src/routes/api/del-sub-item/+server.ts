import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {subItemId: number} = await request.json();
    
    await prisma.documentSubItem.delete({
        where: {
            id: data.subItemId
        }
    });

	return json({success: true});
};
