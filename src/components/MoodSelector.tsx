import { Button } from '@/components/ui/button';
import { Mood } from '@/hooks/useKindnessApp';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { mood: 'sad', emoji: '😔', label: 'Sad' },
  { mood: 'tired', emoji: '😐', label: 'Tired' },
  { mood: 'okay', emoji: '🙂', label: 'Okay' },
  { mood: 'energized', emoji: '🤩', label: 'Energized' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-accent/20">
      <div className="text-center mb-12 max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-foreground">
          How are you feeling today?
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your mood to discover acts of kindness perfect for you
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        {moodOptions.map(({ mood, emoji, label }) => (
          <Button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className="mood-button h-auto flex-col space-y-3"
            variant="outline"
          >
            <span className="text-6xl">{emoji}</span>
            <span className="text-xl font-semibold">{label}</span>
          </Button>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Each mood leads to different kindness suggestions 💛
        </p>
      </div>
    </div>
  );
}