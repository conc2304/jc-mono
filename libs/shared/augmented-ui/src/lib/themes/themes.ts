import { ThemeConfig } from './types';

import { basicTheme } from './basic-theme.css';
import { cyberpunkTheme } from './cyberpunk-theme.css';
import { hologramTheme } from './hologram-theme.css';
import { matrixTheme } from './matrix-theme.css';
import { retroTheme } from './retro-theme.css';
import { sciFiTheme } from './sci-fi-theme.css';

export const AvailableThemes: Record<string, ThemeConfig> = {
  cyberpunk: cyberpunkTheme,
  hologram: hologramTheme,
  matrix: matrixTheme,
  retro: retroTheme,
  sciFi: sciFiTheme,
  default: basicTheme,
};
