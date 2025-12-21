'use client';
import {
  createTheme,
  Palette,
  PaletteOptions,
  responsiveFontSizes,
  Theme,
  ThemeOptions,
  TypographyVariantsOptions,
} from '@mui/material';

import getComponentOverrides from './component-overrides';
import { basicPalette } from './palettes';
import getTypography from './typography';
import { getHighestContrastColor } from './../utils';

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
const typographyFallBack = getTypography({
  primary: `'Exo 2', 'Helvetica Neue', Helvetica, Arial, sans-serif`,
  secondary: `'Eightgon', Arial, 'Trebuchet MS', Arial, sans-serif`,
  display: `'Solstice', Impact, 'Trebuchet MS', sans-serif`,
  monospace: `'JetBrains Mono', monospace`,
});

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

        shortHeight: 0,
        mediumHeight: 700,
        tallHeight: 900,
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

  const theme = responsiveFontSizes(createTheme(baseThemeOptions));

  const fullTheme: Theme = {
    ...theme,
    components: { ...theme.components, ...getComponentOverrides(theme) },
    zIndex: { ...theme.zIndex, window: 500 },
  };

  fullTheme.typography.display = {
    ...fullTheme.typography.display,
    [theme.breakpoints.up('sm')]: {
      fontSize: '2.75rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '3.5rem',
    },
  };

  fullTheme.palette.getInvertedMode = ((
    paletteColor?: PaletteOptionNames,
    reInvert = false
  ) => {
    const invertedMode = reInvert
      ? theme.palette.mode
      : theme.palette.mode === 'light'
      ? 'dark'
      : 'light';

    if (!paletteColor) {
      return invertedMode;
    }

    const color = theme.palette[paletteColor][invertedMode];
    return color;
  }) as Palette['getInvertedMode'];

  fullTheme.palette.getHighestContrastColor = getHighestContrastColor;

  return fullTheme;
};
