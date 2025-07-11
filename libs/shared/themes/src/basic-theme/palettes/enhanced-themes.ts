import { EnhancedThemeOption } from '../types';

// Enhanced theme definitions with both light and dark variants
export const enhancedThemes: EnhancedThemeOption[] = [
  {
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
      primary: { main: '#D91775' }, // Darker pink for better contrast
      secondary: { main: '#006B6B' }, // Darker cyan
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
  },
  {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    description: 'Purple and orange retro 80s',
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
      primary: { main: '#6A1B9A' }, // Darker purple
      secondary: { main: '#E65100' }, // Darker orange
      error: { main: '#D32F2F' },
      warning: { main: '#F57C00' },
      info: { main: '#0097A7' },
      success: { main: '#388E3C' },
      background: {
        default: '#F8F9FF',
        paper: '#FFFFFF',
      },
    },
  },
  {
    id: 'blade-runner',
    name: 'Blade Runner',
    description: 'Only available in dark mode',
    category: 'cyberpunk',
    supportsLight: false,
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
      primary: { main: '#FF6B35' },
      secondary: { main: '#004445' },
      // This theme doesn't really work in light mode
      background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
      },
    },
  },
];
