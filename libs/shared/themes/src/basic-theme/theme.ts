'use client';
import {
  createTheme,
  PaletteOptions,
  Theme,
  ThemeOptions,
  TypographyVariantsOptions,
} from '@mui/material';

import getComponentOverrides from './component-overrides';
import { basicPalette } from './palettes';
import getTypography from './typography';

// import '../fonts/index.css';  TODO later
type CreateThemeOptionProps = {
  palette?: PaletteOptions;
  typography?: TypographyVariantsOptions;
};

const paletteFallback = basicPalette();
const typographyFallBack = getTypography(`'Roboto', sans-serif`);

export const createThemeFromOptions = ({
  palette = paletteFallback,
  typography = typographyFallBack,
}: CreateThemeOptionProps): Theme => {
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
    // mixins: {},
    palette,
    typography,
  };

  const theme = createTheme(baseThemeOptions);

  const fullTheme: Theme = {
    ...theme,
    components: { ...theme.components, ...getComponentOverrides(theme) },
  };

  return fullTheme;
};
