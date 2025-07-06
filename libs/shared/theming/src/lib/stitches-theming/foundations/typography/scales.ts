/**
 * Typography scales following a consistent mathematical progression
 * Based on a 1.125 (major second) ratio for harmonious visual hierarchy
 */
export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px - base font size
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px
} as const;

export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',

  // Specific to font sizes for better control
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
} as const;

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Semantic typography styles for common use cases
export const semanticTypography = {
  // Headings
  headings: {
    h1: {
      fontSize: fontSizes['5xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacings.tight,
    },
    h2: {
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacings.tight,
    },
    h3: {
      fontSize: fontSizes['3xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.snug,
      letterSpacing: letterSpacings.normal,
    },
    h4: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.snug,
      letterSpacing: letterSpacings.normal,
    },
    h5: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    h6: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
      letterSpacing: letterSpacings.normal,
    },
    base: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
  },

  // Labels and UI text
  labels: {
    large: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    base: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.wide,
    },
  },

  // Code and monospace
  code: {
    inline: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    block: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
      letterSpacing: letterSpacings.normal,
    },
  },

  // Captions and supporting text
  captions: {
    large: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
    base: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacings.normal,
    },
  },
} as const;

export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacings;
export type SemanticTypographyCategory = keyof typeof semanticTypography;
