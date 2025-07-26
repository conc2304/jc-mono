import { EnhancedThemeOption } from '../../types';

export const euclidThemes: EnhancedThemeOption = {
  id: 'euclid-ci',
  name: 'Euclid CI',
  description: 'Counter Intelligence inspired theme design',
  category: 'cyberpunk',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FF6B5A', // Coral/salmon accent from the design
      light: '#FF8A7A',
      dark: '#E55A4A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C4C4C4', // Light gray from geometric elements
      light: '#DADADA',
      dark: '#9E9E9E',
      contrastText: '#000000',
    },
    error: { main: '#FF4444' },
    warning: { main: '#FFB347' },
    info: { main: '#64B5F6' },
    success: { main: '#66BB6A' },
    background: {
      default: '#0A0A0A', // Deep black from the design
      paper: '#1A1A1A', // Slightly lighter for cards
    },
    text: {
      primary: '#E0E0E0', // Light gray for primary text
      secondary: '#B0B0B0', // Medium gray for secondary text
    },
    divider: '#333333', // Dark gray for subtle divisions
  },
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#E55A4A', // Darker coral for better contrast on light
      light: '#FF6B5A',
      dark: '#CC4A3A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A4A4A', // Dark gray instead of light gray
      light: '#6A6A6A',
      dark: '#2A2A2A',
      contrastText: '#FFFFFF',
    },
    error: { main: '#D32F2F' },
    warning: { main: '#F57F17' },
    info: { main: '#1976D2' },
    success: { main: '#388E3C' },
    background: {
      default: '#B7BBB0', // Light gray base (similar to the gray areas)
      paper: '#c6c3bc', // Pure white for cards
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#666666', // Medium gray for secondary text
    },
    divider: '#E0E0E0', // Light gray for divisions
  },
};
