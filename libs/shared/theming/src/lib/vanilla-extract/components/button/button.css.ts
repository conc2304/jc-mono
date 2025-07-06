import { style, styleVariants } from '@vanilla-extract/css';
import { themeContract } from '../../contract.css';
import { createTransition, typography } from '../../utils';

export const buttonBase = style({
  ...typography.button,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${themeContract.spacing.sm} ${themeContract.spacing.md}`,
  borderRadius: themeContract.shape.borderRadius,
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
  minWidth: '64px',
  boxSizing: 'border-box',
  transition: createTransition([
    'background-color',
    'color',
    'box-shadow',
    'border-color',
  ]),

  ':hover': {
    boxShadow: themeContract.shadows[2],
  },

  ':focus': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${themeContract.palette.primary.main}`,
  },

  ':disabled': {
    cursor: 'not-allowed',
    backgroundColor: themeContract.palette.action.disabledBackground,
    color: themeContract.palette.action.disabled,
    boxShadow: 'none',
  },
});

export const buttonVariants = styleVariants({
  contained: {
    backgroundColor: themeContract.palette.primary.main,
    color: themeContract.palette.primary.contrastText,
    boxShadow: themeContract.shadows[2],

    ':hover': {
      backgroundColor: themeContract.palette.primary.dark,
      boxShadow: themeContract.shadows[4],
    },

    ':active': {
      boxShadow: themeContract.shadows[8],
    },
  },

  outlined: {
    backgroundColor: 'transparent',
    color: themeContract.palette.primary.main,
    border: `1px solid ${themeContract.palette.primary.main}`,

    ':hover': {
      backgroundColor: themeContract.palette.action.hover,
      borderColor: themeContract.palette.primary.dark,
    },
  },

  text: {
    backgroundColor: 'transparent',
    color: themeContract.palette.primary.main,

    ':hover': {
      backgroundColor: themeContract.palette.action.hover,
    },
  },
});

export const buttonSizes = styleVariants({
  small: {
    padding: `${themeContract.spacing.xs} ${themeContract.spacing.sm}`,
    fontSize: themeContract.typography.caption.fontSize,
    minWidth: '48px',
  },
  medium: {
    padding: `${themeContract.spacing.sm} ${themeContract.spacing.md}`,
  },
  large: {
    padding: `${themeContract.spacing.md} ${themeContract.spacing.lg}`,
    fontSize: themeContract.typography.subtitle1.fontSize,
    minWidth: '80px',
  },
});

export const buttonColors = styleVariants({
  primary: {},
  secondary: {
    backgroundColor: themeContract.palette.secondary.main,
    color: themeContract.palette.secondary.contrastText,
    ':hover': {
      backgroundColor: themeContract.palette.secondary.dark,
    },
  },
  error: {
    backgroundColor: themeContract.palette.error.main,
    color: themeContract.palette.error.contrastText,
    ':hover': {
      backgroundColor: themeContract.palette.error.dark,
    },
  },
  warning: {
    backgroundColor: themeContract.palette.warning.main,
    color: themeContract.palette.warning.contrastText,
    ':hover': {
      backgroundColor: themeContract.palette.warning.dark,
    },
  },
  info: {
    backgroundColor: themeContract.palette.info.main,
    color: themeContract.palette.info.contrastText,
    ':hover': {
      backgroundColor: themeContract.palette.info.dark,
    },
  },
  success: {
    backgroundColor: themeContract.palette.success.main,
    color: themeContract.palette.success.contrastText,
    ':hover': {
      backgroundColor: themeContract.palette.success.dark,
    },
  },
});
