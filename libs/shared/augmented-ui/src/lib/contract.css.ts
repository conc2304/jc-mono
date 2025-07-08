import { createThemeContract } from '@vanilla-extract/css';

export const augmentedTheme = createThemeContract({
  colors: {
    primary: null,
    secondary: null,
    accent: null,
    background: null,
    surface: null,
    text: null,
    textSecondary: null,
    border: null,
    success: null,
    warning: null,
    error: null,
  },
  spacing: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  augmented: {
    borderWidth: null,
    inlayWidth: null,
    cornerSize: null,
    cornerSizeLarge: null,
    cornerSizeSmall: null,
    glowIntensity: null,
    animationDuration: null,
  },
  gradients: {
    primary: null,
    secondary: null,
    accent: null,
    cyberpunk: null,
    neon: null,
  },
});
