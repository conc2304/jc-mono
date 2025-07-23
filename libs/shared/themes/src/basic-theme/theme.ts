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

type PaletteOptionNames =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

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
    mixins: {
      taskbar: {
        height: '3.5rem',
        minHeight: 45,
      },
      window: {
        titleBar: {
          height: '2.5rem',
          minHeight: 40,
        },
      },
      desktopIcon: {
        width: '4.375rem',
        maxHeight: '5.625rem',
      },
      paper: {
        opacity: 0.6,
      },
    },
    palette,
    typography,
  };

  const theme = createTheme(baseThemeOptions);

  const fullTheme: Theme = {
    ...theme,
    components: { ...theme.components, ...getComponentOverrides(theme) },
    zIndex: { ...theme.zIndex, window: 500 },
  };

  fullTheme.palette.getInvertedMode = ((paletteColor?: PaletteOptionNames) => {
    const invertedMode = theme.palette.mode === 'light' ? 'dark' : 'light';

    if (!paletteColor) {
      return invertedMode;
    }

    const color = theme.palette[paletteColor][invertedMode];
    return color;
  }) as Palette['getInvertedMode'];

  return fullTheme;
};
