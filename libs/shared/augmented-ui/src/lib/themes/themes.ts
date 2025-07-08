import { ThemeConfig } from './types';

import { cyberpunkTheme } from './cyberpunk-theme.css';
import { hologramTheme } from './hologram-theme.css';
import { matrixTheme } from './matrix-theme.css';
import { retroTheme } from './retro-theme.css';
import { sciFiTheme } from './sci-fi-theme.css';

export const themes: Record<string, ThemeConfig> = {
  cyberpunk: cyberpunkTheme,
  hologram: hologramTheme,
  matrix: matrixTheme,
  retro: retroTheme,
  sciFi: sciFiTheme,
};
