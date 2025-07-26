import { EnhancedThemeSwitcher, useEnhancedTheme } from '@jc/themes';

export const PickerPanel = () => {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();

  return (
    <EnhancedThemeSwitcher
      themes={themes}
      selectedThemeId={currentThemeId}
      onThemeChange={(themeId, theme) => changeTheme(themeId)}
      showModeToggle={true}
      compact={false}
    />
  );
};
