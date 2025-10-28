import { useEnhancedTheme } from '@jc/themes';

import { EnhancedThemeSwitcher } from './enhanced-theme-switcher';

export const EnhancedThemeSwitcherWithTheme = () => {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();

  return (
    <EnhancedThemeSwitcher
      themes={themes}
      selectedThemeId={currentThemeId}
      onThemeChange={(themeId, _theme) => changeTheme(themeId)}
      showModeToggle={true}
      compact={false}
    />
  );
};
