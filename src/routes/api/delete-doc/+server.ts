import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docId: number} = await request.json();

    const deleteDoc = await prisma.document.delete({
        where: {
            id: data.docId
        }
    });

	return json({success: true});
};
