'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';

import { themes } from '../themes/themes';
import { ThemeConfig } from '../themes/types';

import { augmentedTheme } from '../contract.css';

export type ThemeName = keyof typeof themes;

interface ThemeContextType {
  currentTheme: ThemeName;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  customTheme: Partial<ThemeConfig> | null;
  setCustomTheme: (theme: Partial<ThemeConfig> | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  persistTheme?: boolean;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = Object.keys(themes)[0],
  persistTheme = true,
  storageKey = 'augmented-ui-theme',
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);
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

      if (savedTheme && savedTheme in themes) {
        setCurrentTheme(savedTheme as ThemeName);
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
  }, [persistTheme, storageKey]);

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

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    setCustomTheme(null); // Clear custom theme when selecting preset
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Merge custom theme with base theme
  const getActiveThemeConfig = (): ThemeConfig => {
    const baseTheme = themes[currentTheme];

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

  const themeConfig = getActiveThemeConfig();

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

  const contextValue: ThemeContextType = {
    currentTheme,
    themeConfig,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeName[],
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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
