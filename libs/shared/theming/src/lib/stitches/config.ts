import { createStitches } from '@stitches/react';
import { cyberpunkTokens } from '../themes/cyberpunk/tokens';
import { corporateTokens } from '../themes/corporate/tokens';
import { breakpoints, spacing, typography } from '../foundations';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: cyberpunkTokens.colors,
    fonts: typography.fontFamilies,
    fontSizes: typography.fontSizes,
    fontWeights: typography.fontWeights,
    lineHeights: typography.lineHeights,
    letterSpacings: typography.letterSpacings,
    space: spacing,
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
  },
  media: breakpoints,
  utils: {
    // Spacing utilities
    p: (value: any) => ({ padding: value }),
    pt: (value: any) => ({ paddingTop: value }),
    pr: (value: any) => ({ paddingRight: value }),
    pb: (value: any) => ({ paddingBottom: value }),
    pl: (value: any) => ({ paddingLeft: value }),
    px: (value: any) => ({ paddingLeft: value, paddingRight: value }),
    py: (value: any) => ({ paddingTop: value, paddingBottom: value }),

    m: (value: any) => ({ margin: value }),
    mt: (value: any) => ({ marginTop: value }),
    mr: (value: any) => ({ marginRight: value }),
    mb: (value: any) => ({ marginBottom: value }),
    ml: (value: any) => ({ marginLeft: value }),
    mx: (value: any) => ({ marginLeft: value, marginRight: value }),
    my: (value: any) => ({ marginTop: value, marginBottom: value }),

    // Size utilities
    size: (value: any) => ({ width: value, height: value }),

    // Cyberpunk specific utilities
    glow: (color: string) => ({
      filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color})`,
    }),
    neonBorder: (color: string) => ({
      border: `1px solid ${color}`,
      boxShadow: `0 0 10px ${color}`,
    }),
  },
});

// Create theme variants
export const corporateTheme = createTheme('corporate', {
  colors: corporateTokens.colors,
  fonts: typography.fontFamilies,
  fontSizes: typography.fontSizes,
  fontWeights: typography.fontWeights,
  lineHeights: typography.lineHeights,
  letterSpacings: typography.letterSpacings,
  space: spacing,
});
