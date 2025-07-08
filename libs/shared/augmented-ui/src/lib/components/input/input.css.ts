import { style, styleVariants } from '@vanilla-extract/css';

import { augmentedTheme } from '../../contract.css';

export const inputBase = style({
  padding: `${augmentedTheme.spacing.sm} ${augmentedTheme.spacing.md}`,
  backgroundColor: augmentedTheme.colors.surface,
  color: augmentedTheme.colors.text,
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  width: '100%',

  '::placeholder': {
    color: augmentedTheme.colors.textSecondary,
  },

  ':focus': {
    backgroundColor: augmentedTheme.colors.background,
  },
});

export const inputStates = styleVariants({
  default: {},
  error: {
    vars: {
      '--aug-border-bg': augmentedTheme.colors.error,
    },
  },
  success: {
    vars: {
      '--aug-border-bg': augmentedTheme.colors.success,
    },
  },
});
