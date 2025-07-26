import { EnhancedThemeOption } from '../../types';

export const marathonThemes: EnhancedThemeOption = {
  id: 'marathon',
  name: 'Marathon',
  description: 'Retro-futuristic gaming theme with synthwave vibes',
  category: 'synthwave',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#00FF41',
      light: '#33FF66',
      dark: '#00CC33',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF1493',
      light: '#FF69B4',
      dark: '#DC143C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4444',
      light: '#FF6666',
      dark: '#CC0000',
    },
    warning: {
      main: '#FF8C00',
      light: '#FFA500',
      dark: '#FF6600',
    },
    info: {
      main: '#4169E1',
      light: '#6495ED',
      dark: '#0000FF',
    },
    success: {
      main: '#00FF41',
      light: '#33FF66',
      dark: '#00CC33',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#00FF41',
      secondary: '#CCCCCC',
    },
    divider: '#333333',
  },
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#00CC33',
      light: '#00FF41',
      dark: '#009900',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DC143C',
      light: '#FF1493',
      dark: '#B22222',
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
      default: '#F8F8F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#666666',
    },
    divider: '#E0E0E0',
  },
};
