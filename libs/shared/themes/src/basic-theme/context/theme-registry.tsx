// components/ThemeRegistry.tsx
'use client'; // For Next.js 13+ App Router

import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Emotion } from '@emotion/react';

import { ThemeOption } from './ThemeSwitcher';

// ============================================
// NEXT.JS APP ROUTER LAYOUT SETUP
// ============================================

// app/layout.tsx (for App Router)
import ThemeSwitcher from './ThemeSwitcher';

import { ThemeContextProvider } from '@/components/ThemeRegistry';
import { ThemeContextProvider } from '@/components/ThemeRegistry';
import { useAppTheme } from '@/components/ThemeRegistry';
import { availableThemes } from '@/lib/themes';

// ============================================
// PAGES ROUTER SETUP (_app.tsx)
// ============================================

// pages/_app.tsx (for Pages Router)
import { availableThemes } from '@/lib/themes';
import type { AppProps } from 'next/app';

interface ThemeRegistryProps {
  children: React.ReactNode;
  defaultThemes: ThemeOption[];
  defaultThemeId: string;
  storageKey?: string;
}

// Safe localStorage access for Next.js
const getStoredTheme = (
  key: string,
  themes: ThemeOption[],
  defaultId: string
): string => {
  if (typeof window === 'undefined') return defaultId;

  try {
    const stored = localStorage.getItem(key);
    if (stored && themes.find((t) => t.id === stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return defaultId;
};

export default function ThemeRegistry({
  children,
  defaultThemes,
  defaultThemeId,
  storageKey = 'app-theme',
}: ThemeRegistryProps) {
  const [currentThemeId, setCurrentThemeId] = useState(defaultThemeId);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and load saved theme
  useEffect(() => {
    const savedThemeId = getStoredTheme(
      storageKey,
      defaultThemes,
      defaultThemeId
    );
    setCurrentThemeId(savedThemeId);
    setIsHydrated(true);
  }, [defaultThemes, defaultThemeId, storageKey]);

  const currentTheme = defaultThemes.find((t) => t.id === currentThemeId);
  const muiTheme = currentTheme
    ? createTheme(currentTheme.palette)
    : createTheme();

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

// ============================================
// THEME CONTEXT FOR GLOBAL THEME MANAGEMENT
// ============================================

interface ThemeContextType {
  themes: ThemeOption[];
  currentThemeId: string;
  currentTheme: ThemeOption | null;
  changeTheme: (themeId: string) => void;
  isHydrated: boolean;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export const useAppTheme = () => {
  const context = React.useContext(ThemeContext);
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
    ? createTheme(currentTheme.palette)
    : createTheme();

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider
          themes={availableThemes}
          defaultThemeId="neon-cyberpunk"
          storageKey="my-app-theme"
        >
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider
      themes={availableThemes}
      defaultThemeId="neon-cyberpunk"
      storageKey="my-app-theme"
    >
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}

// ============================================
// USAGE IN COMPONENTS
// ============================================

// components/Header.tsx
('use client');

export default function Header() {
  const { themes, currentThemeId, changeTheme } = useAppTheme();

  return (
    <header>
      <ThemeSwitcher
        themes={themes}
        selectedThemeId={currentThemeId}
        onThemeChange={(themeId) => changeTheme(themeId)}
        groupByCategory={true}
        showPreview={true}
      />
    </header>
  );
}

// ============================================
// AVOIDING HYDRATION MISMATCHES
// ============================================

// Optional: Component that only renders after hydration
export const ClientOnly: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // or a loading skeleton
  }

  return <>{children}</>;
};

// Usage:
// <ClientOnly>
//   <ThemeSwitcher ... />
// </ClientOnly>
