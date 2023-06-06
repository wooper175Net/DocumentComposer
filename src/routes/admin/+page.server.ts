import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const actions: Actions = {
    create: async ({request, locals}) => {
        const formData = await request.formData()
        let caseNumber = formData.get('case-number')
        let address = formData.get('case-address')
        let status = 'new'

        if (!caseNumber || !address) {
            return fail(400, { caseNumber, address, missing: true });
        }

        await prisma.case.create({
            data: {
                caseNumber,
                address,
                status,
                creator: {connect: { id: locals.user.id}}        
            }
        })
        
    },

    delete: async ({request}) => {
        const formData = await request.formData()
        const delId =  formData.get('del-id')

        if (!delId || delId === '') {
            return fail(400, { delId, missing: true });
        }

        await prisma.case.delete({
            where: {id: +delId}
        })
    }
}