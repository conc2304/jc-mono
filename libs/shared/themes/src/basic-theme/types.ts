import { PaletteOptions } from '@mui/material';

export interface ThemeOption {
  id: string;
  name: string;
  description?: string;
  palette: PaletteOptions;
  category?: 'light' | 'dark' | 'auto';
}
