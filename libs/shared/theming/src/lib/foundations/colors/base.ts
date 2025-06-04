export const colorUtils = {
  // Utility functions for color manipulation
  alpha: (color: string, alpha: number) =>
    `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')}`,

  // Common color categories that all themes should define
  semanticColors: [
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'error',
    'info',
  ] as const,

  // Common surface colors
  surfaceColors: [
    'background',
    'surface',
    'surfaceVariant',
    'outline',
  ] as const,

  // Common text colors
  textColors: [
    'onBackground',
    'onSurface',
    'onPrimary',
    'onSecondary',
  ] as const,
};

export type SemanticColor = (typeof colorUtils.semanticColors)[number];
export type SurfaceColor = (typeof colorUtils.surfaceColors)[number];
export type TextColor = (typeof colorUtils.textColors)[number];
