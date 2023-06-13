import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data: {caseId: number, status: string} = await request.json();

    const toggleDocs = await prisma.case.update({
        where: {
            id: data.caseId
        },
        data: {
            status: data.status
        }
    });

	return json({success: true});
};
