import { EnhancedThemeOption } from '../../types';

export const bubblegumDreamTheme: EnhancedThemeOption = {
  id: 'bubblegum-dream',
  name: 'Bubblegum Dream',
  description:
    'Sweet vintage-inspired theme with soft pastels and nostalgic bubblegum colors',
  category: 'retro',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#FF69B4', // Hot pink bubblegum
      light: '#FFB6C1',
      dark: '#C71585',
      contrastText: '#88d888',
    },
    secondary: {
      main: '#98FB98', // Pale green mint
      light: '#F0FFF0',
      dark: '#90EE90',
      contrastText: '#000000',
    },
    error: {
      main: '#FFB6C1', // Light pink (soft error)
      light: '#FFCCCB',
      dark: '#FF69B4',
    },
    warning: {
      main: '#FFFFE0', // Light yellow cream
      light: '#FFFFF0',
      dark: '#F0E68C',
    },
    info: {
      main: '#E6E6FA', // Lavender
      light: '#F8F8FF',
      dark: '#DDA0DD',
    },
    success: {
      main: '#F0FFFF', // Azure (soft success)
      light: '#F5FFFA',
      dark: '#E0FFFF',
    },
    background: {
      default: '#FFB6C1', // Light pink background
      paper: '#FFCCCB', // Slightly deeper pink for surfaces
    },
    text: {
      primary: '#8B008B', // Dark magenta
      secondary: '#DA70D6', // Orchid
    },
    divider: '#8B008B40', // Semi-transparent dark magenta
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#DDA0DD',
      light: '#EE82EE',
      dark: '#DA70D6',
      contrastText: '#783d81ff',
    },
    secondary: {
      main: '#F0E68C',
      light: '#FFFF99',
      dark: '#BDB76B',
      contrastText: '#000000',
    },
    error: {
      main: '#F8BBD9',
      light: '#FFCCCB',
      dark: '#FFB6C1',
    },
    warning: {
      main: '#FFFACD',
      light: '#FFFFE0',
      dark: '#F0E68C',
    },
    info: {
      main: '#E6E6FA',
      light: '#F8F8FF',
      dark: '#DDA0DD',
    },
    success: {
      main: '#AFEEEE',
      light: '#E0FFFF',
      dark: '#B0E0E6',
    },
    background: {
      default: '#8B008B',
      paper: '#9932CC',
    },
    text: {
      primary: '#FFCCCB',
      secondary: '#F8BBD9',
    },
    divider: '#DDA0DD50',
  },
};
