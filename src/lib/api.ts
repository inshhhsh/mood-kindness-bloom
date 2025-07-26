import {supabase} from "@/integrations/supabase/client.ts";

export async function fetchTasks(mood: string): Promise<{task_text: string, prompt?: string}[]> {
    try {
        const response = await fetch("http://127.0.0.1:8000/generate-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mood }),
            signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        // Fallback to direct Supabase query
        return fetchTasksFromSupabaseDirectly(mood);
    }
}

async function fetchTasksFromSupabaseDirectly(mood: string) {
    try {
        const { data, error } = await supabase
            .from('kindness_tasks')
            .select('task_text')
            .eq('mood_tag', mood)
            .limit(3);

        if (error) throw error;
        return data || [];
    } catch (supabaseError) {
        console.error('Supabase fallback failed:', supabaseError);
        return getHardcodedFallbackTasks(mood);
    }
}

function getHardcodedFallbackTasks(mood: string) {
    const fallbacks = {
        sad: [{ task_text: "Write down one thing you like about yourself" }],
        tired: [{ task_text: "Drink a glass of water" }],
        okay: [{ task_text: "Compliment someone today" }],
        energized: [{ task_text: "Do 5 minutes of stretching" }]
    };
    return fallbacks[mood as keyof typeof fallbacks] || [{ task_text: "Take three deep breaths" }];
}
