import { PaletteOptions } from '@mui/material/styles';

// 4. Holographic Light - Light mode retro sci-fi
export const getHolographicPalette = (): PaletteOptions => {
  return {
    mode: 'light',
    contrastThreshold: 4,
    tonalOffset: 0.5,
    primary: {
      main: '#6B46C1', // Purple
    },
    secondary: {
      main: '#10B981', // Emerald
    },
    error: {
      main: '#EF4444', // Red
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    info: {
      main: '#3B82F6', // Blue
    },
    success: {
      main: '#059669', // Green
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    divider: 'rgba(107, 70, 193, 0.2)',
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    action: {
      activatedOpacity: 0.12,
      active: 'rgba(107, 70, 193, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(107, 70, 193, 0.12)',
      focusOpacity: 0.12,
      hover: 'rgba(107, 70, 193, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(107, 70, 193, 0.08)',
      selectedOpacity: 0.08,
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(107, 70, 193, 0.7)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  };
};
