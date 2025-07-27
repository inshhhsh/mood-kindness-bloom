import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { KindnessTask, Mood } from '@/hooks/useKindnessApp';
import { useToast } from '@/hooks/use-toast';  // <-- Import toast here!

interface TaskListProps {
  tasks: KindnessTask[];
  userPoints: number;
  selectedMood: Mood;
  isLoading: boolean;
  onCompleteTask: (taskId: string, taskText: string) => Promise<string | null>;
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
  const [quote, setQuote] = useState<string | null>(null);
  const { toast } = useToast();
  const [isWaiting, setIsWaiting] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);


  async function handleCompleteTask(taskId: string, taskText: string) {
    setIsWaiting(true);
    const quote = await onCompleteTask(taskId, taskText);
    setIsWaiting(false);

    if (quote === null) {
      toast({
        title: "Oops!",
        description: "Failed to complete the task.",
        variant: "destructive",
      });
      return;
    }

    setCompletedTaskId(taskId);
    setQuote(quote);
    setShowCongratsModal(true);

    toast({
      title: "🎉 Congrats! You earned one point! ",
      description: "Thanks for spreading kindness! 💛",
      variant: "default",
    });
  }

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
                          onClick={() => handleCompleteTask(task.id, task.task_text)}
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

          {isWaiting && (
              <div className="fixed inset-0 bg-gradient-to-br from-background to-accent/20 flex items-center justify-center z-50 p-4">
                <div className="w-full max-w-lg">
                  <div className="kindness-card pixel-window-theme">
                    <div className="pixel-window-titlebar flex items-center justify-center">
                      <div className="pixel-text-body text-window-active">💡 KINDNESS BOT</div>
                    </div>
                    <div className="pixel-window-content flex flex-col items-center p-8">
                      <div className="text-5xl mb-4">🤖</div>
                      <div className="pixel-text-title text-lg mb-3">Kindness Bot is thinking...</div>
                      <div className="my-3">
                        <div className="animate-spin border-4 border-accent border-t-transparent rounded-full w-12 h-12 mx-auto" />
                      </div>
                      <div className="pixel-text-body text-muted-foreground text-sm mt-4">
                        Please wait while we generate your personalized quote.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}


          {/* AI Quote Popup */}
          {quote && (
              <div className="fixed inset-0 bg-gradient-to-br from-background to-accent/20 flex items-center justify-center z-50 p-4">
                <div className="w-full max-w-lg">
                  <div className="kindness-card pixel-window-theme">
                    <div className="pixel-window-titlebar flex items-center justify-center">
                      <div className="pixel-text-body text-window-active">💡 KINDNESS BOT</div>
                    </div>
                    <div className="pixel-window-content flex flex-col items-center p-6">
                      <div className="text-5xl mb-4">🤖</div>
                      <div className="pixel-text-title text-xl mb-4">AI says:</div>
                      <blockquote className="italic pixel-text-body bg-background/70 border border-border rounded p-3 text-base mb-6 max-w-md mx-auto" style={{wordBreak: "break-word", fontSize: "1rem"}}>
                        "{quote}"
                      </blockquote>
                      <Button
                          className="pixel-button bg-accent text-foreground hover:bg-accent/80 px-8 py-2 text-base"
                          onClick={() => {
                            setQuote(null);
                            onReflection(completedTaskId!);
                          }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          )}

        </div>
      </div>
  );
}
