import { ThemeConfig } from './types';

export const sciFiTheme: ThemeConfig = {
  colors: {
    primary: '#4a9eff',
    secondary: '#7c3aed',
    accent: '#fbbf24',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    border: '#475569',
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
    cornerSize: '12px',
    cornerSizeLarge: '20px',
    cornerSizeSmall: '6px',
    glowIntensity: '0.6',
    animationDuration: '0.2s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
    accent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    cyberpunk: 'linear-gradient(135deg, #4a9eff 0%, #7c3aed 50%, #fbbf24 100%)',
    neon: 'radial-gradient(circle at center, #4a9eff 0%, transparent 70%)',
  },
};
