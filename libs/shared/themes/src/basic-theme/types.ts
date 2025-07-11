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
  category: 'cyberpunk' | 'retro' | 'corporate' | 'minimal';
  // Define both light and dark variants
  lightPalette: PaletteOptions;
  darkPalette: PaletteOptions;
  // Optional: some themes might only support one mode
  supportsLight?: boolean;
  supportsDark?: boolean;
}
