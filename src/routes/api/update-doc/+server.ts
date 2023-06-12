import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { docItem } from '$lib/interfaces/docItem';
import { updated } from '$app/stores';

export const POST: RequestHandler = async ({ request }) => {
	const data: {updatedItem: docItem} = await request.json();


    console.log(data.updatedItem);

    const updatedDoc = await prisma.document.update({
        where: {
            id: data.updatedItem.id
        },
        data: {
            desc: data.updatedItem.desc,
            heading: data.updatedItem.heading
        },
        include: {
            documentSubItems: {
                orderBy: { id: 'asc'}
            }
        }
    });

	return json( updatedDoc );
};
