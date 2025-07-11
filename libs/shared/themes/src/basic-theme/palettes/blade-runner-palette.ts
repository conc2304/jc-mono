import { PaletteOptions } from '@mui/material/styles';

// Blade Runner - Deep oranges and teals
export const getBladeRunnerPalette = (): PaletteOptions => {
  return {
    mode: 'dark',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#FF6B35', // Blade Runner Orange
    },
    secondary: {
      main: '#004445', // Dark Teal
    },
    error: {
      main: '#D32F2F', // Red
    },
    warning: {
      main: '#FFB300', // Amber
    },
    info: {
      main: '#00ACC1', // Light Blue
    },
    success: {
      main: '#388E3C', // Green
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    divider: 'rgba(255, 107, 53, 0.2)',
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    action: {
      activatedOpacity: 0.15,
      active: 'rgba(255, 107, 53, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.1)',
      disabledOpacity: 0.3,
      focus: 'rgba(255, 107, 53, 0.2)',
      focusOpacity: 0.2,
      hover: 'rgba(255, 107, 53, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 107, 53, 0.12)',
      selectedOpacity: 0.12,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(0, 172, 193, 0.8)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
  };
};
