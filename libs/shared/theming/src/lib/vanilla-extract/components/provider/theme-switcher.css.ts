import { style, styleVariants } from '@vanilla-extract/css';
import { themeContract } from '../../contract.css';
import { createTransition } from '../../utils';

export const switcherContainer = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
});

export const switcherButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: themeContract.palette.background.paper,
  color: themeContract.palette.text.primary,
  boxShadow: themeContract.shadows[2],
  transition: createTransition([
    'background-color',
    'color',
    'box-shadow',
    'transform',
  ]),

  ':hover': {
    backgroundColor: themeContract.palette.action.hover,
    boxShadow: themeContract.shadows[4],
    transform: 'scale(1.05)',
  },

  ':focus': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${themeContract.palette.primary.main}`,
  },

  ':active': {
    transform: 'scale(0.95)',
  },
});

export const toggleSwitch = style({
  position: 'relative',
  width: '52px',
  height: '28px',
  backgroundColor: themeContract.palette.grey[300],
  borderRadius: '14px',
  border: 'none',
  cursor: 'pointer',
  transition: createTransition(['background-color']),
  outline: 'none',

  ':focus': {
    boxShadow: `0 0 0 2px ${themeContract.palette.primary.main}`,
  },

  selectors: {
    '&[data-checked="true"]': {
      backgroundColor: themeContract.palette.primary.main,
    },
  },
});

export const toggleThumb = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '24px',
  height: '24px',
  backgroundColor: '#fff',
  borderRadius: '50%',
  boxShadow: themeContract.shadows[1],
  transition: createTransition(['transform', 'box-shadow']),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',

  selectors: {
    '[data-checked="true"] &': {
      transform: 'translateX(24px)',
    },
  },
});

export const switcherLabel = style({
  ...themeContract.typography.body2,
  color: themeContract.palette.text.secondary,
  fontWeight: themeContract.typography.fontWeightMedium,
});

export const switcherVariants = styleVariants({
  icon: {},
  toggle: {},
  dropdown: {
    position: 'relative',
  },
});

export const dropdownMenu = style({
  position: 'absolute',
  top: '100%',
  right: '0',
  marginTop: themeContract.spacing.xs,
  backgroundColor: themeContract.palette.background.paper,
  borderRadius: themeContract.shape.borderRadius,
  boxShadow: themeContract.shadows[8],
  border: `1px solid ${themeContract.palette.divider}`,
  minWidth: '120px',
  zIndex: themeContract.zIndex.tooltip,
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-8px)',
  transition: createTransition(['opacity', 'visibility', 'transform']),

  selectors: {
    '&[data-open="true"]': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)',
    },
  },
});

export const dropdownItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeContract.spacing.sm,
  padding: `${themeContract.spacing.sm} ${themeContract.spacing.md}`,
  width: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  color: themeContract.palette.text.primary,
  cursor: 'pointer',
  fontSize: themeContract.typography.body2.fontSize,
  transition: createTransition(['background-color']),

  ':hover': {
    backgroundColor: themeContract.palette.action.hover,
  },

  ':first-child': {
    borderTopLeftRadius: themeContract.shape.borderRadius,
    borderTopRightRadius: themeContract.shape.borderRadius,
  },

  ':last-child': {
    borderBottomLeftRadius: themeContract.shape.borderRadius,
    borderBottomRightRadius: themeContract.shape.borderRadius,
  },

  selectors: {
    '&[data-selected="true"]': {
      backgroundColor: themeContract.palette.action.selected,
      color: themeContract.palette.primary.main,
    },
  },
});
