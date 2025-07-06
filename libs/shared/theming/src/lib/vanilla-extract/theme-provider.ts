// theme/provider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { lightTheme, darkTheme } from './theme.css';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  storageKey = 'theme-mode',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  // Handle hydration and localStorage
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as ThemeMode;
      if (stored && (stored === 'light' || stored === 'dark')) {
        setMode(stored);
      }
    }
  }, [storageKey]);

  // Save to localStorage when mode changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, mode);
    }
  }, [mode, mounted, storageKey]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const themeClass = mode === 'dark' ? darkTheme : lightTheme;

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      <div className={themeClass}>{children}</div>
    </ThemeContext.Provider>
  );
};
