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
      {/* Pixel Window Header */}
      <div className="kindness-card mb-12 max-w-2xl">
        <div className="pixel-window-titlebar">
          <div className="pixel-text-body text-window-active">💖 KINDNESS SELECTOR v1.0</div>
        </div>
        <div className="pixel-window-content text-center">
          <h1 className="pixel-text-title mb-6 text-foreground">
            How are you feeling today?
          </h1>
          <p className="pixel-text-body text-muted-foreground">
            Choose your mood to discover acts of kindness perfect for you
          </p>
        </div>
      </div>
      
      <div className="pixel-mood-selector">
        {moodOptions.map(({ mood, emoji, label }) => (
          <Button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className="mood-button"
            variant="pixel-mood"
            size="mood"
          >
            <span className="emoji text-6xl">{emoji}</span>
            <span className="pixel-text-body">{label}</span>
          </Button>
        ))}
      </div>
      
      <div className="mt-12 kindness-card max-w-md">
        <div className="pixel-window-content text-center">
          <p className="pixel-text-body text-muted-foreground">
            Each mood leads to different kindness suggestions 💛
          </p>
        </div>
      </div>
    </div>
  );
}