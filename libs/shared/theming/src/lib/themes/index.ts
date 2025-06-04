export * from './cyberpunk';
export * from './corporate';

export const availableThemes = {
  cyberpunk: 'cyberpunk',
  corporate: 'corporate',
  // Add other themes here
} as const;

export type ThemeName = keyof typeof availableThemes;
