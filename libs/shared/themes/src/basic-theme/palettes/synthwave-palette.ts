import { PaletteOptions } from '@mui/material/styles';

//  Synthwave Sunset - Purple and orange retro
export const getSynthwavePalette = (): PaletteOptions => {
  return {
    mode: 'dark',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#8A2BE2', // Blue Violet
    },
    secondary: {
      main: '#FF6B35', // Sunset Orange
    },
    error: {
      main: '#FF073A', // Neon Red
    },
    warning: {
      main: '#FFA500', // Orange
    },
    info: {
      main: '#00CED1', // Dark Turquoise
    },
    success: {
      main: '#32CD32', // Lime Green
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    divider: 'rgba(138, 43, 226, 0.25)',
    background: {
      default: '#0F0F23',
      paper: '#1A1A2E',
    },
    action: {
      activatedOpacity: 0.15,
      active: 'rgba(138, 43, 226, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.1)',
      disabledOpacity: 0.3,
      focus: 'rgba(138, 43, 226, 0.2)',
      focusOpacity: 0.2,
      hover: 'rgba(138, 43, 226, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(138, 43, 226, 0.12)',
      selectedOpacity: 0.12,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 107, 53, 0.8)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
  };
};
