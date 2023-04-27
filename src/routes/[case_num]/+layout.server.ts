import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    
    return { case_num: params.case_num };
}) satisfies LayoutServerLoad;

