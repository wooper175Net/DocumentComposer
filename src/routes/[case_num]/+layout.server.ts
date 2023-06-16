import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
    
    const caseItem = await prisma.case.findFirst({
        where: {
            caseNumber: params.case_num,
            published: true
        },
        include: {
            documents: {
                orderBy: { sequence: 'asc'},
                include: {
                    documentSubItems: {
                        orderBy: { id: 'asc' }
                    }
                }
            }
        }
    });

    if (!caseItem) {
        throw error(404, {
            message: 'Not found'
        }); 
    }

    return { 
        case_item: caseItem,
        case_num: params.case_num,
        user: locals.user
    };
}) satisfies LayoutServerLoad;

