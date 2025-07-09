import { ThemeConfig } from './types';

export const basicTheme: ThemeConfig = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  augmented: {
    borderWidth: '1px',
    inlayWidth: '2px',
    cornerSize: '8px',
    cornerSizeLarge: '16px',
    cornerSizeSmall: '4px',
    glowIntensity: '0.3',
    animationDuration: '0.2s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    secondary: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    accent: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    cyberpunk: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #6b7280 100%)',
    neon: 'radial-gradient(circle at center, #3b82f6 0%, transparent 70%)',
  },
};
