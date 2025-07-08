import { ThemeConfig } from './types';

export const matrixTheme: ThemeConfig = {
  colors: {
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#65fc3f',
    background: '#000000',
    surface: '#001100',
    text: '#00ff41',
    textSecondary: '#008f11',
    border: '#00ff41',
    success: '#00ff41',
    warning: '#ffff00',
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
    borderWidth: '1px',
    inlayWidth: '3px',
    cornerSize: '10px',
    cornerSizeLarge: '18px',
    cornerSizeSmall: '5px',
    glowIntensity: '0.9',
    animationDuration: '0.15s',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #00ff41 0%, #008f11 100%)',
    secondary: 'linear-gradient(135deg, #008f11 0%, #00ff41 100%)',
    accent: 'linear-gradient(135deg, #65fc3f 0%, #00ff41 100%)',
    cyberpunk: 'linear-gradient(135deg, #00ff41 0%, #65fc3f 50%, #008f11 100%)',
    neon: 'radial-gradient(circle at center, #00ff41 0%, transparent 70%)',
  },
};
