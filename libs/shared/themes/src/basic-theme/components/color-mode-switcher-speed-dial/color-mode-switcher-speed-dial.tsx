// Color Mode Switcher Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Backdrop,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  SettingsBrightness,
  Palette,
  Close,
  Brightness4,
} from '@mui/icons-material';
import {
  RadialSpeedDial,
  SpeedDialAction,
  TransitionConfig,
} from '@jc/ui-components';
import { ColorMode } from '../../types';
import { useColorMode } from '../../context';

interface ColorModeSwitcherProps {
  arcStartDegree?: number;
  arcEndDegree?: number;
  itemSize?: number;
  radiusMultiplier?: number;
  staggerDelay?: number;
  transitionConfig?: TransitionConfig;
}

const ColorModeSwitcherSpeedDial: React.FC<ColorModeSwitcherProps> = ({
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { mode, setMode, resolvedMode } = useColorMode();

  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);

  const modes = [
    {
      mode: 'light' as const,
      icon: <LightMode />,
      label: 'Light',
    },
    {
      mode: 'system' as const,
      icon: <SettingsBrightness />,
      label: 'System',
    },
    {
      mode: 'dark' as const,
      icon: <DarkMode />,
      label: 'Dark',
    },
  ];

  const handleModeChange = (newMode: ColorMode): void => {
    setMode(newMode);
  };

  const handleSpeedDialClose = (): void => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialToggle = (): void => {
    setSpeedDialOpen(!speedDialOpen);
  };

  if (!isMobile) {
    // Desktop/tablet layout - horizontal stack
    return (
      <Stack direction="row" spacing={1}>
        {modes.map(({ mode: modeValue, icon, label }) => (
          <Tooltip key={modeValue} title={`${label} mode`}>
            <IconButton
              onClick={() => handleModeChange(modeValue)}
              size="small"
              sx={{
                width: itemSize,
                height: itemSize,
                border: '2px solid',
                borderColor:
                  resolvedMode === modeValue
                    ? alpha(theme.palette.warning.main, 0.5)
                    : mode === modeValue
                    ? theme.palette.primary.main
                    : theme.palette.divider,
                bgcolor:
                  mode === modeValue
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                color:
                  mode === modeValue
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                transition: theme.transitions.create(
                  ['background-color', 'border-color', 'color'],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                '&:hover': {
                  bgcolor:
                    mode === modeValue
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.04),
                },
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    );
  }

  // Mobile layout - custom radial SpeedDial
  const speedDialActions: SpeedDialAction[] = modes.map(
    ({ mode: modeValue, icon, label }) => ({
      key: modeValue,
      icon,
      tooltip: `${label} mode`,
      onClick: () => handleModeChange(modeValue),
      isActive: mode === modeValue,
      isResolved: resolvedMode === modeValue,
    })
  );

  return (
    <RadialSpeedDial
      isOpen={speedDialOpen}
      onToggle={handleSpeedDialToggle}
      onClose={handleSpeedDialClose}
      actions={speedDialActions}
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
export { RadialSpeedDial, ColorModeSwitcherSpeedDial };
export type { ColorModeSwitcherProps };
