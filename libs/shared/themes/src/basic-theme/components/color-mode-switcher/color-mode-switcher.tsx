import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { useColorMode } from '../../context';
import { AugmentedButtonGroup, ButtonGroupItem } from '@jc/ui-components';

export const ColorModeSwitcher = () => {
  const { mode, setMode, resolvedMode } = useColorMode();

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
  };

  const colorModeItems: ButtonGroupItem[] = [
    {
      key: 'light',
      icon: <LightMode fontSize="small" />,
      label: 'Light mode',
      onClick: () => handleModeChange('light'),
      isActive: mode === 'light',
      isResolved: resolvedMode === 'light',
    },
    {
      key: 'system',
      icon: <SettingsBrightness fontSize="small" />,
      label: 'System mode',
      onClick: () => handleModeChange('system'),
      isActive: mode === 'system',
      isResolved: false,
    },
    {
      key: 'dark',
      icon: <DarkMode fontSize="small" />,
      label: 'Dark mode',
      onClick: () => handleModeChange('dark'),
      isActive: mode === 'dark',
      isResolved: resolvedMode === 'dark',
    },
  ];

  return (
    <AugmentedButtonGroup
      items={colorModeItems}
      upperClip="0.25rem"
      lowerClip="1rem"
      activeColor="warning.main"
      padding="12px"
      direction="row"
      spacing={0}
    />
  );
};
