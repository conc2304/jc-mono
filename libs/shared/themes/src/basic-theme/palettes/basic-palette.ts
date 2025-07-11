import { PaletteOptions } from '@mui/material/styles';

export const basicPalette = (): PaletteOptions => {
  return {
    mode: 'light',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#1976D2', // Blue
    },
    secondary: {
      main: '#424242', // Dark Gray
    },
    error: {
      main: '#D32F2F', // Red
    },
    warning: {
      main: '#ED6C02', // Orange
    },
    info: {
      main: '#0288D1', // Light Blue
    },
    success: {
      main: '#2E7D32', // Green
    },
    common: {
      black: '#121212',
      white: '#FFF',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      default: 'rgb(255, 255, 255)',
      paper: 'rgb(237, 233, 232)2)',
    },

    action: {
      activatedOpacity: 0.12,
      active: 'rgba(0, 0, 0, 0.56)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0.12,
      hover: 'rgba(0, 0, 0, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 0.08,
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.60)',
      disabled: 'rgba(0,0,0, 0.38)',
    },
  };
};
