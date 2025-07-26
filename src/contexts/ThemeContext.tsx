import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'retro' | 'pastel' | 'neon' | 'forest' | 'ocean' | 'sunset';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; emoji: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { id: 'retro' as Theme, name: 'Retro Wave', emoji: '🌆' },
  { id: 'pastel' as Theme, name: 'Pastel Dreams', emoji: '🌸' },
  { id: 'neon' as Theme, name: 'Neon Cyber', emoji: '⚡' },
  { id: 'forest' as Theme, name: 'Forest Pixel', emoji: '🌲' },
  { id: 'ocean' as Theme, name: 'Ocean Wave', emoji: '🌊' },
  { id: 'sunset' as Theme, name: 'Sunset Glow', emoji: '🌅' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('retro');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('kindness-theme') as Theme;
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kindness-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}