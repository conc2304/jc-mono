import { ThemeConfig } from './types';

export const hologramTheme: ThemeConfig = {
  colors: {
    primary: '#00d4ff',
    secondary: '#7b68ee',
    accent: '#ff69b4',
    background: '#0c0c1e',
    surface: '#1a1a2e',
    text: '#e0e0ff',
    textSecondary: '#a0a0c0',
    border: '#4169e1',
    success: '#00fa9a',
    warning: '#ffd700',
    error: '#ff1493',
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
    cornerSize: '14px',
    cornerSizeLarge: '22px',
    cornerSizeSmall: '7px',
    glowIntensity: '0.7',
    animationDuration: '0.25s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #7b68ee 100%)',
    secondary: 'linear-gradient(135deg, #7b68ee 0%, #ff69b4 100%)',
    accent: 'linear-gradient(135deg, #ff69b4 0%, #00d4ff 100%)',
    cyberpunk:
      'linear-gradient(135deg, #00d4ff 0%, #7b68ee 33%, #ff69b4 66%, #00d4ff 100%)',
    neon: 'radial-gradient(circle at center, #00d4ff 0%, transparent 70%)',
  },
};
