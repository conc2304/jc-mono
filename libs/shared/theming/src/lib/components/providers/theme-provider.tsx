import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeName } from '../../themes';
import { themeManager } from '../../utils/theme-manager';

interface ThemeContextValue {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'cyberpunk',
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
    themeManager.setTheme(defaultTheme);

    const unsubscribe = themeManager.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, [defaultTheme]);

  const handleSetTheme = (theme: ThemeName) => {
    themeManager.setTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        availableThemes: themeManager.getAvailableThemes(),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
