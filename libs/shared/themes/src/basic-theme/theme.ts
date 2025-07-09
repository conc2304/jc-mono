'use client';
import { createTheme, Theme, ThemeOptions } from '@mui/material';

import getComponentOverrides from './component-overrides';
import getPalette from './palette';
import getTypography from './typography';

// import '../fonts/index.css';  TODO later

const palette = getPalette();
const typography = getTypography(`'Roboto', sans-serif`);

const baseThemeOptions: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1266,
      xl: 1536,
    },
  },
  direction: 'ltr',
  mixins: {},
  palette,
  typography,
};

const theme = createTheme(baseThemeOptions);
export const BasicTheme: Theme = {
  ...theme,
  components: { ...theme.components, ...getComponentOverrides(theme) },
};
