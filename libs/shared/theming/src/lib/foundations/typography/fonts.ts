/**
 * Font family definitions for different themes and use cases
 */
export const fontFamilies = {
  // System fonts - safe fallbacks
  system: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),

  // Monospace fonts
  mono: [
    '"JetBrains Mono"',
    '"Fira Code"',
    '"SF Mono"',
    'Consolas',
    '"Liberation Mono"',
    'Menlo',
    'Monaco',
    '"Courier New"',
    'monospace',
  ].join(', '),

  // Serif fonts
  serif: ['"Times New Roman"', 'Times', 'serif'].join(', '),

  // Theme-specific fonts
  cyberpunk: [
    '"Orbitron"',
    '"Exo 2"',
    '"Rajdhani"',
    '"JetBrains Mono"',
    'monospace',
  ].join(', '),

  corporate: [
    '"Inter"',
    '"Roboto"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'sans-serif',
  ].join(', '),

  retro: ['"Press Start 2P"', '"Courier New"', 'monospace'].join(', '),

  nature: [
    '"Nunito"',
    '"Open Sans"',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ].join(', '),
} as const;

// Google Fonts imports for themes
export const fontImports = {
  cyberpunk: [
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
  ],
  corporate: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  ],
  retro: [
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  ],
  nature: [
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap',
  ],
} as const;

export type FontFamily = keyof typeof fontFamilies;
export type ThemeFont = keyof typeof fontImports;
