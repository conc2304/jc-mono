import { ThemeConfig } from './types';

export const retroTheme: ThemeConfig = {
  colors: {
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#ffd23f',
    background: '#2d1b14',
    surface: '#3d2b1e',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#ff6b35',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  augmented: {
    borderWidth: '3px',
    inlayWidth: '6px',
    cornerSize: '20px',
    cornerSizeLarge: '30px',
    cornerSizeSmall: '10px',
    glowIntensity: '1.0',
    animationDuration: '0.4s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    secondary: 'linear-gradient(135deg, #f7931e 0%, #ffd23f 100%)',
    accent: 'linear-gradient(135deg, #ffd23f 0%, #ff6b35 100%)',
    cyberpunk: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd23f 100%)',
    neon: 'radial-gradient(circle at center, #ff6b35 0%, transparent 70%)',
  },
};
