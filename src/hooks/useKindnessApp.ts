import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { fetchTasks } from '@/lib/api';

export type Mood = 'sad' | 'tired' | 'okay' | 'energized';

export interface KindnessTask {
  id: string;
  task_text: string;
  prompt: string;
  category: 'self' | 'others';
  mood_tag: Mood;
}

export interface UserData {
  id: string;
  user_id: string | null;
  points: number;
}

interface TaskResponse {
  id: string;
  task_text: string;
  prompt: string | null;
  mood_tag: Mood;
  category: 'self' | 'others';
}

export function useKindnessApp(user: User | null) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentTasks, setCurrentTasks] = useState<KindnessTask[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize user and get points when user changes
  useEffect(() => {
    if (user) {
      initializeUser();
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user) return;
    
    try {
      // Get user points
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userData) {
        setUserPoints(userData.points);
      } else {
        // This should not happen as the trigger creates the user record
        setUserPoints(0);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      toast({
        title: "Error",
        description: "Failed to initialize user data",
        variant: "destructive"
      });
    }
  };

  const fetchTasksForMood = async (mood: Mood) => {
    setIsLoading(true);
    try {
      const tasks = await fetchTasks(mood);

      setCurrentTasks(tasks.map((task, index) => ({
        id: `task-${index}-${Date.now()}`,
        task_text: task.task_text,
        prompt: task.prompt || generateFallbackPrompt(task.task_text, mood),
        category: 'self',
        mood_tag: mood
      })));
    } catch (error) {
      console.error('Task processing failed:', error);
      toast({
        title: "Connection Issue",
        description: "Using offline tasks - some features may be limited",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function generateFallbackPrompt(taskText: string, mood: Mood): string {
    const fallbacks: Record<Mood, string[]> = {
      sad: ["Even small steps count!", "You've got this!"],
      tired: ["Baby steps are still progress!", "You can do this!"],
      okay: ["Let's spread some joy!", "Nice opportunity to be kind!"],
      energized: ["Let's channel this energy!", "Time to shine!"]
    };
    return fallbacks[mood][Math.floor(Math.random() * fallbacks[mood].length)];
  }

  const completeTask = async (taskId: string) => {
    if (!user) return false;
    
    try {
      // Add point to user
      const { error: updateError } = await supabase
        .from('users')
        .update({ points: userPoints + 1 })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserPoints(prev => prev + 1);
      
      toast({
        title: "🎉 You earned 1 Kindness Point!",
        description: "Thank you for spreading kindness!",
      });

      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive"
      });
      return false;
    }
  };

  const saveReflection = async (taskId: string, feedback: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('reflections')
        .insert({
          task_id: taskId,
          mood_selected: selectedMood,
          user_feedback: feedback,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Reflection saved",
        description: "Thank you for sharing your thoughts!",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error",
        description: "Failed to save reflection",
        variant: "destructive"
      });
      return false;
    }
  };

  const getPlantEmoji = (points: number) => {
    if (points >= 10) return '🌻';
    if (points >= 5) return '🌿';
    return '🌱';
  };

  const getBadge = (points: number) => {
    if (points >= 10) return { emoji: '🌟', name: 'Kindness Champion' };
    if (points >= 5) return { emoji: '🏅', name: 'Small but Mighty' };
    return null;
  };

  const getNextMilestone = (points: number) => {
    if (points < 5) return { target: 5, remaining: 5 - points };
    if (points < 10) return { target: 10, remaining: 10 - points };
    return { target: 15, remaining: 15 - points };
  };





  return {
    selectedMood,
    setSelectedMood,
    currentTasks,
    userPoints,
    isLoading,
    fetchTasksForMood,
    completeTask,
    saveReflection,
    getPlantEmoji,
    getBadge,
    getNextMilestone,
  };
}