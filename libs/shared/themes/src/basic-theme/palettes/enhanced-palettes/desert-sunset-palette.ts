import { EnhancedThemeOption } from '../../types';

export const desertSunsetTheme: EnhancedThemeOption = {
  id: 'sunset-gradient',
  name: 'Sunset Gradient',
  description:
    'Warm sunset theme with vibrant orange and purple gradient backgrounds',
  category: 'retro',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#9C27B0', // Deep purple for contrast
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6F00', // Deep orange
      light: '#FF8F00',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#F44336',
      dark: '#C62828',
    },
    warning: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#1976D2',
      light: '#2196F3',
      dark: '#0D47A1',
    },
    success: {
      main: '#388E3C',
      light: '#4CAF50',
      dark: '#2E7D32',
    },
    background: {
      default: '#FF9800', // Vibrant orange background
      paper: '#FFB74D', // Lighter orange for surfaces
    },
    text: {
      primary: '#FFFFFF', // White text on orange
      secondary: '#FFF3E0', // Very light orange
    },
    divider: '#FFFFFF60', // Semi-transparent white
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FFD600', // Bright yellow for sunset feel
      light: '#FFEB3B',
      dark: '#FFC107',
      contrastText: '#000000',
    },
    secondary: {
      main: '#E91E63', // Pink accent
      light: '#F06292',
      dark: '#C2185B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF5252',
      light: '#FF8A80',
      dark: '#F44336',
    },
    warning: {
      main: '#FFAB00',
      light: '#FFC107',
      dark: '#FF8F00',
    },
    info: {
      main: '#448AFF',
      light: '#82B1FF',
      dark: '#2962FF',
    },
    success: {
      main: '#69F0AE',
      light: '#B2FF59',
      dark: '#00E676',
    },
    background: {
      default: '#512DA8', // Deep purple background (sunset sky)
      paper: '#673AB7', // Medium purple for elevated surfaces
    },
    text: {
      primary: '#FFD600', // Golden yellow text
      secondary: '#FFECB3', // Light yellow for secondary
    },
    divider: '#FFD60060', // Semi-transparent yellow
  },
};
