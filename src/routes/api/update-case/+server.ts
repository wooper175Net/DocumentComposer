import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { caseItem } from '$lib/interfaces/caseItem';

export const POST: RequestHandler = async ({ request }) => {
	const data: {updatedItem: caseItem} = await request.json();

    const updatedDoc = await prisma.case.update({
        where: {
            id: data.updatedItem.id
        },
        data: {
            published: data.updatedItem.published
        }
    });

	return json( updatedDoc );
};
