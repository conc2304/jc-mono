import { style } from '@vanilla-extract/css';

import { augmentedTheme } from '../../contract.css';

export const themeSwitcherContainer = style({
  position: 'relative',
  display: 'inline-block',
});

export const themeSwitcherButton = style({
  padding: `${augmentedTheme.spacing.sm} ${augmentedTheme.spacing.md}`,
  backgroundColor: augmentedTheme.colors.surface,
  color: augmentedTheme.colors.text,
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,

  ':hover': {
    backgroundColor: augmentedTheme.colors.background,
    transform: 'translateY(-1px)',
  },
});

export const themeSwitcherDropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: augmentedTheme.colors.surface,
  border: `1px solid ${augmentedTheme.colors.border}`,
  borderRadius: '4px',
  zIndex: 1000,
  minWidth: '200px',
  maxHeight: '300px',
  overflowY: 'auto',

  // Custom scrollbar
  '::-webkit-scrollbar': {
    width: '8px',
  },
  '::-webkit-scrollbar-track': {
    background: augmentedTheme.colors.background,
  },
  '::-webkit-scrollbar-thumb': {
    background: augmentedTheme.colors.border,
    borderRadius: '4px',
  },
  // '::-webkit-scrollbar-thumb:hover': {
  //   background: augmentedTheme.colors.primary,
  // },
});

export const themeOption = style({
  display: 'block',
  width: '100%',
  padding: `${augmentedTheme.spacing.sm} ${augmentedTheme.spacing.md}`,
  backgroundColor: 'transparent',
  color: augmentedTheme.colors.text,
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'left',
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,

  ':hover': {
    backgroundColor: augmentedTheme.colors.background,
    color: augmentedTheme.colors.primary,
  },
});

export const themeOptionActive = style({
  backgroundColor: augmentedTheme.colors.primary,
  color: augmentedTheme.colors.background,

  ':hover': {
    backgroundColor: augmentedTheme.colors.primary,
    color: augmentedTheme.colors.background,
  },
});

export const themePreview = style({
  display: 'flex',
  alignItems: 'center',
  gap: augmentedTheme.spacing.sm,
});

export const themeColorSwatch = style({
  width: '16px',
  height: '16px',
  borderRadius: '2px',
  border: `1px solid ${augmentedTheme.colors.border}`,
});

export const darkModeToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: augmentedTheme.spacing.sm,
  padding: `${augmentedTheme.spacing.sm} ${augmentedTheme.spacing.md}`,
  borderTop: `1px solid ${augmentedTheme.colors.border}`,
});

export const toggleSwitch = style({
  position: 'relative',
  width: '40px',
  height: '20px',
  backgroundColor: augmentedTheme.colors.border,
  borderRadius: '10px',
  cursor: 'pointer',
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,
});

export const toggleSwitchActive = style({
  backgroundColor: augmentedTheme.colors.primary,
});

export const toggleHandle = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '16px',
  height: '16px',
  backgroundColor: augmentedTheme.colors.text,
  borderRadius: '50%',
  transition: `all ${augmentedTheme.augmented.animationDuration} ease`,
});

export const toggleHandleActive = style({
  transform: 'translateX(20px)',
});
