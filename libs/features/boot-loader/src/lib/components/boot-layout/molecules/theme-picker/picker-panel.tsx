import { EnhancedThemeSwitcher, useEnhancedTheme } from '@jc/themes';

export const PickerPanel = ({
  compact = false,
  compactMenu = false,
  compactToggle = false,
  onClose,
}: {
  compact?: boolean;
  compactMenu?: boolean;
  compactToggle?: boolean;
  onClose: () => void;
}) => {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();

  return (
    <EnhancedThemeSwitcher
      themes={themes}
      selectedThemeId={currentThemeId}
      onThemeChange={(themeId, theme) => changeTheme(themeId)}
      showModeToggle={true}
      compact={compact}
      compactMenu={compactMenu}
      compactToggle={compactToggle}
      onClose={onClose}
    />
  );
};
