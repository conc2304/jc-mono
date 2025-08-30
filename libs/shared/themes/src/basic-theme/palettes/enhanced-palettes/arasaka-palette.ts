import { EnhancedThemeOption } from '../../types';

// Black & Red Monochromatic Theme
export const arasakaTheme: EnhancedThemeOption = {
  id: 'arasaka',
  name: 'Arasaka',
  description:
    'Ruthless cyberpunk corporate theme inspired by the megacorp aesthetic',
  category: 'minimal',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#000000', // Pure black for primary actions
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#660000', // Dark red for secondary elements
      light: '#990000',
      dark: '#330000',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#330000', // Very dark red for errors
      light: '#660000',
      dark: '#1A0000',
    },
    warning: {
      main: '#800000', // Maroon for warnings
      light: '#B30000',
      dark: '#4D0000',
    },
    info: {
      main: '#4D0000', // Dark crimson for info
      light: '#800000',
      dark: '#260000',
    },
    success: {
      main: '#600000', // Dark red for success
      light: '#990000',
      dark: '#330000',
    },
    background: {
      default: '#FF4444', // Bright red background
      paper: '#f12020', // Lighter red for elevated surfaces
    },
    text: {
      primary: '#000000', // Black text on red background
      secondary: '#330000', // Very dark red for secondary text
    },
    divider: '#00000040', // Semi-transparent black dividers
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FF4444', // Bright red for primary actions in dark
      light: '#FF6666',
      dark: '#CC0000',
      contrastText: '#000000',
    },
    secondary: {
      main: '#CC0000', // Medium red for secondary
      light: '#FF4444',
      dark: '#990000',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF6666', // Light red for errors
      light: '#FF9999',
      dark: '#FF4444',
    },
    warning: {
      main: '#FF8888', // Lighter red for warnings
      light: '#FFAAAA',
      dark: '#FF6666',
    },
    info: {
      main: '#FFAAAA', // Very light red for info
      light: '#FFCCCC',
      dark: '#FF8888',
    },
    success: {
      main: '#FF9999', // Light red for success
      light: '#FFBBBB',
      dark: '#FF7777',
    },
    background: {
      default: '#000000', // Pure black background
      paper: '#1A0000', // Very dark red for elevated surfaces
    },
    text: {
      primary: '#FFFFFF', // White text on black background
      secondary: '#CCCCCC', // Light gray for secondary text
    },
    divider: '#FF444450', // Semi-transparent red dividers
  },
};
