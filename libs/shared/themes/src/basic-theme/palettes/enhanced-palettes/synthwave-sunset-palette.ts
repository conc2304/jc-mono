import { EnhancedThemeOption } from '../../types';

export const synthwaveSunsetTheme: EnhancedThemeOption = {
  id: 'synthwave',
  name: 'Synthwave Sunset',
  description: 'Retro 80s synthwave theme with purple and orange gradients',
  category: 'retro',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: { main: '#8A2BE2' },
    secondary: { main: '#FF6B35' },
    error: { main: '#FF073A' },
    warning: { main: '#FFA500' },
    info: { main: '#00CED1' },
    success: { main: '#32CD32' },
    background: {
      default: '#0F0F23',
      paper: '#1A1A2E',
    },
  },
  lightPalette: {
    mode: 'light',
    primary: { main: '#6A1B9A' },
    secondary: { main: '#E65100' },
    error: { main: '#D32F2F' },
    warning: { main: '#F57C00' },
    info: { main: '#0097A7' },
    success: { main: '#388E3C' },
    background: {
      default: '#F8F9FF',
      paper: '#FFFFFF',
    },
  },
};
