export interface ColorTokens {
  primary: string;
  primaryHover: string;
  primaryActive?: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive?: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  border: string;
  borderSecondary: string;
  borderMuted: string;
}

export interface ThemeTokens {
  colors: ColorTokens;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      [key: string]: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      [key: string]: string;
    };
  };
  effects: {
    glow: {
      color: string;
      intensity: number;
      spread: number;
    };
    bevel: {
      size: number;
      angle: number;
    };
  };
}

export type ThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type ThemeVariant = 'solid' | 'outline' | 'ghost' | 'soft';
