import { EnhancedThemeOption } from '../../types';

export const neonCyberpunkTheme: EnhancedThemeOption = {
  id: 'neon-cyberpunk',
  name: 'Neon Cyberpunk',
  description: 'Hot pink and electric cyan',
  category: 'cyberpunk',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: { main: '#FF1493' },
    secondary: { main: '#00FFFF' },
    error: { main: '#FF0040' },
    warning: { main: '#FFFF00' },
    info: { main: '#00BFFF' },
    success: { main: '#00FF41' },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(0, 255, 255, 0.8)',
    },
  },
  lightPalette: {
    mode: 'light',
    primary: { main: '#D91775' },
    secondary: { main: '#006B6B' },
    error: { main: '#D32F2F' },
    warning: { main: '#ED6C02' },
    info: { main: '#0288D1' },
    success: { main: '#2E7D32' },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
};
