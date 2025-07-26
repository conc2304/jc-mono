import { EnhancedThemeOption } from '../../types';
// Background Centric Theme

export const electricSynthwaveTheme: EnhancedThemeOption = {
  id: 'neon-synthwave',
  name: 'Neon Synthwave',
  description:
    'Electric synthwave theme with vibrant purple and pink backgrounds',
  category: 'synthwave',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#4a4a4aff', // Hot pink for primary actions
      light: '#897c80ff',
      dark: '#342f31ff',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D4FF', // Electric cyan
      light: '#29B6F6',
      dark: '#0277BD',
      contrastText: '#000000',
    },
    error: {
      main: '#FF1744',
      light: '#FF5983',
      dark: '#C51162',
    },
    warning: {
      main: '#FFD600',
      light: '#FFEB3B',
      dark: '#FFC107',
    },
    info: {
      main: '#00E676',
      light: '#4CAF50',
      dark: '#00C853',
    },
    success: {
      main: '#76FF03',
      light: '#8BC34A',
      dark: '#64DD17',
    },
    background: {
      default: '#FF69B4', // Hot pink background for immersive experience
      paper: '#FF1493', // Deeper pink for elevated surfaces
    },
    text: {
      primary: '#FFFFFF', // White text for contrast on vibrant background
      secondary: '#F5F5F5', // Off-white for secondary text
    },
    divider: '#FFFFFF40', // Semi-transparent white dividers
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#39FF14', // Neon green
      light: '#7FFF00',
      dark: '#32CD32',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF006E', // Hot pink
      light: '#FF1493',
      dark: '#C71585',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF073A',
      light: '#FF1744',
      dark: '#D50000',
    },
    warning: {
      main: '#FFAB00',
      light: '#FFC107',
      dark: '#FF8F00',
    },
    info: {
      main: '#00D4FF',
      light: '#29B6F6',
      dark: '#0288D1',
    },
    success: {
      main: '#39FF14',
      light: '#7FFF00',
      dark: '#32CD32',
    },
    background: {
      default: '#4A148C', // Deep vibrant purple background
      paper: '#6A1B9A', // Lighter purple for elevated surfaces
    },
    text: {
      primary: '#39FF14', // Neon green text
      secondary: '#00D4FF', // Cyan for secondary text
    },
    divider: '#39FF1440', // Semi-transparent green dividers
  },
};
