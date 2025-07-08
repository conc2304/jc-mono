import { ThemeConfig } from './types';

export const cyberpunkTheme: ThemeConfig = {
  colors: {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#333333',
    success: '#00ff00',
    warning: '#ff6600',
    error: '#ff0000',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  augmented: {
    borderWidth: '2px',
    inlayWidth: '4px',
    cornerSize: '15px',
    cornerSizeLarge: '25px',
    cornerSizeSmall: '8px',
    glowIntensity: '0.8',
    animationDuration: '0.3s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
    secondary: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
    accent: 'linear-gradient(135deg, #ffff00 0%, #ff8000 100%)',
    cyberpunk: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
    neon: 'radial-gradient(circle at center, #00ffff 0%, transparent 70%)',
  },
};
