import { PaletteOptions } from '@mui/material';
export type ColorMode = 'light' | 'dark' | 'system';

export interface ThemeOption {
  id: string;
  name: string;
  description?: string;
  palette: PaletteOptions;
  category?: 'light' | 'dark' | 'auto';
}

export interface EnhancedThemeOption {
  id: string;
  name: string;
  description?: string;
  category: 'cyberpunk' | 'retro' | 'corporate' | 'minimal' | 'synthwave';
  // Define both light and dark variants
  lightPalette: PaletteOptions;
  darkPalette: PaletteOptions;
  supportsLight?: boolean;
  supportsDark?: boolean;
}
