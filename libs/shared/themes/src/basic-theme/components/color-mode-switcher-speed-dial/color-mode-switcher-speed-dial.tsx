// Color Mode Switcher Component - Refactored
import React from 'react';
import { LightMode, DarkMode, SettingsBrightness } from '@mui/icons-material';
import {
  ResponsiveAction,
  TransitionConfig,
  SpeedDialResponsive,
} from '@jc/ui-components';
import { ColorMode } from '../../types';
import { useColorMode } from '../../context';

interface ColorModeSwitcherProps {
  direction?: 'row' | 'column';
  spacing?: number;
  arcStartDegree?: number;
  arcEndDegree?: number;
  itemSize?: number;
  radiusMultiplier?: number;
  staggerDelay?: number;
  transitionConfig?: TransitionConfig;
}

const ColorModeSwitcherSpeedDial: React.FC<ColorModeSwitcherProps> = ({
  direction = 'row',
  spacing = 1,
  arcStartDegree = 180,
  arcEndDegree = 270,
  itemSize = 40,
  radiusMultiplier = 1.8,
  staggerDelay = 50,
  transitionConfig = {
    start: { opacity: 0, scale: 0 },
    end: { opacity: 1, scale: 1 },
  },
}) => {
  const { mode, setMode, resolvedMode } = useColorMode();

  const handleModeChange = (newMode: ColorMode): void => {
    setMode(newMode);
  };

  const modes: ResponsiveAction[] = [
    {
      key: 'light',
      icon: <LightMode />,
      label: 'Light mode',
      onClick: () => handleModeChange('light'),
      isActive: mode === 'light',
      isResolved: resolvedMode === 'light',
    },
    {
      key: 'system',
      icon: <SettingsBrightness />,
      label: 'System mode',
      onClick: () => handleModeChange('system'),
      isActive: mode === 'system',
      isResolved: false,
    },
    {
      key: 'dark',
      icon: <DarkMode />,
      label: 'Dark mode',
      onClick: () => handleModeChange('dark'),
      isActive: mode === 'dark',
      isResolved: resolvedMode === 'dark',
    },
  ];

  return (
    <SpeedDialResponsive
      actions={modes}
      direction={direction}
      spacing={spacing}
      arcStartDegree={arcStartDegree}
      arcEndDegree={arcEndDegree}
      itemSize={itemSize}
      radiusMultiplier={radiusMultiplier}
      staggerDelay={staggerDelay}
      transitionConfig={transitionConfig}
    />
  );
};

export default ColorModeSwitcherSpeedDial;
export type { ColorModeSwitcherProps };
