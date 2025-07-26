import { EnhancedThemeOption } from '../../types';

export const monochromeThemes: EnhancedThemeOption = {
  id: 'monochrome',
  name: 'Monochrome ',
  description: 'Pure greyscale dark theme emphasizing contrast and typography',
  category: 'corporate',
  supportsLight: true,
  supportsDark: true,
  darkPalette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#E0E0E0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#B0B0B0',
      light: '#D0D0D0',
      dark: '#909090',
      contrastText: '#000000',
    },
    error: {
      main: '#F5F5F5',
      light: '#FFFFFF',
      dark: '#E0E0E0',
    },
    warning: {
      main: '#CCCCCC',
      light: '#E0E0E0',
      dark: '#B0B0B0',
    },
    info: {
      main: '#999999',
      light: '#B0B0B0',
      dark: '#808080',
    },
    success: {
      main: '#DDDDDD',
      light: '#F0F0F0',
      dark: '#C0C0C0',
    },
    background: {
      default: '#000000',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    divider: '#404040',
  },

  lightPalette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#666666',
      light: '#808080',
      dark: '#4A4A4A',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#424242',
      light: '#616161',
      dark: '#212121',
    },
    warning: {
      main: '#757575',
      light: '#9E9E9E',
      dark: '#424242',
    },
    info: {
      main: '#9E9E9E',
      light: '#BDBDBD',
      dark: '#757575',
    },
    success: {
      main: '#616161',
      light: '#757575',
      dark: '#424242',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    divider: '#E0E0E0',
  },
};
