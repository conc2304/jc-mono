// theme-provider.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import {
  defaultLightTheme,
  defaultDarkTheme,
  blueLight,
  blueDark,
} from '../../themes';

export type ThemeVariant = 'default' | 'blue';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  variant: ThemeVariant;

  mode: ThemeMode;

  resolvedTheme: ResolvedTheme;

  systemPreference: ResolvedTheme;

  // Functions to update theme
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void; // Toggles between light/dark for current variant

  availableVariants: ThemeVariant[];

  // Current theme class name for vanilla-extract
  currentThemeClass: string;
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

// Theme class mapping
const themeClasses = {
  blue: {
    light: blueLight,
    dark: blueDark,
  },
  default: {
    light: defaultLightTheme,
    dark: defaultDarkTheme,
  },
} as const;

interface ThemeProviderProps {
  children: ReactNode;
  defaultVariant?: ThemeVariant;
  defaultMode?: ThemeMode;
  variantStorageKey?: string;
  modeStorageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = 'default',
  defaultMode = 'system',
  variantStorageKey = 'theme-variant',
  modeStorageKey = 'theme-mode',
}) => {
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(
    () => {
      return getSystemPreference();
    }
  );

  const [variant, setVariantState] = useState<ThemeVariant>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(variantStorageKey) as ThemeVariant;
        if (stored && ['blue', 'default'].includes(stored)) {
          return stored;
        }
      } catch (error) {
        console.warn('Failed to read variant from localStorage:', error);
      }
    }
    return defaultVariant;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(modeStorageKey) as ThemeMode;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored;
        }
      } catch (error) {
        console.warn('Failed to read mode from localStorage:', error);
      }
    }
    return defaultMode;
  });

  const [mounted, setMounted] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemPreference = () => {
      const newPreference = getSystemPreference();
      setSystemPreference(newPreference);
    };

    updateSystemPreference();
    mediaQuery.addEventListener('change', updateSystemPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(variantStorageKey, variant);
      } catch (error) {
        console.warn('Failed to save variant to localStorage:', error);
      }
    }
  }, [variant, mounted, variantStorageKey]);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(modeStorageKey, mode);
      } catch (error) {
        console.warn('Failed to save mode to localStorage:', error);
      }
    }
  }, [mode, mounted, modeStorageKey]);

  const resolvedTheme: ResolvedTheme =
    mode === 'system' ? systemPreference : mode;

  // Theme management functions
  const setVariant = (newVariant: ThemeVariant) => {
    setVariantState(newVariant);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // If system, toggle to opposite of current system preference
      return systemPreference === 'dark' ? 'light' : 'dark';
    });
  };

  // Compute effective values for SSR
  const effectiveVariant = mounted ? variant : defaultVariant;
  const effectiveMode = mounted ? mode : defaultMode;
  const effectiveResolvedTheme = mounted
    ? resolvedTheme
    : defaultMode === 'system'
    ? 'light'
    : defaultMode;

  // Get current theme class
  const currentThemeClass =
    themeClasses[effectiveVariant][effectiveResolvedTheme];

  const availableVariants: ThemeVariant[] = ['blue', 'default'];

  return (
    <ThemeContext.Provider
      value={{
        variant: effectiveVariant,
        mode: effectiveMode,
        resolvedTheme: effectiveResolvedTheme,
        systemPreference,
        setVariant,
        setMode,
        toggleMode,
        availableVariants,
        currentThemeClass,
      }}
    >
      <div className={currentThemeClass}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Convenience hooks for specific theme management
export const useThemeVariant = () => {
  const { variant, setVariant, availableVariants } = useTheme();
  return { variant, setVariant, availableVariants };
};

export const useThemeMode = () => {
  const { mode, resolvedTheme, setMode, toggleMode, systemPreference } =
    useTheme();
  return { mode, resolvedTheme, setMode, toggleMode, systemPreference };
};
