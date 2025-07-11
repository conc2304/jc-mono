import { useTheme } from '@mui/material/styles';

import { useColorMode } from './color-mode-context';
import { useEnhancedTheme } from './enhanced-theme-provider';

export const useThemeAwareStyles = () => {
  const theme = useTheme();
  const { resolvedMode } = useColorMode();
  const { currentTheme } = useEnhancedTheme();

  const cyberpunkGlow =
    currentTheme?.category === 'cyberpunk'
      ? {
          boxShadow: `0 0 20px ${theme.palette.primary.main}33`,
          border: `1px solid ${theme.palette.primary.main}66`,
        }
      : {};

  const retroStyles =
    currentTheme?.category === 'retro'
      ? {
          background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
        }
      : {};

  return {
    cyberpunkGlow,
    retroStyles,
    isDark: resolvedMode === 'dark',
    isLight: resolvedMode === 'light',
    themeCategory: currentTheme?.category,
  };
};
