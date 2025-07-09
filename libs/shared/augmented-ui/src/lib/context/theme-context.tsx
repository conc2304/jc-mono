'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { ThemeConfig } from '../themes/types';

import { augmentedTheme } from '../contract.css';

interface ThemeContextType<T extends Record<string, ThemeConfig>> {
  currentTheme: keyof T;
  themeConfig: ThemeConfig;
  setTheme: (theme: keyof T) => void;
  availableThemes: (keyof T)[];
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  customTheme: Partial<ThemeConfig> | null;
  setCustomTheme: (theme: Partial<ThemeConfig> | null) => void;
}

const ThemeContext = createContext<ThemeContextType<any> | undefined>(
  undefined
);

interface ThemeProviderProps<T extends Record<string, ThemeConfig>> {
  children: ReactNode;
  defaultTheme?: keyof T;
  persistTheme?: boolean;
  storageKey?: string;
  availableThemes: T;
}

export const ThemeProvider = <T extends Record<string, ThemeConfig>>({
  children,
  defaultTheme,
  persistTheme = true,
  storageKey = 'augmented-ui-theme',
  availableThemes,
}: ThemeProviderProps<T>) => {
  const fallbackThemeName = Object.keys(availableThemes)[0];
  const [currentTheme, setCurrentTheme] = useState<keyof T>(
    defaultTheme || fallbackThemeName
  );
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig> | null>(
    null
  );

  // Load theme from localStorage on mount
  useEffect(() => {
    if (persistTheme && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(storageKey);
      const savedDarkMode = localStorage.getItem(`${storageKey}-dark`);
      const savedCustomTheme = localStorage.getItem(`${storageKey}-custom`);

      if (savedTheme && savedTheme in availableThemes) {
        setCurrentTheme(savedTheme);
      }

      if (savedDarkMode) {
        setIsDarkMode(savedDarkMode === 'true');
      }

      if (savedCustomTheme) {
        try {
          setCustomTheme(JSON.parse(savedCustomTheme));
        } catch (e) {
          console.warn('Failed to parse custom theme from storage');
        }
      }
    }
  }, [persistTheme, storageKey, availableThemes]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (persistTheme && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, currentTheme.toString());
      localStorage.setItem(`${storageKey}-dark`, isDarkMode.toString());

      if (customTheme) {
        localStorage.setItem(
          `${storageKey}-custom`,
          JSON.stringify(customTheme)
        );
      } else {
        localStorage.removeItem(`${storageKey}-custom`);
      }
    }
  }, [currentTheme, isDarkMode, customTheme, persistTheme, storageKey]);

  const setTheme = (theme: keyof T) => {
    setCurrentTheme(theme);
    setCustomTheme(null); // Clear custom theme when selecting preset
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Merge custom theme with base theme
  const getActiveThemeConfig = (availableThemes: T): ThemeConfig => {
    const baseTheme = availableThemes[currentTheme];

    if (!customTheme) {
      return baseTheme;
    }

    // Deep merge custom theme with base theme
    return {
      colors: { ...baseTheme.colors, ...customTheme.colors },
      spacing: { ...baseTheme.spacing, ...customTheme.spacing },
      augmented: { ...baseTheme.augmented, ...customTheme.augmented },
      gradients: { ...baseTheme.gradients, ...customTheme.gradients },
    };
  };

  const themeConfig = getActiveThemeConfig(availableThemes);

  // Apply theme variables to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const themeVars = assignInlineVars(augmentedTheme, themeConfig);

      // Apply CSS variables to the document root
      Object.entries(themeVars).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });

      // Apply dark mode class
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.documentElement.setAttribute(
        'data-theme',
        currentTheme.toString()
      );
    }
  }, [themeConfig, isDarkMode, currentTheme]);

  const contextValue: ThemeContextType<T> = {
    currentTheme,
    themeConfig,
    setTheme,
    availableThemes: Object.keys(availableThemes) as (keyof T)[],
    isDarkMode,
    setDarkMode,
    customTheme,
    setCustomTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = <T extends Record<string, ThemeConfig>>() => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context as ThemeContextType<T>;
};
