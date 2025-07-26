import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { KindnessTask, Mood } from '@/hooks/useKindnessApp';

interface TaskListProps {
  tasks: KindnessTask[];
  userPoints: number;
  selectedMood: Mood;
  isLoading: boolean;
  onCompleteTask: (taskId: string) => Promise<boolean>;
  onSkipTask: () => void;
  onBack: () => void;
  onReflection: (taskId: string) => void;
  getPlantEmoji: (points: number) => string;
}

export function TaskList({ 
  tasks, 
  userPoints, 
  selectedMood, 
  isLoading, 
  onCompleteTask, 
  onSkipTask, 
  onBack, 
  onReflection,
  getPlantEmoji 
}: TaskListProps) {
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    const success = await onCompleteTask(taskId);
    if (success) {
      setCompletedTaskId(taskId);
      // Auto-navigate to reflection after a brief delay
      setTimeout(() => {
        onReflection(taskId);
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌸</div>
          <p className="text-lg text-muted-foreground">Finding perfect kindness tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-4 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">💛 {userPoints} Points</span>
            <span className="text-2xl points-glow">{getPlantEmoji(userPoints)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Kindness Tasks for {selectedMood} mood
          </h2>
          <p className="text-muted-foreground">
            Choose a task that feels right for you today
          </p>
        </div>

        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="kindness-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-relaxed flex-1 pr-4">
                    {task.task_text}
                  </CardTitle>
                  <Badge 
                    variant={task.category === 'self' ? 'secondary' : 'outline'}
                    className="ml-2 shrink-0"
                  >
                    {task.category === 'self' ? '🧘 Self' : '🤝 Others'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    className="action-button-done flex-1"
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completedTaskId === task.id}
                  >
                    {completedTaskId === task.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed!
                      </>
                    ) : (
                      <>
                        ✅ Done
                      </>
                    )}
                  </Button>
                  
                  <Button
                    className="action-button-skip flex-1"
                    onClick={onSkipTask}
                    disabled={completedTaskId === task.id}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold mb-2">No tasks available</h3>
            <p className="text-muted-foreground">
              Try selecting a different mood or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}