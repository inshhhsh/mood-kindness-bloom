import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface ProgressPageProps {
  userPoints: number;
  getPlantEmoji: (points: number) => string;
  getBadge: (points: number) => { emoji: string; name: string } | null;
  getNextMilestone: (points: number) => { target: number; remaining: number };
  onSuggestMoreTasks: () => void;
  onBack: () => void;
}

export function ProgressPage({ 
  userPoints, 
  getPlantEmoji, 
  getBadge, 
  getNextMilestone, 
  onSuggestMoreTasks, 
  onBack 
}: ProgressPageProps) {
  const badge = getBadge(userPoints);
  const milestone = getNextMilestone(userPoints);
  const plantEmoji = getPlantEmoji(userPoints);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Points Display */}
        <Card className="kindness-card text-center">
          <CardHeader>
            <div className="text-8xl mb-4 points-glow">{plantEmoji}</div>
            <CardTitle className="text-4xl mb-2">
              💛 {userPoints} Kindness Points
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Your garden of kindness is growing!
            </p>
          </CardHeader>
        </Card>

        {/* Badge Display */}
        {badge && (
          <Card className="kindness-card">
            <CardContent className="text-center py-8">
              <div className="text-6xl mb-4 animate-glow">{badge.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{badge.name}</h3>
              <p className="text-muted-foreground">
                You've earned this special recognition!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Tracker */}
        <Card className="kindness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress to {milestone.target} points</span>
                <Badge variant="outline">
                  {milestone.remaining} more to go!
                </Badge>
              </div>
              
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.max(10, (userPoints / milestone.target) * 100)}%` 
                  }}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                {milestone.remaining === 0 
                  ? "🎉 Milestone achieved! Keep spreading kindness!"
                  : `Complete ${milestone.remaining} more acts of kindness to reach your next milestone!`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kindness Impact */}
        <Card className="kindness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Kindness Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{userPoints}</div>
                <div className="text-sm text-muted-foreground">Acts Completed</div>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userPoints > 0 ? '💫' : '🌟'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {userPoints > 0 ? 'Making a difference' : 'Ready to start'}
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Every act of kindness creates ripples of positivity in the world
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            className="action-button-done w-full py-6 text-lg"
            onClick={onSuggestMoreTasks}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Suggest More Tasks
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-4"
            onClick={onBack}
          >
            Start Fresh
          </Button>
        </div>
      </div>
    </div>
  );
}