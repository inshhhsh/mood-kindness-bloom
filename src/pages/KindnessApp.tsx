import { useState } from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { TaskList } from '@/components/TaskList';
import { ReflectionForm } from '@/components/ReflectionForm';
import { ProgressPage } from '@/components/ProgressPage';
import { useKindnessApp, Mood } from '@/hooks/useKindnessApp';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './AuthPage';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

type AppPage = 'mood' | 'tasks' | 'reflection' | 'progress';

export default function KindnessApp() {
  const { user, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('mood');
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  
  // Always call useKindnessApp, but it will handle null user internally
  const {
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
  } = useKindnessApp(user);

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    await fetchTasksForMood(mood);
    setCurrentPage('tasks');
  };

  const handleCompleteTask = async (taskId: string) => {
    const success = await completeTask(taskId);
    if (success) {
      setCurrentTaskId(taskId);
    }
    return success;
  };

  const handleReflection = (taskId: string) => {
    setCurrentTaskId(taskId);
    setCurrentPage('reflection');
  };

  const handleSaveReflection = async (taskId: string, feedback: string) => {
    const success = await saveReflection(taskId, feedback);
    if (success || !feedback.trim()) {
      setCurrentPage('progress');
    }
    return success;
  };

  const handleSkipReflection = () => {
    setCurrentPage('progress');
  };

  const handleSuggestMoreTasks = () => {
    if (selectedMood) {
      fetchTasksForMood(selectedMood);
      setCurrentPage('tasks');
    } else {
      setCurrentPage('mood');
    }
  };

  const handleBackToMood = () => {
    setCurrentPage('mood');
    setSelectedMood(null);
    setCurrentTaskId('');
  };

  const handleBackToTasks = () => {
    setCurrentPage('tasks');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💛</div>
          <p className="text-lg text-muted-foreground">Loading KindnessAI...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Add logout button to mood selector
  const MoodSelectorWithLogout = () => (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={signOut}
        className="absolute top-4 right-4 z-10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
      <MoodSelector onMoodSelect={handleMoodSelect} />
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mood':
        return <MoodSelectorWithLogout />;
      
      case 'tasks':
        return (
          <TaskList
            tasks={currentTasks}
            userPoints={userPoints}
            selectedMood={selectedMood!}
            isLoading={isLoading}
            onCompleteTask={handleCompleteTask}
            onSkipTask={handleBackToMood}
            onBack={handleBackToMood}
            onReflection={handleReflection}
            getPlantEmoji={getPlantEmoji}
          />
        );
      
      case 'reflection':
        return (
          <ReflectionForm
            taskId={currentTaskId}
            onSaveReflection={handleSaveReflection}
            onSkip={handleSkipReflection}
            onBack={handleBackToTasks}
          />
        );
      
      case 'progress':
        return (
          <ProgressPage
            userPoints={userPoints}
            getPlantEmoji={getPlantEmoji}
            getBadge={getBadge}
            getNextMilestone={getNextMilestone}
            onSuggestMoreTasks={handleSuggestMoreTasks}
            onBack={handleBackToMood}
          />
        );
      
      default:
        return <MoodSelectorWithLogout />;
    }
  };

  return <div className="kindness-app">{renderCurrentPage()}</div>;
}