import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { docItemSubItem } from '$lib/interfaces/docItemSubItem';
import { SubItemType } from '$lib/enums/SubItemType';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docId: number, subItem: docItemSubItem} = await request.json();

    const newSubItem = await prisma.documentSubItem.create({
        data: {
            label: data.subItem.label,
            type: data.subItem.type,
            checked: data.subItem.type === SubItemType.TODO ? false : null,
            documentId: data.docId
        }
    });
    
	return json(newSubItem);
};
