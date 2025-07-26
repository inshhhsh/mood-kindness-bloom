import { useState } from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { TaskList } from '@/components/TaskList';
import { ReflectionForm } from '@/components/ReflectionForm';
import { ProgressPage } from '@/components/ProgressPage';
import { useKindnessApp, Mood } from '@/hooks/useKindnessApp';

type AppPage = 'mood' | 'tasks' | 'reflection' | 'progress';

export default function KindnessApp() {
  const [currentPage, setCurrentPage] = useState<AppPage>('mood');
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  
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
  } = useKindnessApp();

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

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mood':
        return <MoodSelector onMoodSelect={handleMoodSelect} />;
      
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
        return <MoodSelector onMoodSelect={handleMoodSelect} />;
    }
  };

  return <div className="kindness-app">{renderCurrentPage()}</div>;
}