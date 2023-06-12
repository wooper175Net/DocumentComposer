import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { docItemSubItem } from '$lib/interfaces/docItemSubItem';
import type { docItem } from '$lib/interfaces/docItem';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docTemplateItem: docItem} = await request.json();

    if (data.docTemplateItem.documentSubItems) {
        for (let su of data.docTemplateItem.documentSubItems) {
            delete(su.id);
        }
    }

    const newDocTemplate = await prisma.templateDocument.create({
        data: {
            heading: data.docTemplateItem.heading,
            type: data.docTemplateItem.type,
            desc: data.docTemplateItem.desc,
            documentSubItems: {
                create: data.docTemplateItem.documentSubItems
            }
        },
        include: {
            documentSubItems: {
                orderBy: { id: 'asc'}
            }
        }
    });
    
	return json( newDocTemplate );
};
