import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Mood = 'sad' | 'tired' | 'okay' | 'energized';

export interface KindnessTask {
  id: string;
  task_text: string;
  category: 'self' | 'others';
  mood_tag: Mood;
}

export interface UserData {
  id: string;
  user_id: string | null;
  points: number;
}

export function useKindnessApp() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentTasks, setCurrentTasks] = useState<KindnessTask[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userId, setUserId] = useState<string>('anonymous');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize user and get points
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // For demo purposes, we'll use a fixed UUID for anonymous user
      const anonymousUserId = '00000000-0000-0000-0000-000000000000';
      setUserId(anonymousUserId);
      
      // Check if user exists, if not create them
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', anonymousUserId)
        .maybeSingle();

      if (!existingUser) {
        await supabase
          .from('users')
          .insert({ user_id: anonymousUserId, points: 0 });
        setUserPoints(0);
      } else {
        setUserPoints(existingUser.points);
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
      const { data: tasks, error } = await supabase
        .from('kindness_tasks')
        .select('*')
        .eq('mood_tag', mood)
        .limit(3);

      if (error) throw error;
      setCurrentTasks((tasks || []) as KindnessTask[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch kindness tasks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      // Add point to user
      const { error: updateError } = await supabase
        .from('users')
        .update({ points: userPoints + 1 })
        .eq('user_id', userId);

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
    try {
      const { error } = await supabase
        .from('reflections')
        .insert({
          task_id: taskId,
          mood_selected: selectedMood,
          user_feedback: feedback,
          user_id: userId
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
    userId,
    isLoading,
    fetchTasksForMood,
    completeTask,
    saveReflection,
    getPlantEmoji,
    getBadge,
    getNextMilestone,
  };
}