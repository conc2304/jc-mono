import { Box, Tooltip, Stack, Typography, useTheme } from '@mui/material';
import {
  DarkMode,
  LightMode,
  SettingsSystemDaydream,
} from '@mui/icons-material';

import { type ColorMode } from '@jc/themes';
import { AugmentedButton } from '@jc/ui-components';

interface ModeSwitcherButtonGroupProps {
  mode: ColorMode;
  resolvedMode: 'light' | 'dark';
  systemMode: 'light' | 'dark';
  onModeChange?: (mode: ColorMode) => void;
  compact?: boolean;
}

export const ModeSwitcherButtonGroup = ({
  compact,
  onModeChange,
  mode,
  resolvedMode,
  systemMode,
}: ModeSwitcherButtonGroupProps) => {
  const theme = useTheme();

  const modeButtons = [
    {
      mode: 'light' as ColorMode,
      icon: <LightMode color="inherit" />,
      label: 'Light',
    },
    {
      mode: 'system' as ColorMode,
      icon: <SettingsSystemDaydream color="inherit" />,
      label: 'System',
    },
    {
      mode: 'dark' as ColorMode,
      icon: <DarkMode color="inherit" />,
      label: 'Dark',
    },
  ];

  const getButtonGroupShape = (index: number, totalItems: number) => {
    if (index === 0) return 'buttonLeftTop';
    if (index === totalItems - 1) return 'buttonRightTop';
    return 'buttonMiddle';
  };

  if (compact) {
    return (
      <Stack direction="row" spacing={0.5} width={'100%'}>
        {modeButtons.map(({ mode: btnMode, icon, label }, i, arr) => (
          <Tooltip key={btnMode} title={`${label} mode`}>
            <AugmentedButton
              fullWidth
              variant="outlined"
              size="medium"
              color={mode === btnMode ? 'primary' : 'secondary'}
              onClick={() => onModeChange && onModeChange(btnMode)}
              shape={getButtonGroupShape(i, arr.length)}
              sx={() => ({
                flex: 1,
              })}
            >
              {icon}
            </AugmentedButton>
          </Tooltip>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
      <Typography
        variant="caption"
        sx={{
          fontFamily: 'monospace',
          fontSize: '10px',
          color: theme.palette.primary.main,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          mb: 1,
          display: 'block',
        }}
      >
        Color Mode
      </Typography>
      <Stack direction="row" spacing={1}>
        {modeButtons.map(({ mode: btnMode, icon, label }, i, arr) => (
          <Tooltip key={btnMode} title={`${label} mode`}>
            <AugmentedButton
              variant="outlined"
              fullWidth
              size="large"
              color={mode === btnMode ? 'success' : 'secondary'}
              onClick={() => onModeChange && onModeChange(btnMode)}
              shape={getButtonGroupShape(i, arr.length)}
              sx={() => ({
                flex: 1,
              })}
            >
              {icon}
            </AugmentedButton>
          </Tooltip>
        ))}
      </Stack>
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          display: 'block',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: theme.palette.text.secondary,
        }}
      >
        Current: {resolvedMode.toUpperCase()}
        {mode === 'system' && `(${systemMode?.toUpperCase()})`}
      </Typography>
    </Box>
  );
};
