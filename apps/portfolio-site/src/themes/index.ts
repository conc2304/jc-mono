import {
  getBladeRunnerPalette,
  getCorporateDystopiaPalette,
  getHolographicPalette,
  getNeonCyberpunkPalette,
  getSynthwavePalette,
  ThemeOption,
} from '@jc/themes';

// Example theme definitions
export const availableThemes: ThemeOption[] = [
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Hot pink and electric cyan with pure black background',
    palette: getNeonCyberpunkPalette(),
    category: 'dark',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    description: 'Purple and orange retro 80s inspired',
    palette: getSynthwavePalette(),
    category: 'dark',
  },
  {
    id: 'corporate-dystopia',
    name: 'Corporate Dystopia',
    description: 'Muted blues and grays with electric accents',
    palette: getCorporateDystopiaPalette(),
    category: 'dark',
  },
  {
    id: 'holographic',
    name: 'Holographic Light',
    description: 'Clean futuristic with holographic vibes',
    palette: getHolographicPalette(),
    category: 'light',
  },
  {
    id: 'blade-runner',
    name: 'Blade Runner',
    description: 'Deep oranges and teals inspired by the classic film',
    palette: getBladeRunnerPalette(),
    category: 'dark',
  },
];
