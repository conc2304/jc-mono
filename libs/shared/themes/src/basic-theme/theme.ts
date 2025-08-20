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
const typographyFallBack = getTypography({
  primary: `'TimeBurner', 'Helvetica Neue', Helvetica, Arial, sans-serif`,
  secondary: `'Eightgon', Impact, 'Arial Black', 'Trebuchet MS', Arial, sans-serif`,
  display: `'Saiba', 'Orbitron', 'Exo 2', 'Rajdhani', 'Russo One', 'Trebuchet MS', Arial, sans-serif`,
  displayOutline: `'Saiba Outline', 'Orbitron', 'Exo 2', 'Rajdhani', 'Russo One', 'Trebuchet MS', Arial, sans-serif`,
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
      fontSize: '10rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '16rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '22rem',
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

  return fullTheme;
};
