'use client';
import React, { useEffect } from 'react';

import { ThemeProvider as BaseThemeProvider, useTheme } from '.';

import {
  themeTransitionAnimation,
  glowPulseAnimation,
  cyberpunkFlickerAnimation,
  matrixRainAnimation,
  hologramScanAnimation,
  themeSpecificStyles,
} from '../themes/theme-animations.css';

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  persistTheme?: boolean;
  storageKey?: string;
  enableAnimations?: boolean;
  enableThemeEffects?: boolean;
}

const ThemeEffectsWrapper: React.FC<{
  children: React.ReactNode;
  enableAnimations: boolean;
  enableThemeEffects: boolean;
}> = ({ children, enableAnimations, enableThemeEffects }) => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!enableThemeEffects) return;

    const body = document.body;

    // Remove all theme classes
    body.classList.remove(
      'theme-cyberpunk',
      'theme-matrix',
      'theme-hologram',
      'theme-retro',
      'theme-scifi'
    );

    // Add current theme class
    body.classList.add(`theme-${currentTheme.toLowerCase()}`);

    // Add theme-specific effects
    if (enableAnimations) {
      switch (currentTheme) {
        case 'cyberpunk':
          body.classList.add(cyberpunkFlickerAnimation);
          break;
        case 'matrix':
          // body.classList.add(matrixRainAnimation);
          break;
        case 'hologram':
          body.classList.add(hologramScanAnimation);
          break;
        default:
          break;
      }
    }

    return () => {
      body.classList.remove(
        cyberpunkFlickerAnimation,
        matrixRainAnimation,
        hologramScanAnimation,
        'theme-cyberpunk',
        'theme-matrix',
        'theme-hologram',
        'theme-retro',
        'theme-scifi'
      );
    };
  }, [currentTheme, enableAnimations]);

  return (
    <div className={enableAnimations ? themeTransitionAnimation : undefined}>
      {children}
    </div>
  );
};

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  defaultTheme = 'cyberpunk',
  persistTheme = true,
  storageKey = 'augmented-ui-theme',
  enableAnimations = true,
  enableThemeEffects = true,
}) => {
  return (
    <BaseThemeProvider
      defaultTheme={defaultTheme as any}
      persistTheme={persistTheme}
      storageKey={storageKey}
    >
      <ThemeEffectsWrapper
        enableAnimations={enableAnimations}
        enableThemeEffects={enableThemeEffects}
      >
        {children}
      </ThemeEffectsWrapper>
    </BaseThemeProvider>
  );
};
