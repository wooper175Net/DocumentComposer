import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { Case } from '@prisma/client';
import type { caseItem } from '$lib/interfaces/caseItem';

export const load: PageServerLoad = (async ({ parent, params }) => {
    const parentData = await parent();

    const caseFound: Array<caseItem> = parentData.cases.filter(
        (e: Case) => e.caseNumber === params.case_num
    );

    if (caseFound.length === 0) {
        throw redirect(307, '/admin');
    }

    const templates = prisma.templateDocument.findMany({
        include: {
            documentSubItems: {
                orderBy: { id: 'asc'}
            }}
    });


    return { 
        caseItem: caseFound.pop(),
        templates: templates
    };
});