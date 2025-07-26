import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="pixel-window">
        <div className="pixel-window-titlebar">
          <span className="pixel-text-body">THEME</span>
        </div>
        <div className="pixel-window-content p-4">
          <Button
            onClick={toggleTheme}
            variant="pixel"
            size="sm"
            className="w-full"
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xs">
                {theme === 'retro' ? '🌸' : '🌊'}
              </span>
              <span className="text-xs">
                {theme === 'retro' ? 'RETRO' : 'SYNTH'}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};