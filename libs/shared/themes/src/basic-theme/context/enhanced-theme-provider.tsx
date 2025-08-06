'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, Theme } from '@mui/material/styles';

import { ColorModeProvider, useColorMode } from './color-mode-context';
import { createThemeFromOptions } from '../theme';
import { EnhancedThemeOption, ColorMode } from '../types';

interface EnhancedThemeContextType {
  themes: EnhancedThemeOption[];
  currentThemeId: string;
  currentTheme: EnhancedThemeOption | null;
  muiTheme: Theme;
  changeTheme: (themeId: string) => void;
  addTheme: (theme: EnhancedThemeOption) => void;
  removeTheme: (themeId: string) => void;
  updateTheme: (
    themeId: string,
    updatedTheme: Partial<EnhancedThemeOption>
  ) => void;
  resetToDefaultThemes: () => void;
  exportThemes: () => string;
  importThemes: (themesJson: string) => boolean;
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
  initialThemes: EnhancedThemeOption[];
  defaultThemeId: string;
  themeStorageKey: string;
  themesStorageKey: string;
}> = ({
  children,
  initialThemes,
  defaultThemeId,
  themeStorageKey,
  themesStorageKey,
}) => {
  const { resolvedMode } = useColorMode();
  const [themes, setThemes] = useState<EnhancedThemeOption[]>(initialThemes);
  const [currentThemeId, setCurrentThemeId] = useState(defaultThemeId);
  const [isHydrated, setIsHydrated] = useState(false);

  // Save themes to localStorage whenever themes change
  const saveThemesToStorage = useCallback(
    (themesToSave: EnhancedThemeOption[]) => {
      if (typeof window !== 'undefined') {
        try {
          // Only save custom themes (not default ones)
          const customThemes = themesToSave.filter(
            (theme) => !initialThemes.some((initial) => initial.id === theme.id)
          );
          localStorage.setItem(themesStorageKey, JSON.stringify(customThemes));
        } catch (error) {
          console.warn('Failed to save themes to storage:', error);
        }
      }
    },
    [themesStorageKey, initialThemes]
  );

  // Load saved themes and current theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load custom themes
        const savedThemes = localStorage.getItem(themesStorageKey);
        if (savedThemes) {
          const customThemes: EnhancedThemeOption[] = JSON.parse(savedThemes);
          // Merge with initial themes, avoiding duplicates
          const mergedThemes = [...initialThemes];
          customThemes.forEach((customTheme) => {
            if (!mergedThemes.some((theme) => theme.id === customTheme.id)) {
              mergedThemes.push(customTheme);
            }
          });
          setThemes(mergedThemes);
        }

        // Load current theme
        const savedCurrentTheme = localStorage.getItem(themeStorageKey);
        if (savedCurrentTheme) {
          // Check if the saved theme exists in our themes
          const themeExists = [
            ...initialThemes,
            ...(savedThemes ? JSON.parse(savedThemes) : []),
          ].some((t) => t.id === savedCurrentTheme);
          if (themeExists) {
            setCurrentThemeId(savedCurrentTheme);
          }
        }
      } catch (error) {
        console.warn('Failed to load themes from storage:', error);
      }
      setIsHydrated(true);
    }
  }, [themeStorageKey, themesStorageKey, initialThemes]);

  const changeTheme = useCallback(
    (themeId: string) => {
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
    },
    [themes, themeStorageKey]
  );

  const addTheme = useCallback(
    (theme: EnhancedThemeOption) => {
      setThemes((prevThemes) => {
        // Check if theme with this ID already exists
        const existingIndex = prevThemes.findIndex((t) => t.id === theme.id);
        let newThemes: EnhancedThemeOption[];

        if (existingIndex !== -1) {
          // Replace existing theme
          newThemes = [...prevThemes];
          newThemes[existingIndex] = theme;
        } else {
          // Add new theme
          newThemes = [...prevThemes, theme];
        }

        saveThemesToStorage(newThemes);
        return newThemes;
      });
    },
    [saveThemesToStorage]
  );

  const removeTheme = useCallback(
    (themeId: string) => {
      // Don't allow removal of initial themes
      const isInitialTheme = initialThemes.some(
        (theme) => theme.id === themeId
      );
      if (isInitialTheme) {
        console.warn('Cannot remove default theme:', themeId);
        return;
      }

      setThemes((prevThemes) => {
        const newThemes = prevThemes.filter((theme) => theme.id !== themeId);
        saveThemesToStorage(newThemes);
        return newThemes;
      });

      // If we're removing the current theme, switch to the default
      if (currentThemeId === themeId) {
        changeTheme(defaultThemeId);
      }
    },
    [
      initialThemes,
      saveThemesToStorage,
      currentThemeId,
      defaultThemeId,
      changeTheme,
    ]
  );

  const updateTheme = useCallback(
    (themeId: string, updatedTheme: Partial<EnhancedThemeOption>) => {
      setThemes((prevThemes) => {
        const newThemes = prevThemes.map((theme) =>
          theme.id === themeId
            ? { ...theme, ...updatedTheme, id: themeId } // Ensure ID doesn't change
            : theme
        );
        saveThemesToStorage(newThemes);
        return newThemes;
      });
    },
    [saveThemesToStorage]
  );

  const resetToDefaultThemes = useCallback(() => {
    setThemes(initialThemes);
    setCurrentThemeId(defaultThemeId);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(themesStorageKey);
        localStorage.setItem(themeStorageKey, defaultThemeId);
      } catch (error) {
        console.warn('Failed to reset themes in storage:', error);
      }
    }
  }, [initialThemes, defaultThemeId, themeStorageKey, themesStorageKey]);

  const exportThemes = useCallback(() => {
    const exportData = {
      themes: themes,
      currentThemeId: currentThemeId,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  }, [themes, currentThemeId]);

  const importThemes = useCallback(
    (themesJson: string) => {
      try {
        const importData = JSON.parse(themesJson);

        // Validate the import data structure
        if (!importData.themes || !Array.isArray(importData.themes)) {
          console.error('Invalid themes data structure');
          return false;
        }

        // Validate each theme has required properties
        const validThemes = importData.themes.filter((theme: any) => {
          return (
            theme.id && theme.name && theme.lightPalette && theme.darkPalette
          );
        });

        if (validThemes.length === 0) {
          console.error('No valid themes found in import data');
          return false;
        }

        // Merge with existing themes, replacing duplicates
        setThemes((prevThemes) => {
          const mergedThemes = [...initialThemes]; // Start with initial themes

          // Add existing custom themes that aren't being replaced
          prevThemes.forEach((theme) => {
            if (
              !initialThemes.some((initial) => initial.id === theme.id) &&
              !validThemes.some(
                (imported: EnhancedThemeOption) => imported.id === theme.id
              )
            ) {
              mergedThemes.push(theme);
            }
          });

          // Add imported themes
          validThemes.forEach((theme: EnhancedThemeOption) => {
            mergedThemes.push(theme);
          });

          saveThemesToStorage(mergedThemes);
          return mergedThemes;
        });

        // If import data includes a current theme, try to set it
        if (
          importData.currentThemeId &&
          validThemes.some(
            (theme: EnhancedThemeOption) =>
              theme.id === importData.currentThemeId
          )
        ) {
          changeTheme(importData.currentThemeId);
        }

        return true;
      } catch (error) {
        console.error('Failed to import themes:', error);
        return false;
      }
    },
    [initialThemes, saveThemesToStorage, changeTheme]
  );

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
    addTheme,
    removeTheme,
    updateTheme,
    resetToDefaultThemes,
    exportThemes,
    importThemes,
    isHydrated,
  };

  return (
    <EnhancedThemeContext.Provider value={contextValue}>
      {/* <AppRouterCacheProvider> */}
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      {/* </AppRouterCacheProvider> */}
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
  themesStorageKey?: string;
  colorModeStorageKey?: string;
}

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  themes,
  defaultThemeId,
  defaultColorMode = 'system',
  themeStorageKey = 'app-theme',
  themesStorageKey = 'app-custom-themes',
  colorModeStorageKey = 'color-mode',
}) => {
  return (
    <ColorModeProvider
      storageKey={colorModeStorageKey}
      defaultMode={defaultColorMode}
    >
      <EnhancedThemeProviderInner
        initialThemes={themes}
        defaultThemeId={defaultThemeId}
        themeStorageKey={themeStorageKey}
        themesStorageKey={themesStorageKey}
      >
        {children}
      </EnhancedThemeProviderInner>
    </ColorModeProvider>
  );
};
