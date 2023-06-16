import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { SubItemType } from '$lib/enums/SubItemType';

export const POST: RequestHandler = async ({ request }) => {
	const data: {docId: number, done: boolean} = await request.json();

    const toggleDocs = await prisma.document.update({
        where: {
            id: data.docId
        },
        data: {
            done: data.done,
            documentSubItems: {
                updateMany: {
                    where: {
                        documentId: data.docId,
                        type: SubItemType.TODO
                    },
                    data: {
                        checked: data.done
                    }
                }
            }
        }
    });

	return json({success: true});
};
