'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { ColorModeProvider, useColorMode } from './color-mode-context';
import { createThemeFromOptions } from '../theme';
import { EnhancedThemeOption, ColorMode } from '../types';

interface EnhancedThemeContextType {
  themes: EnhancedThemeOption[];
  currentThemeId: string;
  currentTheme: EnhancedThemeOption | null;
  muiTheme: Theme;
  changeTheme: (themeId: string) => void;
  isHydrated: boolean;
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | null>(
  null
);

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error(
      'useEnhancedTheme must be used within EnhancedThemeProvider'
    );
  }
  return context;
};

// Inner provider that has access to ColorMode context
const EnhancedThemeProviderInner: React.FC<{
  children: React.ReactNode;
  themes: EnhancedThemeOption[];
  defaultThemeId: string;
  themeStorageKey: string;
}> = ({ children, themes, defaultThemeId, themeStorageKey }) => {
  const { resolvedMode } = useColorMode();
  const [currentThemeId, setCurrentThemeId] = useState(defaultThemeId);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(themeStorageKey);
        if (saved && themes.find((t) => t.id === saved)) {
          setCurrentThemeId(saved);
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      }
      setIsHydrated(true);
    }
  }, [themeStorageKey, themes]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(themeStorageKey, themeId);
        } catch (error) {
          console.warn('Failed to save theme to storage:', error);
        }
      }
    }
  };

  const currentTheme = themes.find((t) => t.id === currentThemeId) || themes[0];

  // Create MUI theme based on current theme and resolved mode
  const muiTheme = React.useMemo(() => {
    if (!currentTheme) return createThemeFromOptions({});

    const palette =
      resolvedMode === 'dark'
        ? currentTheme.darkPalette
        : currentTheme.lightPalette;

    return createThemeFromOptions({ palette });
  }, [currentTheme, resolvedMode]);

  const contextValue: EnhancedThemeContextType = {
    themes,
    currentThemeId,
    currentTheme,
    muiTheme,
    changeTheme,
    isHydrated,
  };

  return (
    <EnhancedThemeContext.Provider value={contextValue}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </EnhancedThemeContext.Provider>
  );
};

// Main provider that sets up both color mode and theme contexts
interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  themes: EnhancedThemeOption[];
  defaultThemeId: string;
  defaultColorMode?: ColorMode;
  themeStorageKey?: string;
  colorModeStorageKey?: string;
}

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  themes,
  defaultThemeId,
  defaultColorMode = 'system',
  themeStorageKey = 'app-theme',
  colorModeStorageKey = 'color-mode',
}) => {
  return (
    <ColorModeProvider
      storageKey={colorModeStorageKey}
      defaultMode={defaultColorMode}
    >
      <EnhancedThemeProviderInner
        themes={themes}
        defaultThemeId={defaultThemeId}
        themeStorageKey={themeStorageKey}
      >
        {children}
      </EnhancedThemeProviderInner>
    </ColorModeProvider>
  );
};
