import { EnhancedThemeOption } from '../types';
import { developerTerminalTheme } from './basic-themes/developer-terminal-palette';
import {
  desertSunsetTheme,
  electricSynthwaveTheme,
  euclidThemes,
  marathonThemes,
  monochromeThemes,
  neonCyberpunkTheme,
  oceanDepthTheme,
  synthwaveSunsetTheme,
  bubblegumDreamTheme,
  tresSendasTheme,
  arasakaTheme,
} from './enhanced-palettes';
import { bladeRunnerTheme } from './enhanced-palettes/blade-runner-palette';

export const enhancedThemes: EnhancedThemeOption[] = [
  developerTerminalTheme,
  monochromeThemes,
  oceanDepthTheme,
  desertSunsetTheme,
  tresSendasTheme,
  synthwaveSunsetTheme,
  electricSynthwaveTheme,
  marathonThemes,
  neonCyberpunkTheme,
  bladeRunnerTheme,
  bubblegumDreamTheme,
  euclidThemes,
  arasakaTheme,
];
