import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    return { case_num: params.case_num };
}) satisfies PageLoad;