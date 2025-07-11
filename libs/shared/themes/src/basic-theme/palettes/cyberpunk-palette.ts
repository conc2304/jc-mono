import { PaletteOptions } from '@mui/material/styles';

// Neon Cyberpunk - Hot pink and electric blue
export const getNeonCyberpunkPalette = (): PaletteOptions => {
  return {
    mode: 'dark',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#FF1493', // Hot Pink
    },
    secondary: {
      main: '#00FFFF', // Cyan
    },
    error: {
      main: '#FF0040', // Bright Red
    },
    warning: {
      main: '#FFFF00', // Electric Yellow
    },
    info: {
      main: '#00BFFF', // Deep Sky Blue
    },
    success: {
      main: '#00FF41', // Matrix Green
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    divider: 'rgba(255, 20, 147, 0.2)',
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    action: {
      activatedOpacity: 0.15,
      active: 'rgba(255, 20, 147, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.1)',
      disabledOpacity: 0.3,
      focus: 'rgba(255, 20, 147, 0.2)',
      focusOpacity: 0.2,
      hover: 'rgba(255, 20, 147, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 20, 147, 0.12)',
      selectedOpacity: 0.12,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(0, 255, 255, 0.8)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
  };
};
