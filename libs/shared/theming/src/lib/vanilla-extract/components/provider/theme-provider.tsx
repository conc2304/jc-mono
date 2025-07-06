'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { darkTheme, lightTheme } from '../../theme.css';
// import { lightTheme, darkTheme } from './theme.css';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  systemPreference: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to get system preference
const getSystemPreference = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  storageKey = 'theme-mode',
}) => {
  const [systemPreference, setSystemPreference] =
    useState<ResolvedTheme>('light');
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Only try to read from localStorage on the client side during initialization
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey) as ThemeMode;
        if (
          stored &&
          (stored === 'light' || stored === 'dark' || stored === 'system')
        ) {
          return stored;
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }
    return defaultMode;
  });

  const [mounted, setMounted] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemPreference = () => {
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    };

    // Set initial system preference
    updateSystemPreference();

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference);
    };
  }, []);

  // Set mounted to true after first render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save to localStorage when mode changes (only after mounted)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, mode);
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }, [mode, mounted, storageKey]);

  // Calculate resolved theme (what theme is actually applied)
  const resolvedTheme: ResolvedTheme =
    mode === 'system' ? systemPreference : mode;

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // For SSR compatibility, use default theme initially
  const effectiveMode = mounted ? mode : defaultMode;
  const effectiveResolvedTheme = mounted
    ? resolvedTheme
    : defaultMode === 'system'
    ? 'light'
    : defaultMode;
  const effectiveThemeClass =
    effectiveResolvedTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        mode: effectiveMode,
        resolvedTheme: effectiveResolvedTheme,
        toggleTheme,
        setTheme,
        systemPreference,
      }}
    >
      <div className={effectiveThemeClass}>{children}</div>
    </ThemeContext.Provider>
  );
};
