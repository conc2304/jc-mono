// app/theme-config.ts

import {
  defaultLightTheme,
  defaultDarkTheme,
  blueLight,
  blueDark,
  ThemeClassMapping,
} from '@jc/theming';
import {
  lightBeveledTheme,
  darkBeveledTheme,
  blueLightBeveledTheme,
  blueDarkBeveledTheme,
} from '@jc/ui-components';

// Application level theme mapping
export const appThemeClasses: ThemeClassMapping = {
  blue: {
    light: {
      main: blueLight,
      components: blueLightBeveledTheme,
    },
    dark: {
      main: blueDark,
      components: blueDarkBeveledTheme,
    },
  },
  default: {
    light: {
      main: defaultLightTheme,
      components: lightBeveledTheme,
    },
    dark: {
      main: defaultDarkTheme,
      components: darkBeveledTheme,
    },
  },
} as const;

// Typed helper function for theme registration
export const createThemeConfig = () => {
  return {
    themeClasses: appThemeClasses,
    availableVariants: ['default', 'blue'] as const,
  };
};
