import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { docItemSubItem } from '$lib/interfaces/docItemSubItem';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docId: number, subItem: docItemSubItem} = await request.json();

    // const deleteDoc = await prisma.document.delete({
    //     where: {
    //         id: data.docId
    //     }
    // });

    const newSubItem = await prisma.documentSubItem.create({
        data: {
            label: data.subItem.label,
            documentId: data.docId
        }
    });

    

	return json(newSubItem);
};
