import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, locals }) => {
    
    const caseItem = await prisma.case.findFirst({
        where: {
            caseNumber: params.case_num
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

    return { 
        case_item: caseItem,
        case_num: params.case_num,
        user: locals.user
    };
}) satisfies LayoutServerLoad;

