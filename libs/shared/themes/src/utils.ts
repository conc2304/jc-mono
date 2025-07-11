import { ThemeOption } from './basic-theme';

// Safe localStorage access for Next.js
export const getStoredTheme = (
  key: string,
  themes: ThemeOption[],
  defaultId: string
): string => {
  if (typeof window === 'undefined') return defaultId;

  try {
    const stored = localStorage.getItem(key);
    if (stored && themes.find((t) => t.id === stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return defaultId;
};
