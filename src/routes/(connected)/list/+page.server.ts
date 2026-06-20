import type { PageServerLoad } from './$types';
import { QuestionService } from '$lib/QuestionsService';

export const load = (async ({ locals: { supabase } }) => {
    const questionService = new QuestionService(supabase);
    const questionsPromise = questionService.fetchAllQuestions();
    
    return {
        // stream entire response to the page
        allQuestions: questionsPromise
    };
}) satisfies PageServerLoad;