import { createStitches } from '@stitches/react';
import { cyberpunkTokens } from '../themes/cyberpunk/tokens';
import { corporateTokens } from '../themes/corporate/tokens';
import { breakpoints } from '../foundations/breakpoints';
import { spacing } from '../foundations/spacing';
import { typography } from '../foundations/typography';

const defaultDesignTokens = cyberpunkTokens;
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
  // Default theme (cyberpunk in this case)
  theme: {
    ...defaultDesignTokens,
    ...typography,
    ...spacing,
  },
  media: breakpoints,
  utils: {
    // Your utilities here
    glow: (color: string) => ({
      filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color})`,
    }),
    // Add more utilities...
  },
});

// Create theme variants
export const corporateTheme = createTheme('corporate', {
  ...corporateTokens,
  ...typography,
  ...spacing,
});
