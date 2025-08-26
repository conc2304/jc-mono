import { EnhancedThemeOption } from '../../types';

export const bladeRunnerTheme: EnhancedThemeOption = {
  id: 'blade-runner',
  name: 'Blade Runner',
  description: 'Dystopian noir theme with dark orange and teal atmospherics',
  category: 'cyberpunk',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: { main: '#FF6B35' },
    secondary: { main: '#004445' },
    error: { main: '#D32F2F' },
    warning: { main: '#FFB300' },
    info: { main: '#00ACC1' },
    success: { main: '#388E3C' },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
  },
  lightPalette: {
    mode: 'light',
    primary: { main: '#E55A2B' },
    secondary: { main: '#006B6D' },
    error: { main: '#C62828' },
    warning: { main: '#F57F17' },
    info: { main: '#0097A7' },
    success: { main: '#2E7D32' },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
    },
    divider: '#E2E8F0',
  },
};
