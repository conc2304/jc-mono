import { EnhancedThemeOption } from '../../types';

export const tresSendasTheme: EnhancedThemeOption = {
  id: 'tres-sendas',
  name: 'Tres Sendas',
  description:
    'Muted nature-inspired theme with rich forest greens and warm earth tones',
  category: 'minimal',
  supportsLight: true,
  supportsDark: true,
  lightPalette: {
    mode: 'light',
    primary: {
      main: '#8B6F47', // Muted saddle brown
      light: '#A0835C',
      dark: '#6B5339',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6B8E4B', // Muted forest green
      light: '#8BA55C',
      dark: '#556B3D',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B8956B', // Muted peru brown
      light: '#C8A57B',
      dark: '#9E7E58',
    },
    warning: {
      main: '#B8A054', // Muted goldenrod
      light: '#C8B064',
      dark: '#A89044',
    },
    info: {
      main: '#6B8BA8', // Muted steel blue
      light: '#7B9BB8',
      dark: '#5B7B98',
    },
    success: {
      main: '#8BAE5F', // Muted yellow green
      light: '#9BBE6F',
      dark: '#7B9E4F',
    },
    background: {
      paper: '#c1d8c1', // Very muted light green background
      default: '#c3d2c3', // Soft pale green for surfaces
    },
    text: {
      primary: '#3A4A3A', // Muted dark slate gray
      secondary: '#5A6B4A', // Muted dark olive green
    },
    divider: '#3A4A3A40', // Semi-transparent muted dark green
  },
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#B8956B', // Muted chocolate orange
      light: '#C8A57B',
      dark: '#A8855B',
      contrastText: '#000000',
    },
    secondary: {
      main: '#9BAE7F', // Muted lawn green
      light: '#ABBE8F',
      dark: '#8B9E6F',
      contrastText: '#000000',
    },
    error: {
      main: '#c7897a', // Muted sandy brown
      light: '#d9a28c',
      dark: '#b8786b',
    },
    warning: {
      main: '#D4C56B', // Muted gold
      light: '#E4D57B',
      dark: '#C4B55B',
    },
    info: {
      main: '#7BBCB8', // Muted turquoise
      light: '#8BCCC8',
      dark: '#6BACA8',
    },
    success: {
      main: '#B0C587', // Muted green yellow
      light: '#C0D597',
      dark: '#A0B577',
    },
    background: {
      default: '#2A3A2A', // Muted deep forest green background
      paper: '#3A4A3A', // Muted forest green for elevated surfaces
    },
    text: {
      primary: '#E8DCC8', // Muted wheat
      secondary: '#C8B8A8', // Muted burlywood for secondary text
    },
    divider: '#9BAE7F50', // Semi-transparent muted bright green
  },
};
