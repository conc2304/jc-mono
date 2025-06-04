import { ThemeName } from '../themes';

export class ThemeManager {
  private currentTheme: ThemeName = 'cyberpunk';
  private themeChangeListeners: Array<(theme: ThemeName) => void> = [];

  getCurrentTheme(): ThemeName {
    return this.currentTheme;
  }

  setTheme(theme: ThemeName): void {
    this.currentTheme = theme;
    document.documentElement.className = theme;
    this.themeChangeListeners.forEach((listener) => listener(theme));
  }

  onThemeChange(listener: (theme: ThemeName) => void): () => void {
    this.themeChangeListeners.push(listener);
    return () => {
      const index = this.themeChangeListeners.indexOf(listener);
      if (index > -1) {
        this.themeChangeListeners.splice(index, 1);
      }
    };
  }

  getAvailableThemes(): ThemeName[] {
    return ['cyberpunk', 'corporate']; // Add more as you create them
  }
}

export const themeManager = new ThemeManager();
