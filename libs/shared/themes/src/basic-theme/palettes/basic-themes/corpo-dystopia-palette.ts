import { PaletteOptions } from '@mui/material/styles';

//  Corporate Dystopia - Muted blues and grays with neon accents
export const getCorporateDystopiaPalette = (): PaletteOptions => {
  return {
    mode: 'dark',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#00D4FF', // Electric Blue
    },
    secondary: {
      main: '#4A5568', // Cool Gray
    },
    error: {
      main: '#F56565', // Coral Red
    },
    warning: {
      main: '#ED8936', // Orange
    },
    info: {
      main: '#63B3ED', // Sky Blue
    },
    success: {
      main: '#48BB78', // Green
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    divider: 'rgba(0, 212, 255, 0.15)',
    background: {
      default: '#1A202C',
      paper: '#2D3748',
    },
    action: {
      activatedOpacity: 0.12,
      active: 'rgba(0, 212, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.1)',
      disabledOpacity: 0.3,
      focus: 'rgba(0, 212, 255, 0.15)',
      focusOpacity: 0.15,
      hover: 'rgba(0, 212, 255, 0.06)',
      hoverOpacity: 0.06,
      selected: 'rgba(0, 212, 255, 0.1)',
      selectedOpacity: 0.1,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(160, 174, 192, 0.8)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
  };
};
