import type { PageServerLoad } from './$types';
import { QuestionService } from '$lib/QuestionsService';

export const load = (async ({ locals: { supabase } }) => {
    const sService = new QuestionService(supabase)
    const statsPromise = sService.getWebsiteStats()

    return {
        stats: statsPromise
    };
}) satisfies PageServerLoad;