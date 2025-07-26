import { EnhancedThemeOption } from '../../types';

// Background Centric Theme
export const oceanDepthTheme: EnhancedThemeOption = {
  id: 'ocean-depth',
  name: 'Ocean Depth',
  description:
    'Deep ocean theme with vibrant aquatic backgrounds and coral accents',
  category: 'minimal',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#FF5722', // Coral orange for primary
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00BCD4', // Cyan
      light: '#4DD0E1',
      dark: '#0097A7',
      contrastText: '#000000',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
    },
    info: {
      main: '#2196F3',
      light: '#42A5F5',
      dark: '#1976D2',
    },
    success: {
      main: '#4CAF50',
      light: '#66BB6A',
      dark: '#388E3C',
    },
    background: {
      default: '#00ACC1', // Vibrant teal background
      paper: '#26C6DA', // Lighter cyan for surfaces
    },
    text: {
      primary: '#FFFFFF', // White text on vibrant blue
      secondary: '#E0F2F1', // Very light teal
    },
    divider: '#FFFFFF50', // Semi-transparent white
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FF7043', // Warm coral
      light: '#FF8A65',
      dark: '#FF5722',
      contrastText: '#000000',
    },
    secondary: {
      main: '#40E0D0', // Turquoise
      light: '#4DD0E1',
      dark: '#00BCD4',
      contrastText: '#000000',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8A80',
      dark: '#F44336',
    },
    warning: {
      main: '#FFD93D',
      light: '#FFF59D',
      dark: '#FFC107',
    },
    info: {
      main: '#42A5F5',
      light: '#64B5F6',
      dark: '#2196F3',
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50',
    },
    background: {
      default: '#006064', // Deep teal background
      paper: '#00838F', // Medium teal for elevated surfaces
    },
    text: {
      primary: '#E0F2F1', // Very light teal text
      secondary: '#B2DFDB', // Light teal for secondary
    },
    divider: '#4DB6AC50', // Semi-transparent teal
  },
};
