import { style, styleVariants } from '@vanilla-extract/css';

import { augmentedTheme } from '../../contract.css';

export const augmentedBase = style({
  position: 'relative',
  display: 'inline-block',
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,

  // Augmented UI CSS variables
  vars: {
    '--aug-border-all': augmentedTheme.augmented.borderWidth,
    '--aug-inlay-all': augmentedTheme.augmented.inlayWidth,
    '--aug-border-bg': augmentedTheme.colors.border,
    '--aug-inlay-bg': augmentedTheme.colors.surface,
  },

  ':hover': {
    vars: {
      '--aug-border-bg': augmentedTheme.colors.primary,
      '--aug-inlay-bg': augmentedTheme.colors.surface,
    },
  },
});

export const augmentedSizes = styleVariants({
  small: {
    vars: {
      '--aug-tl': augmentedTheme.augmented.cornerSizeSmall,
      '--aug-tr': augmentedTheme.augmented.cornerSizeSmall,
      '--aug-bl': augmentedTheme.augmented.cornerSizeSmall,
      '--aug-br': augmentedTheme.augmented.cornerSizeSmall,
    },
  },
  medium: {
    vars: {
      '--aug-tl': augmentedTheme.augmented.cornerSize,
      '--aug-tr': augmentedTheme.augmented.cornerSize,
      '--aug-bl': augmentedTheme.augmented.cornerSize,
      '--aug-br': augmentedTheme.augmented.cornerSize,
    },
  },
  large: {
    vars: {
      '--aug-tl': augmentedTheme.augmented.cornerSizeLarge,
      '--aug-tr': augmentedTheme.augmented.cornerSizeLarge,
      '--aug-bl': augmentedTheme.augmented.cornerSizeLarge,
      '--aug-br': augmentedTheme.augmented.cornerSizeLarge,
    },
  },
});

export const augmentedVariants = styleVariants({
  primary: {
    vars: {
      '--aug-border-bg': augmentedTheme.gradients.primary,
      '--aug-inlay-bg': augmentedTheme.colors.surface,
    },
  },
  secondary: {
    vars: {
      '--aug-border-bg': augmentedTheme.gradients.secondary,
      '--aug-inlay-bg': augmentedTheme.colors.surface,
    },
  },
  accent: {
    vars: {
      '--aug-border-bg': augmentedTheme.gradients.accent,
      '--aug-inlay-bg': augmentedTheme.colors.surface,
    },
  },
  cyberpunk: {
    vars: {
      '--aug-border-bg': augmentedTheme.gradients.cyberpunk,
      '--aug-inlay-bg': augmentedTheme.colors.background,
    },
  },
  neon: {
    vars: {
      '--aug-border-bg': augmentedTheme.colors.primary,
      '--aug-inlay-bg': augmentedTheme.gradients.neon,
    },
  },
});

export const augmentedGlow = style({
  vars: {
    '--aug-border-bg': `${augmentedTheme.colors.primary}, radial-gradient(circle at center, ${augmentedTheme.colors.primary} 0%, transparent 70%)`,
  },

  ':hover': {
    filter: `drop-shadow(0 0 10px ${augmentedTheme.colors.primary})`,
  },
});
