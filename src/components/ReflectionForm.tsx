import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, SkipForward } from 'lucide-react';

interface ReflectionFormProps {
  taskId: string;
  onSaveReflection: (taskId: string, feedback: string) => Promise<boolean>;
  onSkip: () => void;
  onBack: () => void;
}

export function ReflectionForm({ taskId, onSaveReflection, onSkip, onBack }: ReflectionFormProps) {
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      onSkip();
      return;
    }
    
    setIsSubmitting(true);
    const success = await onSaveReflection(taskId, reflection);
    setIsSubmitting(false);
    
    if (success) {
      onSkip(); // Navigate to next page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 pixel-text-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="kindness-card">
          <div className="pixel-window-titlebar">
            <div className="pixel-text-body text-window-active">💭 REFLECTION CHAMBER</div>
          </div>
          
          <CardHeader className="text-center pixel-window-content">
            <div className="text-6xl mb-4">💭</div>
            <CardTitle className="pixel-text-title">
              How did that act make you feel?
            </CardTitle>
            <p className="pixel-text-body text-muted-foreground mt-4">
              Take a moment to reflect on your experience (optional)
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 pixel-window-content pt-0">
            <Textarea
              placeholder="Share your thoughts... How did it feel to complete this act of kindness?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-32 resize-none pixel-button border-2 bg-background/50 pixel-text-body p-4"
            />
            
            <div className="flex gap-3">
              <Button
                className="action-button-done flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent" />
                    <span className="pixel-text-body">Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span className="pixel-text-body">
                      {reflection.trim() ? 'Save Reflection' : 'Continue'}
                    </span>
                  </>
                )}
              </Button>
              
              <Button
                className="action-button-skip"
                onClick={onSkip}
                disabled={isSubmitting}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                <span className="pixel-text-body">Skip</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}