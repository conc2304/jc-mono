// styles/theme-animations.css.ts
import { style, keyframes, globalStyle } from '@vanilla-extract/css';

import { augmentedTheme } from '../contract.css';

// Global theme transition styles
globalStyle('*', {
  transition: `color ${augmentedTheme.augmented.animationDuration} ease, background-color ${augmentedTheme.augmented.animationDuration} ease`,
});

globalStyle('[data-augmented-ui]', {
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,
});

// Theme switching animations
const themeTransition = keyframes({
  '0%': {
    opacity: 0.8,
    transform: 'scale(0.98)',
  },
  '50%': {
    opacity: 0.9,
    transform: 'scale(1.01)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
});

export const themeTransitionAnimation = style({
  animation: `${themeTransition} ${augmentedTheme.augmented.animationDuration} ease-out`,
});

// Glow pulse animation
const glowPulse = keyframes({
  '0%': {
    filter: `drop-shadow(0 0 5px ${augmentedTheme.colors.primary})`,
  },
  '50%': {
    filter: `drop-shadow(0 0 20px ${augmentedTheme.colors.primary}) drop-shadow(0 0 30px ${augmentedTheme.colors.primary})`,
  },
  '100%': {
    filter: `drop-shadow(0 0 5px ${augmentedTheme.colors.primary})`,
  },
});

export const glowPulseAnimation = style({
  animation: `${glowPulse} 2s ease-in-out infinite`,
});

// Cyberpunk flicker effect
const cyberpunkFlicker = keyframes({
  '0%': { opacity: 1 },
  '98%': { opacity: 1 },
  '99%': { opacity: 0.8 },
  '100%': { opacity: 1 },
});

export const cyberpunkFlickerAnimation = style({
  animation: `${cyberpunkFlicker} 3s linear infinite`,
});

// Matrix rain effect (for matrix theme)
const matrixRain = keyframes({
  '0%': {
    transform: 'translateY(-100vh)',
    opacity: 0,
  },
  '10%': {
    opacity: 1,
  },
  '90%': {
    opacity: 1,
  },
  '100%': {
    transform: 'translateY(100vh)',
    opacity: 0,
  },
});

export const matrixRainAnimation = style({
  animation: `${matrixRain} 4s linear infinite`,
});

// Hologram scan lines
const hologramScan = keyframes({
  '0%': {
    backgroundPosition: '0% 0%',
  },
  '100%': {
    backgroundPosition: '0% 100%',
  },
});

export const hologramScanAnimation = style({
  position: 'relative',
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      ${augmentedTheme.colors.primary}22 2px,
      ${augmentedTheme.colors.primary}22 4px
    )`,
    animation: `${hologramScan} 2s linear infinite`,
    pointerEvents: 'none',
  },
});

// Theme-specific component styles
export const themeSpecificStyles = {
  cyberpunk: style({
    vars: {
      '--theme-glow': `0 0 20px ${augmentedTheme.colors.primary}`,
      '--theme-text-shadow': `0 0 10px ${augmentedTheme.colors.primary}`,
    },
    textShadow: 'var(--theme-text-shadow)',
    boxShadow: 'var(--theme-glow)',
  }),

  matrix: style({
    vars: {
      '--theme-glow': `0 0 15px ${augmentedTheme.colors.primary}`,
      '--theme-text-shadow': `0 0 5px ${augmentedTheme.colors.primary}`,
    },
    textShadow: 'var(--theme-text-shadow)',
    fontFamily: 'monospace',
  }),

  hologram: style({
    vars: {
      '--theme-glow': `0 0 25px ${augmentedTheme.colors.primary}`,
    },
    backdropFilter: 'blur(1px)',
    boxShadow: 'var(--theme-glow)',
  }),

  retro: style({
    vars: {
      '--theme-glow': `0 0 30px ${augmentedTheme.colors.primary}`,
    },
    textShadow: `2px 2px 0px ${augmentedTheme.colors.background}`,
    boxShadow: 'var(--theme-glow)',
  }),

  sciFi: style({
    vars: {
      '--theme-glow': `0 0 10px ${augmentedTheme.colors.primary}`,
    },
    boxShadow: 'var(--theme-glow)',
  }),
};
