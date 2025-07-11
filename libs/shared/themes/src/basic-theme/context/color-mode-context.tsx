'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

import { ColorMode } from '../types';

interface ColorModeContextType {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  resolvedMode: 'light' | 'dark'; // The actual mode being used
  systemMode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType | null>(null);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within ColorModeProvider');
  }
  return context;
};

interface ColorModeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  defaultMode?: ColorMode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({
  children,
  storageKey = 'color-mode',
  defaultMode = 'system',
}) => {
  const systemMode = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';
  const [mode, setModeState] = useState<ColorMode>(defaultMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved mode on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey) as ColorMode;
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          setModeState(saved);
        }
      } catch (error) {
        console.warn('Failed to load color mode from storage:', error);
      }
      setIsHydrated(true);
    }
  }, [storageKey]);

  // Save mode when it changes
  const setMode = (newMode: ColorMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, newMode);
      } catch (error) {
        console.warn('Failed to save color mode to storage:', error);
      }
    }
  };

  // Resolve the actual mode (system -> light/dark)
  const resolvedMode: 'light' | 'dark' = mode === 'system' ? systemMode : mode;

  const value: ColorModeContextType = {
    mode,
    setMode,
    resolvedMode,
    systemMode,
  };

  if (!isHydrated) {
    // Return with default resolved mode to prevent hydration mismatch
    const defaultResolvedMode =
      defaultMode === 'system' ? systemMode : (defaultMode as 'light' | 'dark');
    return (
      <ColorModeContext.Provider
        value={{
          mode: defaultMode,
          setMode,
          resolvedMode: defaultResolvedMode,
          systemMode,
        }}
      >
        {children}
      </ColorModeContext.Provider>
    );
  }

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};
