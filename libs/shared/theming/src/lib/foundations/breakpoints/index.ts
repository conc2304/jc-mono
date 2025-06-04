export const breakpoints = {
  xs: '(min-width: 475px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  '3xl': '(min-width: 1920px)',

  // Custom breakpoints for specific use cases
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',

  // Orientation breakpoints
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',

  // High density displays
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Reduced motion preference
  reducedMotion: '(prefers-reduced-motion: reduce)',

  // Dark mode preference
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Breakpoint values for programmatic use (without media query syntax)
export const breakpointValues = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;
