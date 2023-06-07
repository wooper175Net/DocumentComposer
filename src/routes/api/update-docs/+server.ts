import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { caseItem } from '$lib/interfaces/caseItem';
import type { docItem } from '$lib/interfaces/docItem';
import { prisma } from '$lib/server/prisma';
import type { docItemSubItem } from '$lib/interfaces/docItemSubItem';

export const POST: RequestHandler = async ({ request }) => {

    const data: {caseItem: caseItem, newDocList: Array<docItem>} = await request.json();
    let caseItem = data.caseItem;
    let newDocList = data.newDocList;
    let seq = 0;

    for (const e of newDocList) {
       
        if (!e.sequence) { //new documents don't have sequence number set
            // console.log(e);
            let newSubItems: Array<docItemSubItem> = [];
            if (e.documentSubItems) {
                
                for (let subItem of e.documentSubItems) {
                    newSubItems = [...newSubItems, {label: subItem.label}];
                }
                console.log(newSubItems);
            }
            await prisma.document.create({
                data: {
                    heading: e.heading,
                    type: e.type,
                    desc: e.desc,
                    done: e.done,
                    caseId: caseItem.id,
                    sequence: ++seq,
                    documentSubItems: {
                        create: newSubItems
                    }
                },
                include: {
                    documentSubItems: true
                }
            });
        } else {
            await prisma.document.update({
                where: { id: e.id},
                data: {
                    sequence: ++seq
                }
            })
        }
    }

    const savedDocs = await prisma.document.findMany({
        where: {
            caseId: caseItem.id
        },
        include: { documentSubItems: true },
        orderBy: { sequence: 'asc'}
    });

    return json(savedDocs);
};
