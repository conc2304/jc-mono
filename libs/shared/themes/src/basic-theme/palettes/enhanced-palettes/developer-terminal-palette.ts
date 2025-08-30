import { EnhancedThemeOption } from '../../types';

export const developerTerminalTheme: EnhancedThemeOption = {
  id: 'developer-terminal',
  name: 'Developer Terminal',
  description:
    'Clean IDE-inspired theme with familiar syntax highlighting colors',
  category: 'minimal',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#4FC3F7', // Bright blue (like VS Code function names)
      light: '#81D4FA',
      dark: '#29B6F6',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFB74D', // Orange (like VS Code strings/numbers)
      light: '#FFCC02',
      dark: '#FF9800',
      contrastText: '#000000',
    },
    error: { main: '#F44336' }, // Red for errors
    warning: { main: '#FF9800' }, // Orange for warnings
    info: { main: '#2196F3' }, // Blue for info
    success: { main: '#4CAF50' }, // Green for success
    background: {
      default: '#1E1E1E', // VS Code dark background
      paper: '#252526', // Slightly lighter for panels
    },
    text: {
      primary: '#CCCCCC', // Light gray for primary text
      secondary: '#9CDCFE', // Light blue for secondary (like VS Code variables)
    },
    divider: '#3E3E42', // Subtle divider color
  },
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#0066CC', // Professional blue
      light: '#4FC3F7',
      dark: '#003A75',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6F00', // Orange for accents
      light: '#FFB74D',
      dark: '#E65100',
      contrastText: '#FFFFFF',
    },
    error: { main: '#D32F2F' },
    warning: { main: '#F57C00' },
    info: { main: '#1976D2' },
    success: { main: '#388E3C' },
    background: {
      default: '#FFFFFF', // Clean white
      paper: '#F8F9FA', // Very light gray for panels
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#616161', // Medium gray for secondary text
    },
    divider: '#E0E0E0', // Light gray dividers
  },
};
