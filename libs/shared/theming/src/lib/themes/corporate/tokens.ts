import { ColorTokens, ThemeTokens } from '../types';

const colors: ColorTokens = {
  // Professional, muted palette
  primary: '#2563EB', // Professional blue
  primaryHover: '#1D4ED8',
  primaryActive: '#1E40AF',

  secondary: '#64748B', // Neutral gray-blue
  secondaryHover: '#475569',

  accent: '#059669', // Professional green

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',

  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textOnPrimary: '#FFFFFF',

  border: '#E2E8F0',
  borderSecondary: '#CBD5E1',
  borderMuted: '#F1F5F9',
};

export const corporateTokens: ThemeTokens = {
  colors,
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  effects: {
    glow: {
      color: '#2563EB',
      intensity: 2,
      spread: 1,
    },
    bevel: {
      size: 8,
      angle: 45,
    },
  },
};
