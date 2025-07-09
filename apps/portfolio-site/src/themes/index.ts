import {
  cyberpunkTheme,
  basicTheme,
  hologramTheme,
  matrixTheme,
  retroTheme,
  sciFiTheme,
  ThemeConfig,
} from '@jc/augmented-ui';

export const ApplicationThemes: Record<string, ThemeConfig> = {
  default: basicTheme,
  cyberpunk: cyberpunkTheme,
  hologram: hologramTheme,
  matrix: matrixTheme,
  retro: retroTheme,
  sciFi: sciFiTheme,
} as const;
