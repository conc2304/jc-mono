import { style, styleVariants } from '@vanilla-extract/css';

import { augmentedTheme } from '../../contract.css';

export const buttonBase = style({
  padding: `${augmentedTheme.spacing.sm} ${augmentedTheme.spacing.md}`,
  backgroundColor: augmentedTheme.colors.background,
  color: augmentedTheme.colors.text,
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',

  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,

  ':hover': {
    backgroundColor: augmentedTheme.colors.surface,
    transform: 'translateY(-2px)',
  },

  ':active': {
    transform: 'translateY(0)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

export const buttonShapes = styleVariants({
  clip: {
    // Uses tl-clip tr-clip br-clip bl-clip
  },
  round: {
    // Uses tl-round tr-round br-round bl-round
  },
  scoop: {
    // Uses tl-scoop tr-scoop br-scoop bl-scoop
  },
  mixed: {
    // Uses tl-clip tr-round br-clip bl-round
  },
});
