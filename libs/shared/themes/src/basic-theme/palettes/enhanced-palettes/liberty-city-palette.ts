// Rockstar GTA Theme - Complete Package

import { EnhancedThemeOption } from '../../types';

// Theme Definition
export const libertyCityTheme: EnhancedThemeOption = {
  id: 'liberty-city',
  name: 'Liberty City',
  description: 'Urban open-world theme inspired by metropolitan nightlife',
  category: 'cyberpunk',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FF6B35', // Traffic cone orange / street light glow
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CAF50', // Money green
      light: '#66BB6A',
      dark: '#388E3C',
      contrastText: '#000000',
    },
    error: { main: '#F44336' }, // Police red
    warning: { main: '#FFC107' }, // Taxi yellow
    info: { main: '#2196F3' }, // Police blue
    success: { main: '#4CAF50' }, // Money green
    background: {
      default: '#121212', // Dark city night
      paper: '#1E1E1E', // Slightly lighter panels
    },
    text: {
      primary: '#FFFFFF', // Bright white like neon signs
      secondary: '#BBBBBB', // Dimmed street lighting
    },
    divider: '#333333',
  },
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#E64A19', // Darker orange for contrast
      light: '#FF6B35',
      dark: '#D84315',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2E7D32', // Darker money green
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    error: { main: '#D32F2F' },
    warning: { main: '#F57F17' },
    info: { main: '#1976D2' },
    success: { main: '#388E3C' },
    background: {
      default: '#F5F5F5', // Light concrete/urban gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    divider: '#E0E0E0',
  },
};
