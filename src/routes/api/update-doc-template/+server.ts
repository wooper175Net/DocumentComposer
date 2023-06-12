import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import type { docItem } from '$lib/interfaces/docItem';
import type { docItemSubItem } from '$lib/interfaces/docItemSubItem';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docTemplateItem: docItem, deletedSubItems: Array<docItemSubItem>} = await request.json();

    const updatedDocTemplate = await prisma.templateDocument.update({
        where: {
            id: data.docTemplateItem.id
        },
        data: {
            heading: data.docTemplateItem.heading,
            type: data.docTemplateItem.type,
            desc: data.docTemplateItem.desc
        },
        include: {
            documentSubItems: {
                orderBy: { id: 'asc'}
            }
        }
    });

    if (data.docTemplateItem.documentSubItems && data.docTemplateItem.documentSubItems.length > 0) {
        for (const subItem of data.docTemplateItem.documentSubItems) {
            await prisma.documentSubItem.upsert({
                where: {
                    id: subItem.id
                },
                update: {
                    label: subItem.label
                },
                create: {
                    label: subItem.label,
                    documentTemplateId: data.docTemplateItem.id
                }
            });
        }
    }

    if (data.deletedSubItems.length > 0) {
        for (const subItemDel of data.deletedSubItems) {
            await prisma.documentSubItem.delete({
                where: {
                    id: subItemDel.id
                }
            });
        }
    }

	return json( updatedDocTemplate );
};
