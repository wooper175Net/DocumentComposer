import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docId: number, done: boolean} = await request.json();

    const toggleDocs = await prisma.document.update({
        where: {
            id: data.docId
        },
        data: {
            done: data.done
        }
    });

	return json({success: true});
};
