import { supabase } from "@/integrations/supabase/client.ts";

export async function fetchTasks(mood: string): Promise<{ task_text: string; prompt?: string }[]> {
    // Directly fetch from Supabase — no external API call.
    try {
        const { data, error } = await supabase
            .from('kindness_tasks')
            .select('task_text, mood_tag, category')  // you can select more columns if you want
            .eq('mood_tag', mood)
            .limit(3);

        if (error) throw error;

        return data || [];
    } catch (supabaseError) {
        console.error('Supabase fetch failed:', supabaseError);
        return getHardcodedFallbackTasks(mood);
    }
}

function getHardcodedFallbackTasks(mood: string) {
    const fallbacks = {
        sad: [{ task_text: "Write down one thing you like about yourself" }],
        tired: [{ task_text: "Drink a glass of water" }],
        okay: [{ task_text: "Compliment someone today" }],
        energized: [{ task_text: "Do 5 minutes of stretching" }],
    };
    return fallbacks[mood as keyof typeof fallbacks] || [{ task_text: "Take three deep breaths" }];
}
