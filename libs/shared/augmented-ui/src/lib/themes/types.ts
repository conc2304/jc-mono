export type VariantColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'cyberpunk'
  | 'neon';

export type VariantSize = 'small' | 'medium' | 'large';
export type VariantShape = 'clip' | 'round' | 'scoop' | 'mixed';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  augmented: {
    borderWidth: string;
    inlayWidth: string;
    cornerSize: string;
    cornerSizeLarge: string;
    cornerSizeSmall: string;
    glowIntensity: string;
    animationDuration: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    cyberpunk: string;
    neon: string;
  };
}
