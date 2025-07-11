'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { getStoredTheme } from '../../utils';
import { createThemeFromOptions } from '../theme';
import { ThemeOption } from '../types';

interface ThemeContextType {
  themes: ThemeOption[];
  currentThemeId: string;
  currentTheme: ThemeOption | null;
  changeTheme: (themeId: string) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: React.ReactNode;
  themes: ThemeOption[];
  defaultThemeId: string;
  storageKey?: string;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
  themes,
  defaultThemeId,
  storageKey = 'app-theme',
}) => {
  const [currentThemeId, setCurrentThemeId] = useState(defaultThemeId);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedThemeId = getStoredTheme(storageKey, themes, defaultThemeId);
    setCurrentThemeId(savedThemeId);
    setIsHydrated(true);
  }, [themes, defaultThemeId, storageKey]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, themeId);
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error);
        }
      }
    }
  };

  const currentTheme = themes.find((t) => t.id === currentThemeId) || null;
  const muiTheme = currentTheme
    ? createThemeFromOptions({ palette: currentTheme.palette })
    : createThemeFromOptions({});

  const contextValue: ThemeContextType = {
    themes,
    currentThemeId,
    currentTheme,
    changeTheme,
    isHydrated,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext.Provider>
  );
};
