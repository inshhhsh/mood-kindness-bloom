import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
  type?: 'spinner' | 'dots' | 'bars';
}

export const Loading: React.FC<LoadingProps> = ({ 
  className, 
  text = "Loading...", 
  type = "spinner" 
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-neon-pink animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 bg-neon-cyan animate-pulse"
                style={{
                  height: `${12 + (i % 3) * 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-neon-pink border-t-transparent animate-spin" />
            <div className="absolute inset-1 border-2 border-neon-cyan border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="pixel-window p-6 border-2 border-neon-cyan">
        <div className="pixel-window-titlebar mb-4">
          <span>SYSTEM STATUS</span>
        </div>
        <div className="pixel-window-content">
          <div className="flex flex-col items-center space-y-4">
            {renderLoader()}
            <div className="pixel-text-body text-neon-pink animate-pulse">
              {text}
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-neon-green animate-ping" />
              <div className="w-1 h-1 bg-neon-green animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-neon-green animate-ping" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Retro screen transition component
export const ScreenTransition: React.FC<{ isVisible: boolean; onComplete?: () => void }> = ({ 
  isVisible, 
  onComplete 
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="pixel-window p-8">
        <div className="pixel-window-titlebar mb-4">
          <span>SYSTEM TRANSITION</span>
        </div>
        <div className="pixel-window-content">
          <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-neon-cyan animate-pulse"
                  style={{
                    animationDelay: `${(i % 8) * 0.1}s`,
                    animationDuration: '0.5s'
                  }}
                />
              ))}
            </div>
            <div className="pixel-text-body text-neon-pink">
              LOADING NEXT SCREEN...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};