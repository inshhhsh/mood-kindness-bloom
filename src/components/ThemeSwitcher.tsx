import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="pixel-button flex items-center gap-2 text-xs"
      >
        <Palette className="w-3 h-3" />
        {currentTheme?.emoji}
        <span className="hidden sm:inline">{currentTheme?.name}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 pixel-window z-50 min-w-[200px]">
          <div className="pixel-window-titlebar">
            <span className="text-xs">Choose Theme</span>
          </div>
          <div className="pixel-window-content p-2 space-y-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id);
                  setIsOpen(false);
                }}
                className={`pixel-button w-full text-left text-xs flex items-center gap-2 ${
                  theme === themeOption.id ? 'bg-kindness-primary text-white' : ''
                }`}
              >
                <span>{themeOption.emoji}</span>
                <span>{themeOption.name}</span>
                {theme === themeOption.id && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}