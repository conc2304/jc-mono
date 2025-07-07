export type ThemeVariant = 'blue' | 'purple' | 'green' | 'orange' | 'teal';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  // Current theme variant (blue, purple, etc.)
  variant: ThemeVariant;

  // Current mode (light, dark, system)
  mode: ThemeMode;

  // Resolved theme (light or dark, accounting for system preference)
  resolvedTheme: ResolvedTheme;

  // System preference
  systemPreference: ResolvedTheme;

  // Functions to update theme
  setVariant: (variant: ThemeVariant) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void; // Toggles between light/dark for current variant

  // Available variants for UI
  availableVariants: ThemeVariant[];

  // Current theme class name for vanilla-extract
  currentThemeClass: string;
}
