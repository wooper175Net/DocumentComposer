import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {tempDocId: number} = await request.json();

    console.log(data);
    await prisma.templateDocument.delete({
        where: {
            id: data.tempDocId
        }
    });

	return json({success: true});
};
