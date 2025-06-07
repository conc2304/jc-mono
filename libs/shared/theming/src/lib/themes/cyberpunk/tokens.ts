import { cyberpunkPalette } from '../../foundations/colors/palettes/cyberpunk';
import { ColorTokens, ThemeTokens } from '../types';

const colors: ColorTokens = {
  // Semantic mappings
  primary: cyberpunkPalette.primary[500],
  primaryHover: cyberpunkPalette.primary[400],
  primaryActive: cyberpunkPalette.primary[600],

  secondary: cyberpunkPalette.neon.cyan,
  secondaryHover: cyberpunkPalette.neon.blue,
  secondaryActive: cyberpunkPalette.neon.yellow,

  accent: cyberpunkPalette.neon.magenta,

  // Status colors
  success: cyberpunkPalette.neon.green,
  warning: cyberpunkPalette.neon.yellow,
  error: cyberpunkPalette.neon.red,
  info: cyberpunkPalette.neon.blue,

  // Surface colors
  background: cyberpunkPalette.neutral[50],
  backgroundSecondary: cyberpunkPalette.neutral[100],
  surface: cyberpunkPalette.neutral[300],
  surfaceHover: cyberpunkPalette.neutral[400],

  // Text colors
  textPrimary: cyberpunkPalette.neutral[1000],
  textSecondary: cyberpunkPalette.neutral[900],
  textMuted: cyberpunkPalette.neutral[800],
  textOnPrimary: cyberpunkPalette.neutral[0],

  // Border colors
  border: cyberpunkPalette.primary[500],
  borderSecondary: cyberpunkPalette.neon.cyan,
  borderMuted: cyberpunkPalette.neutral[600],
};

export const cyberpunkTokens: ThemeTokens = {
  colors,
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: '"Orbitron", "Exo 2", monospace',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  effects: {
    glow: {
      color: '#FF0055',
      intensity: 6,
      spread: 3,
    },
    bevel: {
      size: 16,
      angle: 45,
    },
  },
};
