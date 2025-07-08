import { style, styleVariants } from '@vanilla-extract/css';

import { augmentedTheme } from '../../contract.css';

export const panelBase = style({
  padding: augmentedTheme.spacing.lg,
  backgroundColor: augmentedTheme.colors.background,
  color: augmentedTheme.colors.text,
  border: 'none',
  width: '100%',
  minHeight: '100px',
});

export const panelVariants = styleVariants({
  elevated: {
    backgroundColor: augmentedTheme.colors.surface,
    boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
  },
  flat: {
    backgroundColor: augmentedTheme.colors.background,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
});
