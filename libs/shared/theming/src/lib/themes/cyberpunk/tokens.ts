import { cyberpunkPalette } from '../../foundations/colors/palettes/cyberpunk';

export const cyberpunkTokens = {
  colors: {
    // Semantic mappings
    primary: cyberpunkPalette.primary[500],
    primaryHover: cyberpunkPalette.primary[400],
    primaryActive: cyberpunkPalette.primary[600],

    secondary: cyberpunkPalette.neon.cyan,
    secondaryHover: cyberpunkPalette.neon.blue,

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
  },
};
