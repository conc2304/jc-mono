import { ThemeName } from '../../themes';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createGlobalStyles } from '../../stitches/globals';

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
    // Apply theme class to document
    document.documentElement.className = currentTheme;

    // Apply global styles for current theme
    const globalStyles = createGlobalStyles(currentTheme);
    globalStyles();
  }, [currentTheme]);

  const handleSetTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        availableThemes: ['cyberpunk', 'corporate'],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
